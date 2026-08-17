# Gallipoli Wiki — SEO 后续行动

当前目标域名的 SEO 基础项已经上线并通过 smoke audit，无需修改 `gallipoli.wiki`，因为它不是本项目域名。

## 已完成

- 生产分支已包含 SEO 合并提交。
- `robots.txt`、`sitemap.xml`、`llms.txt` 已在线。
- 140 个 sitemap 页面已通过状态码、canonical、hreflang、JSON-LD 检查。
- 移动端 390px 布局已通过。

## 建议操作

1. 在 Google Search Console 添加 `www.gallipoligame.wiki` 属性。
2. 提交 `https://www.gallipoligame.wiki/sitemap.xml`。
3. 检查首页、Beginner’s Guide、Release Date 三个 URL 的索引状态。
4. 保持 Cloudflare 当前 DNS 配置；黄色 Proxying 提示可以忽略，不要为了消除提示强行切换代理。
