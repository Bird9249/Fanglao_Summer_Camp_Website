# Ansible — deploy โปรเจกต์ Marketplace (TanStack Start + Nitro/Bun)

รากโปรเจกต์: `package.json` (`name`: marketplace). การ build (`bun run build`) สร้าง **`.output/`** (มี `server/index.mjs`) ผ่าน Vite + Nitro preset `bun` — service ตั้ง `WorkingDirectory` เป็น symlink `current` ของ release แล้วรัน `bun .output/server/index.mjs`

## ความต้องการ

**เครื่องรัน Ansible**

- Ansible, Bun, rsync

**เซิร์ฟเวอร์ (Ubuntu/Debian)**

- Bun, Nginx, rsync  
- PostgreSQL (หรือ DB ที่ `DATABASE_URL` ชี้ไป)

## ครั้งแรก

### 1) ปรับ inventory และตัวแปร prod

แก้ `deploy/inventory/hosts.ini` ให้ตรง host ของคุณ  

แก้ `deploy/group_vars/prod.yml` โดยเฉพาะ:

- `local_repo` — path ราก repo นี้บนเครื่องคุณ  
- `domain`, `ssl_email` — สำหรับ Let's Encrypt  
- `app_name` / `service` / `app_root` — ถ้าต้องการชื่ออื่น ให้เปลี่ยนคู่กัน และตั้ง env ที่ `/etc/<app_name>.env`

ตัวแปร `[[app_name]]` ใน template ของ systemd ชี้ไปที่ชื่อไฟล์ใน `deploy/playbooks/templates/[[app_name]].service.j2` — playbook จะเขียนไปเป็น `/etc/systemd/system/{{ app_name }}.service`

### 2) ไฟล์ environment บนเซิร์ฟเวอร์

จากตัวอย่าง:

```bash
sudo cp deploy/templates/env.example /etc/marketplace.env
sudo nano /etc/marketplace.env
sudo chmod 600 /etc/marketplace.env
sudo chown root:root /etc/marketplace.env
```

ถ้าเปลี่ยน `app_name` ใน `prod.yml` ให้ใช้ชื่อไฟล์เดียวกัน เช่น `/etc/<app_name>.env`

ค่าสำคัญ: `NODE_ENV`, `PORT`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CORS_ORIGIN` และค่าอื่นที่โค้ดเรียกใช้

### 3) Setup systemd + nginx + SSL

แนะนำรันจากโฟลเดอร์ `deploy/` เพื่อให้โหลด `ansible.cfg` และ inventory เริ่มต้นถูกต้อง

```bash
cd /path/to/Plateform/deploy
ansible-playbook playbooks/setup.yml
```

จากรากโปรเจกต์แทนได้: `ANSIBLE_CONFIG=deploy/ansible.cfg ansible-playbook -i deploy/inventory/hosts.ini deploy/playbooks/setup.yml`

## Deploy

Playbook จะ **build บนเครื่องเรียก ansible** (`bun run build` ที่ `local_repo`) แล้ว rsync `.output/` ขึ้นเซิร์ฟเวอร์ สลับ symlink `current` และ restart service

```bash
cd /path/to/Plateform/deploy
ansible-playbook playbooks/deploy-website.yml
```

## Rollback

```bash
export APP_NAME=marketplace SERVER_ROOT=/opt/marketplace service=marketplace
./deploy/scripts/rollback.sh
```

(ค่า default ของสคริปต์เป็นชุด marketplace อยู่แล้ว — override ได้ด้วย env)

## โครงหน้าบนเซิร์ฟเวอร์

```
/opt/marketplace/
├── releases/
│   └── <epoch>/
│       └── .output/
│           ├── server/
│           └── public/
└── current -> releases/<epoch>/
```

## Troubleshooting

```bash
sudo systemctl status marketplace
sudo journalctl -u marketplace -f
sudo nginx -t && sudo systemctl reload nginx
```

## หมายเหตุ

- Deploy เป็นแบบ symlink ใหม่แล้วสลับ `current` — release เก่าถูกตัดเมื่อเกิน `keep_releases`  
- พอร์ตที่ nginx proxy ควรตรงกับ `port` ใน `prod.yml` และค่าที่แอป listen (โดยทั่วไปสอดคล้อง `PORT` ในไฟล์ env)
