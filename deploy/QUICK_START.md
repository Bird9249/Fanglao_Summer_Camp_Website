# Quick Start — Marketplace (Plateform)

## 1. แก้ config

### `deploy/inventory/hosts.ini`

```ini
[prod]
your.server.ip ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

### `deploy/group_vars/prod.yml`

- `local_repo`: path ราก repo บนเครื่องคุณ (ค่าตั้งต้นชี้ไปที่ `Plateform`)
- `domain`, `ssl_email`: สำหรับ certbot
- `app_name` / `service` / `app_root`: ชุดที่ต้องการ (ค่าตั้งต้น `marketplace` + `/opt/marketplace`)
- `port`: พอร์ต upstream (ควรตรงกับ `PORT` ใน env เช่น `3000`)

## 2. เซิร์ฟเวอร์

```bash
curl -fsSL https://bun.sh/install | bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx rsync
sudo mkdir -p /opt/marketplace
```

## 3. Environment

```bash
sudo cp deploy/templates/env.example /etc/marketplace.env   # หรือ /etc/<app_name>.env
sudo nano /etc/marketplace.env
sudo chmod 600 /etc/marketplace.env
```

## 4. Ansible

จากโฟลเดอร์ `deploy/` (เพื่อโหลด `ansible.cfg`):

```bash
cd deploy
ansible-playbook playbooks/setup.yml
ansible-playbook playbooks/deploy-website.yml
```

`deploy-website.yml` รัน `bun run build` ที่ `local_repo` ก่อนส่ง `.output/` ขึ้นเซิร์ฟเวอร์

## 5. ตรวจสอบ

```bash
sudo systemctl status marketplace nginx
sudo journalctl -u marketplace -f
curl -fsS https://YOUR_DOMAIN/
```

## 6. Rollback

```bash
./deploy/scripts/rollback.sh
```

## โครง release

```
/opt/marketplace/releases/<id>/.output/server/index.mjs
/opt/marketplace/current -> .../releases/<id>
```

## SSL renew

บนเซิร์ฟเวอร์ (หรือใช้ cron ที่ playbook setup ไว้):

```bash
sudo certbot renew --nginx --quiet
sudo systemctl reload nginx
```
