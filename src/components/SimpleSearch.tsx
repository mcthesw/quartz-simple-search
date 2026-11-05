import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import style from "./styles"
// @ts-expect-error 构建时由 tsup 插件打包成字符串
import script from "./scripts/search.inline.ts"

export interface SimpleSearchOptions {
  /** 桌面端是否在结果右侧显示页面预览 */
  enablePreview: boolean
}

const strings = {
  zh: { title: "搜索", placeholder: "搜索内容...", noResults: "没有结果。", hint: "请尝试其他搜索词。" },
  en: {
    title: "Search",
    placeholder: "Search for something...",
    noResults: "No results.",
    hint: "Try another search term?",
  },
}

export default ((userOpts?: Partial<SimpleSearchOptions>) => {
  const opts: SimpleSearchOptions = { enablePreview: true, ...userOpts }

  const SimpleSearch: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const t = (cfg.locale ?? "en-US").startsWith("zh") ? strings.zh : strings.en
    return (
      <div class={["search", displayClass].filter(Boolean).join(" ")}>
        <button class="search-button" aria-label={t.title} aria-expanded="false">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7">
            <title>{t.title}</title>
            <g class="search-path" fill="none">
              <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" />
              <circle cx="8" cy="8" r="7" />
            </g>
          </svg>
          <p>{t.title}</p>
        </button>
        <div class="search-container">
          <div class="search-space">
            <input
              autocomplete="off"
              class="search-bar"
              name="search"
              type="text"
              aria-label={t.placeholder}
              placeholder={t.placeholder}
            />
            <div
              class="search-layout"
              data-preview={opts.enablePreview ? "true" : undefined}
              data-no-results={t.noResults}
              data-no-results-hint={t.hint}
            >
              <div class="results-container" role="listbox" aria-label={t.title}></div>
              {opts.enablePreview && <div class="preview-container"></div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  SimpleSearch.afterDOMLoaded = script
  SimpleSearch.css = style
  return SimpleSearch
}) satisfies QuartzComponentConstructor<Partial<SimpleSearchOptions>>
