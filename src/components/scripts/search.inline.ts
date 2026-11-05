import { search, termsPattern, parseTerms, type SearchDoc } from "../../match"

// Quartz 在每个页面注入的内容索引：slug -> { title, content, ... }
declare const fetchData: Promise<Record<string, { title?: string; content?: string }>>

const MAX_RESULTS = 8

let docs: SearchDoc[] | null = null
const pageCache = new Map<string, Element[]>()
const cleanups: (() => void)[] = []

function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document,
  type: K,
  handler: (e: HTMLElementEventMap[K]) => void,
) {
  target.addEventListener(type, handler as EventListener)
  cleanups.push(() => target.removeEventListener(type, handler as EventListener))
}

async function loadDocs(): Promise<SearchDoc[]> {
  if (!docs) {
    const index = await fetchData
    docs = Object.entries(index).map(([slug, item]) => ({
      slug,
      title: item.title ?? "",
      content: (item.content ?? "").replace(/\s+/g, " ").trim(),
    }))
  }
  return docs
}

function pageUrl(slug: string): string {
  const base = document.body.dataset.basepath ?? ""
  const path = slug === "index" ? "" : slug.replace(/(^|\/)index$/, "$1")
  return `${base}/${path}`
}

async function fetchPage(slug: string): Promise<Element[]> {
  const cached = pageCache.get(slug)
  if (cached) return cached
  const url = new URL(pageUrl(slug), location.origin).toString()
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const html = new DOMParser().parseFromString(await res.text(), "text/html")
    // 预览挂在当前页面下，相对链接和图片需要按目标页地址重新解析
    for (const el of Array.from(html.querySelectorAll("[href], [src]"))) {
      const attr = el.hasAttribute("href") ? "href" : "src"
      const value = el.getAttribute(attr)
      if (value && !/^(?:[a-z]+:|#|\/)/i.test(value)) el.setAttribute(attr, new URL(value, url).toString())
    }
    const contents = Array.from(html.getElementsByClassName("popover-hint"))
    pageCache.set(slug, contents)
    return contents
  } catch {
    return []
  }
}

function highlightElement(root: Element, terms: string[]) {
  const pattern = termsPattern(terms)
  if (!pattern) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text)
  for (const node of nodes) {
    const text = node.nodeValue ?? ""
    const matches = [...text.matchAll(pattern)]
    if (matches.length === 0) continue
    const fragment = document.createDocumentFragment()
    let last = 0
    for (const m of matches) {
      fragment.append(text.slice(last, m.index))
      const span = document.createElement("span")
      span.className = "highlight"
      span.textContent = m[0]
      fragment.append(span)
      last = m.index + m[0].length
    }
    fragment.append(text.slice(last))
    node.replaceWith(fragment)
  }
}

