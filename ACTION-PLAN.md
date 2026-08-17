# Gallipoli Wiki — SEO 回归行动清单

## P0：先让 667d159 进入生产

将 `667d159` 合并到 Vercel 生产分支（当前远端 `main` 仍是 `399c14a`），或把生产部署目标切换到已包含 `667d159` 的分支。不要以 preview deployment 作为完成标准。

上线后必须确认：

- `git ls-remote origin main` 返回 `667d159` 或其后代提交。
- `https://www.gallipoligame.wiki/robots.txt` 返回 `200`。
- `https://www.gallipoligame.wiki/sitemap.xml` 返回 `200`，并包含 140 个 URL。
- `https://www.gallipoligame.wiki/llms.txt` 返回 `200`。
- 首页原始 `curl` 响应即可看到目标 canonical、`x-default` 和 JSON-LD，不需要等待 hydration。

## P1：重新跑线上回归

生产缓存刷新后重新抓取最多 500 页，重点确认：

- 140 个 URL 的 canonical 全部使用 `www.gallipoligame.wiki`。
- 每页具备 `en/tr/de/fr/x-default` 五组 hreflang。
- SSR JSON-LD 可解析，Article/FAQPage 与页面类型对应。
- 标题、描述无重复和长度异常。
- `gallipoli.wiki`、`gallipoli.wiki` 的其他旧入口统一 301 到目标主机。

## P1：提交索引入口

确认生产 sitemap 后，在 Google Search Console 添加/提交：

`https://www.gallipoligame.wiki/sitemap.xml`

同时检查首页和 2–3 个高意图页面的 URL Inspection；当前没有可用的 GSC 现场数据，不能据此判断已收录。

## P2：性能复测

新部署生效后重新运行移动端和桌面端 PageSpeed Insights，并记录 LCP、INP、CLS、总传输量。当前线上浏览器采样 FCP 约 4.94 秒、传输约 3.71 MiB；这些指标不能替代正式 CrUX/PSI 现场数据。

