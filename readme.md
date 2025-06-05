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
