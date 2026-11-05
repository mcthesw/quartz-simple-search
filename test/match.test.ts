import { describe, expect, test } from "vitest"
import { highlight, search, type SearchDoc } from "../src/match"

const docs: SearchDoc[] = [
  { slug: "a", title: "给博客加上隐私提交检查", content: "提交前检查文字，接入钩子。" },
  { slug: "b", title: "Ultrakill", content: "复古 FPS，手感很好。" },
  { slug: "c", title: "游戏", content: "这里列出 Ultrakill 和其他游戏，游戏，游戏。" },
  { slug: "d", title: "从 SOCKS5 看异步运行时", content: "异步运行时决定了接口形状。" },
]

const slugs = (query: string) => search(docs, query, 8).map((h) => h.slug)

describe("search", () => {
  test("matches any substring of a title", () => {
    expect(slugs("kill")).toEqual(["b", "c"])
  })

  test("requires CJK terms to appear contiguously", () => {
    expect(slugs("套接字")).toEqual([])
    expect(slugs("运行时")).toEqual(["d"])
  })

  test("requires every whitespace-separated term", () => {
    expect(slugs("socks5 异步")).toEqual(["d"])
    expect(slugs("socks5 游戏")).toEqual([])
  })

  test("ranks title matches first, then by occurrence count", () => {
    expect(slugs("游戏")).toEqual(["c"])
    expect(slugs("ultrakill")).toEqual(["b", "c"])
  })

  test("respects the limit", () => {
    expect(search(docs, "，", 1)).toHaveLength(1)
  })
})

describe("highlight", () => {
  test("escapes HTML and wraps every match case-insensitively", () => {
    expect(highlight("<b>Kill</b> kill", ["kill"])).toBe(
      '&lt;b&gt;<span class="highlight">Kill</span>&lt;/b&gt; <span class="highlight">kill</span>',
    )
  })

  test("prefers the longer term when terms overlap", () => {
    expect(highlight("异步运行时", ["运行", "运行时"])).toBe('异步<span class="highlight">运行时</span>')
  })
})
