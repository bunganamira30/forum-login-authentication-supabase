# Forum Sederhana dengan Supabase

Aplikasi forum sederhana yang memungkinkan pengguna untuk membuat akun, login, membuat postingan, mengedit, dan menghapus postingan mereka sendiri. Dibangun menggunakan vanilla JavaScript, Supabase untuk backend, dan Netlify untuk hosting.

## Fitur

- **Autentikasi Pengguna**: Registrasi dan login menggunakan Supabase Auth
- **Manajemen Postingan**: 
  - Membuat postingan baru
  - Mengedit postingan sendiri
  - Menghapus postingan sendiri
  - Melihat semua postingan atau hanya postingan sendiri
- **Real-time Updates**: Otomatis refresh setiap 10 detik
- **Row Level Security**: Keamanan data dengan RLS Supabase

## Teknologi yang Digunakan

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Hosting**: Netlify
- **CDN**: Supabase JS Client dari CDN

## Setup Supabase

### 1. Buat Project Supabase

Buat project baru di [Supabase](https://supabase.com)

### 2. Buat Tabel Posts

Jalankan SQL berikut di Supabase SQL Editor:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  user_id uuid references auth.users not null,
  user_name text not null,
  user_email text not null
);
```

### 3. Enable Row Level Security

```sql
-- Enable Row Level Security
alter table posts enable row level security;

-- Policy: Anyone can read posts
create policy "Anyone can read posts" on posts
  for select using (true);

-- Policy: Users can insert their own posts
create policy "Users can insert their own posts" on posts
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own posts
create policy "Users can update their own posts" on posts
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own posts
create policy "Users can delete their own posts" on posts
  for delete using (auth.uid() = user_id);
```

### 4. Konfigurasi Authentication

- Pastikan Email Auth sudah diaktifkan di Supabase Dashboard
- **Nonaktifkan** "Confirm email" jika ingin langsung bisa login tanpa verifikasi email
- Path: Authentication → Settings → Email Auth Settings

### 5. Update Credentials

Ganti `supabaseUrl` dan `supabaseKey` di file JavaScript dengan credentials project Anda:

```javascript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
```

Credentials bisa ditemukan di: Project Settings → API

## Struktur Project

```
project/
│
├── index.html          # Halaman login/register
├── forum.html          # Halaman forum utama
├── index.js            # Logic untuk autentikasi
└── forum.js            # Logic untuk forum (CRUD posts)
```

## Cara Menggunakan

### 1. Registrasi

- Buka halaman utama
- Klik "Daftar di sini"
- Masukkan nama, email, dan password (minimal 6 karakter)
- Klik "Daftar"
- Setelah berhasil, akan otomatis dialihkan ke form login

### 2. Login

- Masukkan email dan password
- Klik "Masuk"
- Akan diarahkan ke halaman forum

### 3. Membuat Postingan

- Tulis konten di textarea
- Klik "Posting"
- Postingan akan muncul di atas

### 4. Filter Postingan

- **Semua Postingan**: Tampilkan semua postingan dari semua user
- **Postingan Saya**: Tampilkan hanya postingan Anda

### 5. Edit/Hapus Postingan

- Tombol Edit dan Hapus hanya muncul di postingan Anda sendiri
- Klik "Edit" untuk mengubah konten
- Klik "Hapus" untuk menghapus postingan

## Deploy ke Netlify

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Via Netlify Dashboard

1. Drag & drop folder project ke Netlify Dashboard
2. Atau connect dengan Git repository
3. Deploy settings: 
   - Build command: (kosongkan)
   - Publish directory: `/` atau `.`

## Keamanan

### Row Level Security (RLS)

Aplikasi ini menggunakan RLS Supabase untuk keamanan:

- **Select**: Semua orang bisa membaca postingan
- **Insert**: User hanya bisa membuat postingan dengan user_id mereka sendiri
- **Update**: User hanya bisa update postingan mereka sendiri
- **Delete**: User hanya bisa delete postingan mereka sendiri

### Best Practices

- Supabase Anon Key aman untuk digunakan di frontend
- Jangan pernah expose Service Role Key
- RLS policies melindungi data di level database

## Troubleshooting

### Error: "posts" table not found

Pastikan sudah membuat tabel `posts` di Supabase SQL Editor

### Error: new row violates row-level security policy

Pastikan RLS policies sudah dibuat dengan benar

### Tidak bisa login setelah registrasi

- Cek email untuk link konfirmasi (jika email confirmation diaktifkan)
- Atau nonaktifkan email confirmation di Supabase settings

### Auto refresh tidak berjalan

Periksa console browser untuk error koneksi ke Supabase

## Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:

- Like/reaction pada postingan
- Komentar
- Upload gambar
- Rich text editor
- Notifikasi real-time
- Profile page
- Search dan filter lanjutan
- Pagination untuk postingan
