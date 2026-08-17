# Gallipoli Wiki — 最终线上 SEO 回归审计

审计目标：`https://www.gallipoligame.wiki/`
生产合并提交：`80c13b177f014656e85cbecf8511344e07693b36`

## 结论

目标站点线上 smoke audit 已通过。项目实际使用的域名是 `gallipoligame.wiki` 及其 `www` 子域；`gallipoli.wiki` 是外部参考域名，不属于本项目，不纳入 DNS、canonical 或重定向审计。

## 线上结果

- `https://gallipoligame.wiki/`：Vercel 308 到 `https://www.gallipoligame.wiki/`
- `https://www.gallipoligame.wiki/`：200，Production 生效
- `robots.txt`：200
- `sitemap.xml`：200，包含 140 个 URL
- `llms.txt`：200
- sitemap 中 140 个页面：全部 200
- canonical：140/140 正确
- hreflang：140/140 均包含 `en/tr/de/fr/x-default`
- SSR JSON-LD：140/140 可解析
- 重复标题：0 组
- 重复描述：0 组

## 移动端

390×844 视口下：

- `documentWidth=390`，无横向溢出
- 导航内容在视口内，右边界约 325px
- canonical 使用 `www.gallipoligame.wiki`
- 5 组 hreflang 生效
- JSON-LD 生效

## DNS 说明

Cloudflare 中 `gallipoligame.wiki` 的 DNS 记录指向 Vercel 且当前配置有效。Cloudflare 的 “Proxying is required” 是 Cloudflare 代理、安全和缓存功能的提示，不是站点不可访问错误；当前 Vercel Production 配置已经正常工作，不需要为了 SEO 修改这些记录。

## 后续建议

- 不要为外部域名 `gallipoli.wiki` 添加 DNS 或跳转规则。
- 保持 `gallipoligame.wiki` 根域到 `www.gallipoligame.wiki` 的现有跳转。
- 后续在 Google Search Console 提交：`https://www.gallipoligame.wiki/sitemap.xml`。
