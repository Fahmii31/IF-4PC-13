KODE PBL: IF-4PC-13

Judul: Smart Energy Management System Berbasis IoT untuk Monitoring Listrik Rumah Tangga

---

Deskripsi
Proyek ini merupakan sistem berbasis Internet of Things (IoT) yang digunakan untuk memonitor penggunaan listrik rumah tangga secara real-time.
Sistem ini mampu menampilkan parameter listrik seperti tegangan, arus, daya, energi (kWh), serta estimasi biaya listrik.

---

Fitur Utama
- Monitoring tegangan, arus, daya, dan kWh secara real-time
- Perhitungan estimasi biaya listrik
- Notifikasi jika daya atau biaya melebihi batas
- Penyimpanan riwayat penggunaan listrik harian, mingguan, dan bulanan
- Kontrol listrik (ON/OFF) melalui website

---

Tools yang digunakan
- Backend: Laravel
- Frontend: Next.js
- Database: MySQL (Laragon)
- IoT: PZEM-004T, ESP32, Modul Relay.

---

File ATS
Link Draft Laporan  : https://drive.google.com/file/d/15HiV5Xz52EpGh7V4o4UEhoyqOkfb3Kay/view?usp=drive_link 
Link Video          : https://youtu.be/SgRy4yOeZEY?si=MnpQWsCtcud8josn 


# Installation & Setup

## Prerequisites

Pastikan perangkat telah menginstal software berikut:

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL (Laragon/XAMPP)
- Git
- Arduino IDE atau PlatformIO

---

## Clone Repository

```bash
git clone <repository-url>
cd smart-energy-management-system
```

---

## Backend Setup (Laravel)

Masuk ke folder backend.

```bash
cd backend
```

Install dependency Laravel.

```bash
composer install
```

Salin file konfigurasi.

```bash
cp .env.example .env
```

Generate application key.

```bash
php artisan key:generate
```

Konfigurasikan database pada file **.env**.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_energy
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi database.

```bash
php artisan migrate
```

Jalankan server Laravel.

```bash
php artisan serve
```

Backend akan berjalan pada:

```
http://127.0.0.1:8000
```

---

## MQTT Listener

Jalankan MQTT Listener agar data dari ESP32 dapat diterima dan disimpan ke database.

```bash
php artisan mqtt:listen
```

Broker MQTT yang digunakan:

```
broker.hivemq.com
```

---

## Frontend Setup (Next.js)

Masuk ke folder frontend.

```bash
cd frontend
```

Install dependency.

```bash
npm install
```

Jalankan aplikasi.

```bash
npm run dev
```

Frontend dapat diakses melalui:

```
http://localhost:3000
```

---

## ESP32 Configuration

Install library berikut pada Arduino IDE atau PlatformIO:

- WiFi
- MQTTClient
- PZEM004Tv30
- IskakINO_LiquidCrystal_I2C
- Wire

Konfigurasikan WiFi.

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
```

Konfigurasikan MQTT.

```cpp
const char* mqtt_server = "broker.hivemq.com";

const char* sensor_topic = "smartenergy/pzem";
const char* relay_topic  = "smartenergy/relay";
```

Upload program ke ESP32.

---

## Hardware Wiring

| Komponen | ESP32 |
|----------|-------|
| PZEM TX | GPIO16 |
| PZEM RX | GPIO17 |
| Relay IN | GPIO27 |
| LCD SDA | GPIO21 |
| LCD SCL | GPIO22 |
| LCD VCC | 5V |
| LCD GND | GND |

---

## Running the System

Pastikan seluruh layanan telah berjalan:

- MySQL aktif.
- Backend Laravel berjalan.
- MQTT Listener berjalan.
- Frontend Next.js berjalan.
- ESP32 terhubung ke WiFi.
- ESP32 terhubung ke broker MQTT.

Jika seluruh langkah telah dilakukan dengan benar, data sensor akan dikirim dari ESP32 melalui MQTT, disimpan ke database MySQL oleh backend Laravel, dan ditampilkan secara real-time pada dashboard web.
