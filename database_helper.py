import os
import sqlite3
import logging
from datetime import datetime

# Logging setup (akan menggunakan konfigurasi yang sama dengan app.py)
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Mendapatkan direktori kerja saat ini
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Fungsi untuk mendapatkan path lengkap file database
def get_db_path(db_name="shop_mapping.db"):
    db_dir = os.path.join(SCRIPT_DIR, 'database')
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, db_name)
    logging.info(f"Path database yang digunakan: {db_path}")
    return db_path

# Fungsi untuk memeriksa struktur database yang sudah ada
def check_and_update_database(db_file=get_db_path()):
    """
    Memeriksa struktur database yang sudah ada dan menambahkan tabel baru jika diperlukan
    tanpa merusak data yang sudah ada
    """
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Cek apakah tabel shop_mapping sudah ada
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='shop_mapping'")
        shop_mapping_exists = cursor.fetchone() is not None
        
        # Cek apakah tabel process_history sudah ada
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='process_history'")
        process_history_exists = cursor.fetchone() is not None
        
        # Log hasil pengecekan
        logging.info(f"Status tabel database: shop_mapping={shop_mapping_exists}, process_history={process_history_exists}")
        
        # Buat tabel yang belum ada
        if not shop_mapping_exists:
            logging.info("Membuat tabel shop_mapping baru...")
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS shop_mapping (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                marketplace TEXT NOT NULL,
                client TEXT NOT NULL,
                shop_id TEXT NOT NULL
            )
            """)
            
        if not process_history_exists:
            logging.info("Membuat tabel process_history baru...")
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS process_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                process_type TEXT NOT NULL,
                client TEXT,
                created_by TEXT,
                output_file TEXT,
                processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sheet_count INTEGER,
                record_count INTEGER
            )
            """)
        
        conn.commit()
        conn.close()
        
        return {
            'success': True,
            'shop_mapping_existed': shop_mapping_exists,
            'process_history_existed': process_history_exists,
            'shop_mapping_created': not shop_mapping_exists,
            'process_history_created': not process_history_exists
        }
        
    except Exception as e:
        logging.error(f"Kesalahan saat memeriksa/mengupdate database: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# Fungsi untuk inisialisasi tabel process_history
def initialize_history_table(db_file=get_db_path()):
    """Inisialisasi tabel untuk menyimpan riwayat pemrosesan"""
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Buat tabel process_history jika belum ada
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS process_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            process_type TEXT NOT NULL,
            client TEXT,
            created_by TEXT,
            output_file TEXT,
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sheet_count INTEGER,
            record_count INTEGER
        )
        """)
        
        conn.commit()
        conn.close()
        logging.info("Tabel process_history berhasil diinisialisasi")
        return True
    except Exception as e:
        logging.error(f"Kesalahan saat inisialisasi tabel process_history: {str(e)}")
        return False

# Fungsi untuk menyimpan riwayat pemrosesan
def save_process_history(file_name, process_type, client, created_by, output_file, sheet_count, record_count):
    """Simpan data riwayat pemrosesan file ke database"""
    try:
        conn = sqlite3.connect(get_db_path())
        cursor = conn.cursor()
        
        cursor.execute("""
        INSERT INTO process_history 
        (file_name, process_type, client, created_by, output_file, processed_at, sheet_count, record_count) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            file_name, 
            process_type, 
            client, 
            created_by, 
            output_file,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            sheet_count, 
            record_count
        ))
        
        conn.commit()
        conn.close()
        logging.info(f"Riwayat pemrosesan untuk {file_name} berhasil disimpan")
        return True
    except Exception as e:
        logging.error(f"Kesalahan saat menyimpan riwayat pemrosesan: {str(e)}")
        return False

