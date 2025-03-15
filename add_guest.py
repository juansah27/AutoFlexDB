import json
import hashlib
import secrets
from datetime import datetime

# Fungsi untuk mengenkripsi password
def hash_password(password):
    salt = secrets.token_hex(8)
    h = hashlib.sha256()
    h.update((password + salt).encode('utf-8'))
    return f"{h.hexdigest()}:{salt}"

# Path ke file users.json
USERS_DB_FILE = 'users.json'

# Baca file users.json yang ada
with open(USERS_DB_FILE, 'r', encoding='utf-8') as file:
    users = json.load(file)

# Tambahkan user guest
guest_user = {
    "username": "guest",
    "name": "Guest User",
    "password": hash_password("guest123"),
    "role": "guest",
    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

users.append(guest_user)

# Simpan kembali ke file
with open(USERS_DB_FILE, 'w', encoding='utf-8') as file:
    json.dump(users, file, indent=4, ensure_ascii=False)

print("User guest berhasil ditambahkan!") 