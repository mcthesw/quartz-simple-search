import { defineConfig } from "tsup"
import type { Plugin } from "esbuild"

// Quartz 组件以字符串形式提供浏览器脚本，这里在构建时把 *.inline.ts 打包成文本。
const inlineScript: Plugin = {
  name: "inline-script",
  setup(build) {
    build.onLoad({ filter: /\.inline\.ts$/ }, async (args) => {
      const esbuild = await import("esbuild")
      const result = await esbuild.build({
        entryPoints: [args.path],
        bundle: true,
        minify: true,
        write: false,
        platform: "browser",
        format: "esm",
        target: "es2020",
      })
      return { contents: result.outputFiles[0]!.text, loader: "text" }
    })
  },
}

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: false,
  target: "es2022",
  platform: "node",
  external: ["preact", "preact/jsx-runtime"],
  esbuildOptions(options) {
    options.jsx = "automatic"
    options.jsxImportSource = "preact"
  },
  esbuildPlugins: [inlineScript],
})
