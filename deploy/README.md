# 部署到 dearmon.daniellin.tw

> 改用 **static export + nginx 直送**,VPS 不需 Node / Docker。
> 環境假設:Ubuntu/Debian VPS、已有 nginx、DNS 在 Cloudflare。

## 架構

```
WSL  ─npm run build──▶  out/    (純靜態 HTML/CSS/JS)
                          │ rsync
                          ▼
VPS  /var/www/dearmon/  ─▶  nginx ─▶  Cloudflare ─▶  使用者
```

## 1. Cloudflare DNS / SSL

DNS:`dearmon` A 記錄指到 VPS IP(灰雲或橘雲皆可)

SSL/TLS 模式:**Flexible**(Cloudflare ↔ VPS 用 HTTP,使用者 ↔ Cloudflare 用 HTTPS,VPS 不需憑證)

## 2. VPS 第一次設定

```bash
# 建立網站目錄
sudo mkdir -p /var/www/dearmon
sudo chown -R $USER:$USER /var/www/dearmon

# 設 nginx vhost
cd /opt/dearmon          # 你已 clone 的 repo
git pull
sudo cp deploy/nginx-dearmon.conf /etc/nginx/sites-available/dearmon.daniellin.tw
sudo ln -s /etc/nginx/sites-available/dearmon.daniellin.tw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

如果之前有跑 Docker:

```bash
cd /opt/dearmon
docker compose down 2>/dev/null            # 把舊容器停掉
docker image rm dearmon:latest 2>/dev/null # 清掉佔空間的 image
```

## 3. WSL 端 build + 推到 VPS

```bash
cd ~/project/dearmon
npm run build                              # 產出 out/

# 把 out/ 同步到 VPS(--delete 會清掉伺服器上多餘檔)
rsync -avz --delete out/ root@<VPS_IP>:/var/www/dearmon/
```

> 把 `<VPS_IP>` 換成實際 IP 或 hostname。建議在 `~/.ssh/config` 設一個別名。

## 4. 之後每次更新

```bash
# 寫 code → commit → push GitHub
git push

# WSL build 並推
npm run build && rsync -avz --delete out/ root@<VPS_IP>:/var/www/dearmon/
```

可以考慮包成腳本 `deploy/push.sh` 或 npm script。

## 疑難排解

- **404 on /:** `/var/www/dearmon/index.html` 不存在 → rsync 沒成功,確認權限
- **403 Forbidden:** nginx 對 `/var/www/dearmon` 沒讀權限 → `sudo chown -R www-data:www-data /var/www/dearmon` 或開 755
- **Cloudflare 525/526:** SSL/TLS 模式不該用 Full(strict),改 Flexible
- **WSL 推送被擋:** 確認 VPS sshd 允許 root 或改用一般 user + `sudo chown` 給 nginx 讀

## 為何不用 Docker

VPS 只有 ~1 GB RAM,扣掉 Grafana/InfluxDB/PM2 等服務後不夠跑 Next.js build(會 OOM)。本站完全是 client-side React,沒有 SSR / API,適合 static export。
