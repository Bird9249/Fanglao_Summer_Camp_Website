# Quick Start — Fanglao Summer Camp 2026

## 1. แก้ config

### `deploy/inventory/hosts.ini`

```ini
[prod]
your.server.ip ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

### `deploy/group_vars/prod.yml`

- `local_repo`: `/home/bird/Desktop/fanglao/Summer_Camp_2026`
- `domain`: `summer2026.fanglaostudio.com`
- `ssl_email`: อีเมลสำหรับ Let's Encrypt
- `port`: **3003** (Admin ใช้ 3000 บนเซิร์ฟเวอร์เดียวกัน)

## 2. เซิร์ฟเวอร์

```bash
curl -fsSL https://bun.sh/install | bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx rsync
sudo mkdir -p /opt/summer-camp-2026/releases
```

## 3. Environment

```bash
sudo cp deploy/templates/env.example /etc/summer-camp-2026.env
sudo nano /etc/summer-camp-2026.env
sudo chmod 600 /etc/summer-camp-2026.env
```

ตั้งค่าหลัก:

- `ADMIN_API_URL=https://admin.fanglaostudio.com`
- `CAMP_API_KEY=` (ตรงกับ Admin)
- `SITE_URL` / `BETTER_AUTH_URL` = URL เว็บ Camp
- `GA_MEASUREMENT_ID` = GA4 Measurement ID

## 4. Ansible

จากโฟลเดอร์ `deploy/`:

```bash
cd deploy
ansible-playbook playbooks/setup.yml
ansible-playbook playbooks/deploy-website.yml
```

`deploy-website.yml` รัน `bun run build` ที่ `local_repo` ก่อนส่ง `.output/` ขึ้นเซิร์ฟเวอร์

## 5. ตรวจสอบ

```bash
sudo systemctl status summer-camp-2026 nginx
sudo journalctl -u summer-camp-2026 -f
curl -fsS https://summer2026.fanglaostudio.com/
```

## 6. Rollback

```bash
./deploy/scripts/rollback.sh
```

## โครง release

```
/opt/summer-camp-2026/releases/<id>/.output/server/index.mjs
/opt/summer-camp-2026/current -> .../releases/<id>
```

## SSL renew

```bash
sudo certbot renew --nginx --quiet
sudo systemctl reload nginx
```
