# AutoFlexDB - Aplikasi Web Pemrosesan Excel

Aplikasi web untuk memproses file Excel dengan fungsi Bundle, Supplementary, dan Gift.

## Deskripsi

AutoFlexDB adalah versi web dari aplikasi desktop "All In One Set" yang digunakan untuk memproses dan memformat file Excel untuk berbagai keperluan seperti Bundle, Supplementary, dan Gift. Aplikasi ini dibuat menggunakan Flask dengan antarmuka pengguna modern dan responsif.

## Fitur

- Pemrosesan file Excel dengan berbagai jenis (Bundle, Supplementary, Gift)
- Validasi dan standarisasi format kolom
- Pengaturan format tanggal otomatis
- Opsi untuk menggabungkan semua sheet dalam satu file
- Tampilan log proses secara real-time
- Unduh hasil pemrosesan dalam format Excel
- Sistem manajemen pengguna dengan role-based access control

## Teknologi yang Digunakan

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **Library Utama**: Pandas, openpyxl

## Persyaratan

- Python 3.8 atau lebih baru
- Pip (Python package manager)

## Instalasi

1. Clone repositori ini:
   ```
   git clone https://github.com/yourusername/AutoFlexDB.git
   cd AutoFlexDB
   ```

2. Buat virtual environment:
   ```
   python -m venv venv
   ```

3. Aktifkan virtual environment:
   - Windows: `venv\Scripts\activate`
   - MacOS/Linux: `source venv/bin/activate` 

4. Install paket yang diperlukan:
   ```
   pip install -r requirements.txt
   ```

## Penggunaan

1. Pastikan database dan folder yang diperlukan sudah tersedia (folder uploads, output, dan database sudah disertakan dalam repositori)
   
2. Jalankan aplikasi:
   ```
   python app.py
   ```
   
3. Buka browser dan akses: `http://localhost:5000`

4. Gunakan kredensial default untuk login:
   - Username: admin
   - Password: admin123

5. Gunakan antarmuka web untuk mengunggah dan memproses file Excel

## Deployment ke Production

### Deploy ke PythonAnywhere

1. Daftar akun di [PythonAnywhere](https://www.pythonanywhere.com/)
2. Buat Web App baru dengan Flask
3. Clone repositori ini di PythonAnywhere:
   ```
   git clone https://github.com/yourusername/AutoFlexDB.git
   ```
4. Buat virtual environment dan install dependensi:
   ```
   mkvirtualenv --python=/usr/bin/python3.8 myenv
   pip install -r requirements.txt
   ```
5. Konfigurasi WSGI file untuk menunjuk ke app.py
6. Restart web app

### Deploy ke Heroku

1. Tambahkan file Procfile dengan konten:
   ```
   web: gunicorn app:app
   ```
2. Tambahkan dependensi gunicorn di requirements.txt
3. Push ke Heroku:
   ```
   heroku create autoflexdb
   git push heroku main
   ```

## Struktur File

```
AutoFlexDB/
├── app.py                  # File utama aplikasi Flask
├── database_helper.py      # Helper untuk operasi database
├── create_templates.py     # Pembuat template
├── requirements.txt        # Daftar paket yang diperlukan
├── database/               # Folder database
│   └── shop_mapping.db     # Database SQLite untuk mapping shop id
├── static/                 # File statis
│   ├── css/                
│   │   └── style.css       # File CSS
│   └── js/                 
│       └── script.js       # File JavaScript
├── templates/              # Template HTML
│   └── index.html          # Halaman utama aplikasi
├── uploads/                # Folder untuk file yang diunggah
└── output/                 # Folder untuk menyimpan hasil
```

## Kontributor

- Dibuat oleh: Handiyan Juansah

## Lisensi

Copyright © 2025 