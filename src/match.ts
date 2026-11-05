export interface SearchDoc {
  slug: string
  title: string
  content: string
}

export interface SearchHit {
  slug: string
  /** 已转义并带高亮标记的 HTML */
  title: string
  /** 已转义并带高亮标记的 HTML */
  snippet: string
}

const SNIPPET_BEFORE = 30
const SNIPPET_LENGTH = 140

/** 按空白拆分搜索词，统一小写并去重。 */
export function parseTerms(query: string): string[] {
  return [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))]
}

export function escapeHTML(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + needle.length)) {
    count++
  }
  return count
}

/** 匹配任一搜索词的正则，长词优先，避免短词抢先截断长词。 */
export function termsPattern(terms: string[]): RegExp | null {
  if (terms.length === 0) return null
  const source = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  return new RegExp(source, "gi")
}

/** 转义文本并把命中的搜索词包进 `<span class="highlight">`。 */
export function highlight(text: string, terms: string[]): string {
  const pattern = termsPattern(terms)
  if (!pattern) return escapeHTML(text)
  let html = ""
  let last = 0
  for (const match of text.matchAll(pattern)) {
    html += escapeHTML(text.slice(last, match.index))
    html += `<span class="highlight">${escapeHTML(match[0])}</span>`
    last = match.index + match[0].length
  }
  return html + escapeHTML(text.slice(last))
}

function snippet(content: string, lowerContent: string, terms: string[]): string {
  const positions = terms.map((t) => lowerContent.indexOf(t)).filter((i) => i !== -1)
  const first = positions.length > 0 ? Math.min(...positions) : 0
  const start = Math.max(0, first - SNIPPET_BEFORE)
  const end = Math.min(content.length, start + SNIPPET_LENGTH)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < content.length ? "…" : ""
  return prefix + highlight(content.slice(start, end), terms) + suffix
}

/**
 * 返回标题或正文包含全部搜索词的文档。
 * 排序：标题命中的词数多者优先，其次是正文中出现的总次数，最后保持原有顺序。
 */
export function search(docs: SearchDoc[], query: string, limit: number): SearchHit[] {
  const terms = parseTerms(query)
  if (terms.length === 0) return []

  const ranked: { doc: SearchDoc; lowerContent: string; titleHits: number; count: number }[] = []
  for (const doc of docs) {
    const lowerTitle = doc.title.toLowerCase()
    const lowerContent = doc.content.toLowerCase()
    if (!terms.every((t) => lowerTitle.includes(t) || lowerContent.includes(t))) continue
    ranked.push({
      doc,
      lowerContent,
      titleHits: terms.filter((t) => lowerTitle.includes(t)).length,
      count: terms.reduce((sum, t) => sum + countOccurrences(lowerContent, t), 0),
    })
  }
  ranked.sort((a, b) => b.titleHits - a.titleHits || b.count - a.count)

  return ranked.slice(0, limit).map(({ doc, lowerContent }) => ({
    slug: doc.slug,
    title: highlight(doc.title, terms),
    snippet: snippet(doc.content, lowerContent, terms),
  }))
}
