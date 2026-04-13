# Portfolio Blog

Laravel + Next.js で構築したブログアプリです。Docker を使ってローカル環境を再現できます。

## 技術スタック

| 役割 | 技術 |
|---|---|
| バックエンド | Laravel 13 (PHP 8.4) |
| フロントエンド | Next.js 16 / React 19 / TypeScript |
| スタイリング | Tailwind CSS |
| データベース | MySQL 8.0 |
| Web サーバー | Nginx |
| インフラ | Docker / Docker Compose |

## 起動 URL

| サービス | URL |
|---|---|
| フロントエンド (Next.js) | http://localhost:3000 |
| バックエンド API (Laravel) | http://localhost:8080 |
| データベース (MySQL) | localhost:3306 |

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd portfolio-blog
```

### 2. 環境変数ファイルを作成

```bash
# プロジェクトルート
cp .env.example .env

# Laravel 用
cp backend/.env.example backend/.env
```

### 3. Docker コンテナを起動

```bash
docker compose up --build
```

> 初回はイメージのビルドに数分かかります。2 回目以降はキャッシュが効くため数秒で起動します。

### 4. Laravel の初期設定

```bash
# アプリケーションキーの生成
docker compose exec php php artisan key:generate

# マイグレーションの実行
docker compose exec php php artisan migrate
```

### 5. ブラウザで確認

- http://localhost:3000 → Next.js トップページ
- http://localhost:8080 → Laravel トップページ

## よく使うコマンド

```bash
# コンテナ起動
docker compose up

# コンテナ停止
docker compose down

# マイグレーション実行
docker compose exec php php artisan migrate

# マイグレーションをリセットして再実行
docker compose exec php php artisan migrate:fresh --seed

# Laravel のログ確認
docker compose logs php

# MySQL に接続
docker compose exec mysql mysql -u blog -p blog
```

## ディレクトリ構成

```
portfolio-blog/
├── docker-compose.yml
├── .env.example          # Docker Compose 用環境変数テンプレート
├── docker/
│   ├── nginx/
│   │   └── default.conf  # Nginx 設定
│   └── php/
│       └── Dockerfile    # PHP / Laravel 用
├── backend/              # Laravel プロジェクト
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── ...
└── frontend/             # Next.js プロジェクト
    ├── app/
    ├── public/
    └── ...
```