# Fungsi untuk mendapatkan semua riwayat pemrosesan
def get_all_process_history(limit=100, offset=0):
    """Ambil semua data riwayat pemrosesan dari database"""
    try:
        conn = sqlite3.connect(get_db_path())
        cursor = conn.cursor()
        
        cursor.execute("""
        SELECT id, file_name, process_type, client, created_by, output_file, processed_at, sheet_count, record_count
        FROM process_history
        ORDER BY processed_at DESC
        LIMIT ? OFFSET ?
        """, (limit, offset))
        
        results = cursor.fetchall()
        
        # Konversi ke format yang lebih mudah dibaca
        history_data = []
        for row in results:
            history_data.append({
                'id': row[0],
                'file_name': row[1],
                'process_type': row[2],
                'client': row[3] or 'Unknown',
                'created_by': row[4] or '-',
                'output_file': row[5],
                'processed_at': row[6],
                'sheet_count': row[7],
                'record_count': row[8]
            })
        
        # Dapatkan total data
        cursor.execute("SELECT COUNT(*) FROM process_history")
        total_count = cursor.fetchone()[0]
        
        conn.close()
        return {
            'data': history_data,
            'total': total_count,
            'limit': limit,
            'offset': offset
        }
    except Exception as e:
        logging.error(f"Kesalahan saat mengambil riwayat pemrosesan: {str(e)}")
        return {
            'data': [],
            'total': 0,
            'limit': limit,
            'offset': offset
        }

# Fungsi untuk mencari riwayat pemrosesan
def search_process_history(query, limit=100, offset=0):
    """Cari data riwayat pemrosesan berdasarkan keyword"""
    try:
        conn = sqlite3.connect(get_db_path())
        cursor = conn.cursor()
        
        search_term = f"%{query}%"
        
        cursor.execute("""
        SELECT id, file_name, process_type, client, created_by, output_file, processed_at, sheet_count, record_count
        FROM process_history
        WHERE 
            file_name LIKE ? OR 
            process_type LIKE ? OR 
            client LIKE ? OR 
            created_by LIKE ?
        ORDER BY processed_at DESC
        LIMIT ? OFFSET ?
        """, (search_term, search_term, search_term, search_term, limit, offset))
        
        results = cursor.fetchall()
        
        # Konversi ke format yang lebih mudah dibaca
        history_data = []
        for row in results:
            history_data.append({
                'id': row[0],
                'file_name': row[1],
                'process_type': row[2],
                'client': row[3] or 'Unknown',
                'created_by': row[4] or '-',
                'output_file': row[5],
                'processed_at': row[6],
                'sheet_count': row[7],
                'record_count': row[8]
            })
        
        # Dapatkan total data yang cocok dengan pencarian
        cursor.execute("""
        SELECT COUNT(*) FROM process_history
        WHERE 
            file_name LIKE ? OR 
            process_type LIKE ? OR 
            client LIKE ? OR 
            created_by LIKE ?
        """, (search_term, search_term, search_term, search_term))
        
        total_count = cursor.fetchone()[0]
        
        conn.close()
        return {
            'data': history_data,
            'total': total_count,
            'limit': limit,
            'offset': offset
        }
    except Exception as e:
        logging.error(f"Kesalahan saat mencari riwayat pemrosesan: {str(e)}")
        return {
            'data': [],
            'total': 0,
            'limit': limit,
            'offset': offset
        }

# Fungsi untuk menghapus riwayat pemrosesan
def delete_process_history(history_id):
    """Hapus data riwayat pemrosesan dari database"""
    try:
        conn = sqlite3.connect(get_db_path())
        cursor = conn.cursor()
        
        # Cek apakah data ada
        cursor.execute("SELECT id FROM process_history WHERE id = ?", (history_id,))
        if not cursor.fetchone():
            conn.close()
            return False
        
        # Hapus data
        cursor.execute("DELETE FROM process_history WHERE id = ?", (history_id,))
        conn.commit()
        conn.close()
        
        logging.info(f"Riwayat pemrosesan dengan ID {history_id} berhasil dihapus")
        return True
    except Exception as e:
        logging.error(f"Kesalahan saat menghapus riwayat pemrosesan: {str(e)}")
        return False

# Panggil fungsi inisialisasi saat modul diimpor
# initialize_history_table()  # Kita ganti dengan check_and_update_database
check_and_update_database() 