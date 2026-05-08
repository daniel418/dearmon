# 部署到 dearmon.daniellin.tw

> 環境假設:Ubuntu/Debian VPS、已安裝 nginx、DNS 在 Cloudflare、Docker 尚未安裝。

## 1. Cloudflare DNS

在 Cloudflare → daniellin.tw → DNS:

| 類型 | 名稱     | 內容(VPS IP) | Proxy            |
| ---- | -------- | --------------- | ---------------- |
| A    | dearmon  | `<你的 VPS IP>` | 視需求(見下方)|

**Proxy 設定建議:**

- **橘雲(Proxied):** 用 Cloudflare 邊緣 SSL,SSL/TLS 模式設成 **Full (strict)**(伺服器仍要有有效 Let's Encrypt 憑證)。
- **灰雲(DNS only):** 直連 VPS,SSL 全靠 Let's Encrypt。

## 2. 在 VPS 上安裝 Docker(Ubuntu/Debian 官方倉庫)

```bash
# 移除舊版本(如果有)
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt-get remove -y $pkg 2>/dev/null
done

# 安裝 Docker official repo
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
     -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
                        docker-buildx-plugin docker-compose-plugin

# 把自己加進 docker 群組,免每次 sudo
sudo usermod -aG docker $USER
# 重新登入或執行:newgrp docker
```

> Debian 請把上面 `ubuntu` 換成 `debian`。

## 3. 拉 repo 並啟動容器

```bash
cd /opt   # 或你慣用的位置
sudo git clone https://github.com/<你的帳號>/dearmon.git
sudo chown -R $USER:$USER dearmon
cd dearmon

docker compose up -d --build
docker compose ps              # 確認狀態
docker compose logs -f         # 看 log
curl -I http://127.0.0.1:3000  # 應該看到 200
```

## 4. nginx 反向代理

```bash
sudo cp deploy/nginx-dearmon.conf /etc/nginx/sites-available/dearmon.daniellin.tw
sudo ln -s /etc/nginx/sites-available/dearmon.daniellin.tw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

此時用 `curl -H "Host: dearmon.daniellin.tw" http://127.0.0.1` 應該能看到頁面。

## 5. Let's Encrypt SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dearmon.daniellin.tw
```

certbot 會自動改寫 nginx 設定加上 443 server block,並設好 auto-renew(systemd timer)。

## 6. 之後更新

```bash
cd /opt/dearmon
git pull
docker compose up -d --build
```

需要更乾淨可以加 `docker image prune -f` 清理舊的 layer。

## 疑難排解

- **`docker compose up` build 失敗 `output: standalone` 沒生效:** 確認 `next.config.ts` 已含 `output: "standalone"`。
- **首頁載入但靜態資源 404:** 確認 `Dockerfile` 有 COPY `.next/static` 與 `public/`。
- **Cloudflare 顯示 521 / 522:** VPS 防火牆未開 80/443,或 nginx 沒在跑。
- **Cloudflare 顯示 525:** SSL/TLS 模式設成 Full (strict) 但 origin 沒有有效憑證 → 完成步驟 5 即可。
