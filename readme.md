# Laravel Inertia React App

A modern web application built with Laravel, Inertia.js, and React.

## 🚀 Getting Started

### Prerequisites

- PHP 8.0+
- Composer 2.0+
- Node.js 16+
- PostgreSQL 12+
- NPM 7+ or Yarn 1.22+

### 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/ssatriya/laracommerce
    cd laracommerce

    ```

2. **Install dependency**

    ```bash
    composer install
    npm install
    ```

3. Setup environment variable

    ```bash
    cp .env.example .env
    ```

4. Configure PostgreSQL in .env

    ```bash
    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=your_db_name
    DB_USERNAME=your_db_user
    DB_PASSWORD=your_db_password
    ```

5. **Generate application key**

    ```bash
    php artisan key:generate

    ```

6. **Run migration and seeder**

    ```bash
    php artisan migrate
    php artisan db:seed --class=RoleAndPermissionSeeder

    ```

7. **Run the application**
    ```bash
    php artisan serve
    npm run dev
    ```

# Panduan Penggunaan Aplikasi

## 🔐 Registrasi & Login

### Untuk Semua Pengguna

- **Registrasi**:
    - Akses `domain.com/register`
    - Untuk menjadi admin: isi kode `REGISTER_AS_ADMIN` pada input `Admin code`
- **Login**:
    - Akses `domain.com/login`

---

## 👨‍💻 ADMIN ROLE

### 1. Manajemen Produk & Kategori

- **Akses**:
    - Melalui navigasi sidebar kiri
- **Fitur**:
    - CRUD lengkap untuk Produk dan Kategori
    - **Alur pembuatan produk**:
        1. Buat kategori terlebih dahulu
        2. Tambahkan produk → kategori akan muncul otomatis
    - **Upload gambar**:
        - Minimal 1 gambar wajib diupload
        - Gambar akan diupload, disimpan file-nya di local disk dan metadata-nya di Database secara otomatis
        - Drag & drop untuk mengatur urutan gambar (tersimpan secara otomatis)
        - Gambar paling kiri dan sebelahnya otomatis menjadi thumbnail

### 2. Manajemen Pesanan

- **Fitur**:
    - Update status pesanan (di halaman Kelola Produk)

---

## 👤 USER ROLE

### 1. Registrasi & Profil

- **Registrasi**:
    - Tanpa kode khusus
    - Dapat upload foto profil (sama seperti admin)

### 2. Belanja & Checkout

- **Alur**:
    1. Akses Store dari Dashboard
    2. Tambahkan item ke keranjang
        - _Catatan_: Perlu refresh halaman untuk melihat update keranjang
    3. Lakukan checkout manual
- **Fitur**:
    - Riwayat pesanan tersimpan di menu **Pesanan Saya**
    - Hanya bisa melihat update status pesanan

### ⚠️ Catatan Pembayaran

_Saat ini aplikasi belum terintegrasi dengan payment gateway karena keterbatasan waktu pengembangan._

---

## 🛠 Known Issues

1. Keranjang belanja memerlukan refresh untuk update
2. Integrasi pembayaran dengan payment gateway belum tersedia
3. Gambar tanpa produk tidak terhapus secara otomatis (tidak cukup waktu untuk menambahkan fitur hapus dengan cron job)
4. Belum ada fitur hapus gambar di halaman buat produk untuk gambar yang sudah diupload
