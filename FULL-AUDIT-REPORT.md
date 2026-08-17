# Gallipoli Wiki — 最终线上 SEO 回归审计

审计时间：2026-08-17 19:47（Asia/Shanghai）  
目标：<https://www.gallipoligame.wiki/>  
代码提交：`667d159e2701343d8b2fafc5fc724d872326545b`

## 结论

线上回归未通过。`667d159` 已存在于 `origin/agent/publish-gallipoli-wiki`，但 `origin/main` 仍为 `399c14a0c2ecd8fdf20f02406d4656f0fa2c7987`；生产域名返回的 ETag 仍为旧部署。当前需要先完成生产分支合并或正式 redeploy，之后才能把 SEO 修复视为上线生效。

## 生产部署证据

| 检查项 | 当前线上结果 |
| --- | --- |
| `origin/agent/publish-gallipoli-wiki` | `667d159` |
| `origin/main` | `399c14a` |
| `www.gallipoligame.wiki/` | `200`，ETag `06d9a37…`，Vercel cache HIT |
| `www.gallipoligame.wiki/robots.txt` | `404` |
| `www.gallipoligame.wiki/sitemap.xml` | `404` |
| `www.gallipoligame.wiki/llms.txt` | `404` |
| `gallipoligame.wiki/` | `308` 到 `www.gallipoligame.wiki` |
| `gallipoli.wiki/` | 独立 `200`，没有 301 到目标主机 |

## 全站抓取结果

由于线上没有可用的 sitemap，本轮从首页跟随同域 HTML 链接抓取，最多 500 页；实际发现 106 个 HTML 页面，全部返回 `200`。这代表可发现页面，不代表完整站点范围；缺少 sitemap 使语言版本和未被普通链接发现的路由无法完整核验。

### 原始 SSR HTML

- 106/106 页的 canonical 都指向旧主机 `https://gallipoli.wiki/...`。
- 106/106 页只有 `en/tr/de/fr` alternate，没有 `x-default`，且 alternate 仍指向旧主机。
- 106/106 页没有原始 SSR JSON-LD。
- 标题重复 9 组；10 页标题短于 30 个字符；没有发现超过 60 个字符的标题。
- 描述重复 5 组；本轮 106 页没有发现短于 70 个字符的描述。
- 未发现缺失 H1 的页面。
- 抓到的 215 个 `<img>` 主要是 logo 装饰图，均使用空 alt；当前内容图主要通过 CSS 背景渲染，因此这不是本轮首要问题。

### 浏览器 hydration 后

- 首页 hydration 后出现 1 个 `WebSite` JSON-LD，canonical 被客户端改为 `www.gallipoligame.wiki`；但原始响应 HTML 仍是旧 canonical，搜索引擎不能依赖客户端修正。
- Beginner’s Guide hydration 后出现 `WebSite`、`FAQPage`、`Article`，但 4 个 alternate 仍指向 `gallipoli.wiki`，仍没有 `x-default`。
- 线上没有 667d159 新增的 editorial trust bar。

## 移动端与性能

### 移动端

在真实浏览器 390×844 视口下：

- `documentWidth=390`、`innerWidth=390`，页面通过隐藏溢出避免了水平滚动条。
- 但旧版主导航的可见链接仍延伸到约 `x=679`，被 390px 视口裁切；线上移动截图显示导航、索引和内容卡片区域出现明显裁切/大面积空白。
- 本地 `667d159` 已验证的移动菜单和单列布局尚未在线生效。

截图：`output/online-audit/www_gallipoligame_wiki_mobile.png`

### 性能采样

本轮浏览器线上采样：

- FCP：约 4,936 ms
- load event：约 7,032 ms
- 传输量：约 3.71 MiB，13 个资源

PageSpeed Insights API 本轮请求超时，因此没有把旧缓存的 PSI 分数当作本轮新结果。性能回归需要在新部署生效后重新跑 PSI；本地 667d159 已加入响应式 AVIF/WebP 资源与预加载优化。

## 线上阻断项

1. 生产域名没有运行 `667d159`。
2. 目标主机缺少 `robots.txt`、`sitemap.xml`、`llms.txt`。
3. SSR canonical、Open Graph URL 和 hreflang 仍指向 `gallipoli.wiki`，且该旧主机仍独立返回 200。
4. SSR 没有结构化数据；schema 仅在浏览器 hydration 后部分出现。
5. 移动端仍是旧版桌面导航/布局。

## 已在 `667d159` 中完成、但线上尚未验证的修复

- 统一 `www.gallipoligame.wiki` canonical host。
- 生成 140 个本地 sitemap URL、robots、llms.txt。
- SSR 输出 Organization、WebSite、WebPage、Article、FAQPage JSON-LD。
- 添加 `x-default` hreflang、绝对 OG/Twitter URL 和作者/发布者信息。
- 添加旧主机 301 规范化 middleware。
- 修复标题/描述长度与重复问题。
- 添加 editorial trust bar、Quick Answer、响应式移动布局和 AVIF/WebP 资源。