function setup(root: Element) {
  const container = root.querySelector<HTMLElement>(".search-container")
  const button = root.querySelector<HTMLElement>(".search-button")
  const input = root.querySelector<HTMLInputElement>(".search-bar")
  const layout = root.querySelector<HTMLElement>(".search-layout")
  const results = root.querySelector<HTMLElement>(".results-container")
  if (!container || !button || !input || !layout || !results) return
  const preview = layout.querySelector<HTMLElement>(".preview-container")
  const sidebar = container.closest<HTMLElement>(".sidebar")

  let focused: HTMLAnchorElement | null = null
  let previewToken = 0
  let previewTimer: ReturnType<typeof setTimeout> | undefined

  const cards = () => Array.from(results.querySelectorAll<HTMLAnchorElement>("a.result-card"))

  const showPreview = async (card: HTMLAnchorElement | null) => {
    if (!preview) return
    const token = ++previewToken
    const contents = card ? await fetchPage(card.dataset.slug ?? "") : []
    if (token !== previewToken) return
    const inner = document.createElement("div")
    inner.className = "preview-inner"
    const terms = parseTerms(input.value)
    for (const el of contents) {
      const clone = el.cloneNode(true) as Element
      highlightElement(clone, terms)
      inner.append(clone)
    }
    preview.replaceChildren(inner)
    const first = inner.querySelector<HTMLElement>(".highlight")
    if (first) {
      const top = first.getBoundingClientRect().top - preview.getBoundingClientRect().top
      preview.scrollTop = Math.max(0, top - 50)
    }
  }

  const setFocus = (card: HTMLAnchorElement | null) => {
    focused?.classList.remove("focus")
    focused = card
    focused?.classList.add("focus")
    focused?.scrollIntoView({ block: "nearest" })
    clearTimeout(previewTimer)
    previewTimer = setTimeout(() => showPreview(focused), 150)
  }

  const moveFocus = (step: number) => {
    const list = cards()
    if (list.length === 0) return
    const current = focused ? list.indexOf(focused) : step > 0 ? -1 : list.length
    setFocus(list[Math.min(Math.max(current + step, 0), list.length - 1)] ?? null)
  }

  const open = () => {
    if (sidebar) sidebar.style.zIndex = "9999"
    container.classList.add("active")
    button.setAttribute("aria-expanded", "true")
    input.focus()
  }

  const close = () => {
    container.classList.remove("active")
    if (sidebar) sidebar.style.zIndex = ""
    button.setAttribute("aria-expanded", "false")
    input.value = ""
    layout.classList.remove("display-results")
    results.replaceChildren()
    preview?.replaceChildren()
    focused = null
  }

  const render = async () => {
    const query = input.value
    const hasQuery = query.trim() !== ""
    layout.classList.toggle("display-results", hasQuery)
    if (!hasQuery) {
      results.replaceChildren()
      setFocus(null)
      return
    }
    const hits = search(await loadDocs(), query, MAX_RESULTS)
    if (input.value !== query) return
    if (hits.length === 0) {
      const empty = document.createElement("div")
      empty.className = "result-card no-match"
      const title = document.createElement("h3")
      title.textContent = layout.dataset.noResults ?? ""
      const hint = document.createElement("p")
      hint.textContent = layout.dataset.noResultsHint ?? ""
      empty.append(title, hint)
      results.replaceChildren(empty)
      setFocus(null)
      return
    }
    results.replaceChildren(
      ...hits.map((hit) => {
        const card = document.createElement("a")
        card.className = "result-card"
        card.href = pageUrl(hit.slug)
        card.dataset.slug = hit.slug
        // title 与 snippet 已在 match.ts 中转义，只包含高亮用的 span
        card.innerHTML = `<h3 class="card-title">${hit.title}</h3><p class="card-description">${hit.snippet}</p>`
        return card
      }),
    )
    setFocus(cards()[0] ?? null)
  }

  on(button, "click", (e) => {
    e.stopPropagation()
    open()
  })
  on(container, "click", (e) => {
    if (e.target === container) close()
  })
  on(input, "input", render)
  on(input, "keydown", (e) => {
    if (e.isComposing) return
    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
      e.preventDefault()
      moveFocus(1)
    } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
      e.preventDefault()
      moveFocus(-1)
    } else if (e.key === "Enter" && focused) {
      e.preventDefault()
      // 先点击再关闭：关闭会移除结果卡片，脱离文档的链接不会走 Quartz 的单页跳转
      const target = focused
      target.click()
      close()
    }
  })
  on(results, "mouseover", (e) => {
    const card = (e.target as Element).closest<HTMLAnchorElement>("a.result-card")
    if (card && card !== focused) setFocus(card)
  })
  on(results, "click", (e) => {
    const card = (e.target as Element).closest("a.result-card")
    const modified = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
    if (card && !modified) close()
  })
  on(document, "keydown", (e) => {
    if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (container.classList.contains("active")) close()
      else open()
    } else if (e.key === "Escape" && container.classList.contains("active")) {
      e.preventDefault()
      close()
    }
  })
}

// Quartz 的单页跳转会替换页面 DOM，每次 nav 都要清理旧监听再重新绑定
function init() {
  cleanups.splice(0).forEach((fn) => fn())
  document.querySelectorAll(".search").forEach(setup)
}
document.addEventListener("nav", init)
document.addEventListener("render", init)
