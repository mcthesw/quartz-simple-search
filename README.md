# quartz-simple-search

给 [Quartz 5](https://quartz.jzhao.xyz/) 用的全文搜索插件：**标题或正文里包含你输入的文字，就能搜到。**

官方搜索按"词"建索引，中文常常搜不准：

- 输入 `kill` 搜不到 `Ultrakill`（只认词的开头）。
- 输入「套接字」会搜出只是分别含有「套」「接」「字」的文章。

这个插件直接做字符串包含匹配，没有分词，也没有模糊匹配，所见即所得。

## 规则

- 搜索范围：每个页面的标题和全部正文。
- 用空格分隔多个词时，每个词都要出现才算命中。不区分大小写。
- 排序：标题命中的排在前面，其余按搜索词在正文中出现的次数从多到少排。
- 最多显示 8 条结果，结果和预览中的搜索词会高亮。

界面沿用官方搜索的样式：点击搜索框或按 `Ctrl/⌘ + K` 打开，方向键选择，回车打开，`Esc` 关闭。桌面端右侧显示页面预览。

适合几百篇以内的个人站点。所有页面的文字会在打开搜索时一次性加载，这和官方插件一样。

## 安装

1. 安装插件：

   ```bash
   pnpm add @mcthesw/quartz-simple-search@github:mcthesw/quartz-simple-search#v1.0.1
   ```

2. 在 `quartz.config.yaml` 中，把官方搜索 `@quartz-community/search` 换成本插件：

   ```yaml
   - source: "@mcthesw/quartz-simple-search"
     enabled: true
     layout:
       position: left
       priority: 20
       group: toolbar
       groupOptions:
         grow: true
   ```

需要启用 `@quartz-community/content-index`（Quartz 默认已启用），插件从它生成的 `contentIndex.json` 读取页面文字。

## 选项

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `enablePreview` | `true` | 桌面端是否在结果右侧显示页面预览 |

## 开发

```bash
pnpm install
pnpm check   # 类型检查和单元测试
pnpm build   # 构建到 dist/
```

`dist/` 会随仓库一起提交，这样无需发布到 npm 就能通过 GitHub 地址安装。修改源码后记得重新构建并提交 `dist/`。

## 协议

[MIT](./LICENSE)。搜索框的结构和样式改编自 [@quartz-community/search](https://github.com/quartz-community/search)（MIT），见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
