# Ansible — deploy Fanglao Summer Camp 2026

เว็บสาธารณะ Summer Dance Camp & Jam — TanStack Start + Nitro (Bun)

การ build (`bun run build`) สร้าง **`.output/`** (มี `server/index.mjs`) — systemd รัน `bun .output/server/index.mjs` จาก symlink `current`

## ความต้องการ

**เครื่องรัน Ansible**

- Ansible, Bun, rsync

**เซิร์ฟเวอร์ (Ubuntu/Debian)**

- Bun, Nginx, rsync
- PostgreSQL (หรือ DB ที่ `DATABASE_URL` ชี้ไป)
- Fanglao Admin API รันอยู่และเปิด public camp endpoints (`ADMIN_API_URL`)

## ครั้งแรก

### 1) ปรับ inventory และตัวแปร prod

แก้ `deploy/inventory/hosts.ini` ให้ตรง host ของคุณ

แก้ `deploy/group_vars/prod.yml` โดยเฉพาะ:

- `local_repo` — path ราก `Summer_Camp_2026` บนเครื่องคุณ
- `domain`, `ssl_email` — สำหรับ Let's Encrypt
- `port` — **3001** (แยกจาก Admin ที่ 3000 บนเซิร์ฟเวอร์เดียวกัน)
- `app_name` / `service` / `app_root` — ค่าเริ่มต้น `summer-camp-2026` + `/opt/summer-camp-2026`

### 2) ไฟล์ environment บนเซิร์ฟเวอร์

```bash
sudo cp deploy/templates/env.example /etc/summer-camp-2026.env
sudo nano /etc/summer-camp-2026.env
sudo chmod 600 /etc/summer-camp-2026.env
sudo chown root:root /etc/summer-camp-2026.env
```

ค่าสำคัญ: `ADMIN_API_URL`, `CAMP_API_KEY`, `SITE_URL`, `BETTER_AUTH_SECRET`, `DATABASE_URL`, `GA_MEASUREMENT_ID`

ดูรายการตัวแปรทั้งหมดได้จาก `.env.example` ที่รากโปรเจกต์

### 3) Setup systemd + nginx + SSL

```bash
cd /home/bird/Desktop/fanglao/Summer_Camp_2026/deploy
ansible-playbook playbooks/setup.yml
```

## Deploy

Playbook จะ **build บนเครื่องเรียก ansible** (`bun run build` ที่ `local_repo`) แล้ว rsync `.output/` ขึ้นเซิร์ฟเวอร์ สลับ symlink `current` และ restart service

ก่อน deploy ตรวจว่า `.env.production` บนเครื่อง local ถูกต้อง (ค่าจะถูก bake ตอน build สำหรับบางตัวแปร)

```bash
cd /home/bird/Desktop/fanglao/Summer_Camp_2026/deploy
ansible-playbook playbooks/deploy-website.yml
```

## Rollback

```bash
./deploy/scripts/rollback.sh
```

หรือ override:

```bash
APP_NAME=summer-camp-2026 SERVER_ROOT=/opt/summer-camp-2026 service=summer-camp-2026 ./deploy/scripts/rollback.sh
```

## โครงหน้าบนเซิร์ฟเวอร์

```
/opt/summer-camp-2026/
├── releases/
│   └── <epoch>/
│       └── .output/
│           ├── server/
│           └── public/
└── current -> releases/<epoch>/
```

## Troubleshooting

```bash
sudo systemctl status summer-camp-2026
sudo journalctl -u summer-camp-2026 -f
sudo nginx -t && sudo systemctl reload nginx
curl -fsS https://summer2026.fanglaostudio.com/
```

## หมายเหตุ

- Deploy เป็นแบบ symlink ใหม่แล้วสลับ `current` — release เก่าถูกตัดเมื่อเกิน `keep_releases`
- `port` ใน `prod.yml` ต้องตรงกับ `PORT` ใน `/etc/summer-camp-2026.env` (ค่าเริ่มต้น **3001**)
- Camp registration เรียก Admin API — ตั้ง `CAMP_API_KEY` ให้ตรงกับ `CAMP_PUBLIC_API_KEY` ใน Fanglao Admin
