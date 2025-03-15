document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM dengan pengecekan keberadaan
    const historyTable = document.getElementById('historyTable');
    const historyTableBody = document.getElementById('historyTableBody');
    const refreshButton = document.getElementById('refreshHistory');
    const searchInput = document.getElementById('searchHistory');
    const statusFilter = document.getElementById('statusFilter');
    const clearFilters = document.getElementById('clearFilters');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.querySelector('#deleteModal .close');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteItemDetails = document.getElementById('deleteItemDetails');
    const paginationInfo = document.getElementById('paginationInfo');

    // Variabel untuk data dan pagination
    let historyData = [];
    let filteredData = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let deleteItemId = null;

    // Variabel untuk menyimpan data semua riwayat
    let allHistoryData = [];
    
    // Variabel untuk menyimpan status pagination
    let totalPages = 0;

    // Filter dan pagination
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            applyFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentPage = 1;
            applyFilters();
        });
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = 'all';
            currentPage = 1;
            applyFilters();
        });
    }
    
    // Perubahan jumlah item per halaman
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            applyFilters();
        });
    }
    
    // Navigasi halaman
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                updatePagination();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                updatePagination();
            }
        });
    }
    
    // Tombol refresh data
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            loadHistoryData();
        });
    }

    // Event listener untuk tombol download template
    document.getElementById('downloadTemplateBtn').addEventListener('click', function() {
        const processType = document.getElementById('templateTypeSelect').value;
        
        // Tampilkan loading state pada tombol
        const originalButtonContent = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.disabled = true;
        
        // Tampilkan notifikasi bahwa template sedang diunduh
        showNotification('Mengunduh template...', 'info', 'Informasi');
        
        // Buat URL untuk download template
        const templateUrl = `/download_template/${processType}`;
        
        // Buat link sementara untuk mengunduh file
        const tempLink = document.createElement('a');
        tempLink.href = templateUrl;
        tempLink.target = '_blank';
        
        // Tangani baik sukses maupun error
        setTimeout(() => {
            // Kembalikan tombol ke state semula
            this.innerHTML = originalButtonContent;
            this.disabled = false;
            
            // Tambahkan notifikasi sukses setelah jeda singkat
            setTimeout(() => {
                showNotification(`Template ${processType} berhasil diunduh`, 'success', 'Berhasil');
            }, 1000);
        }, 1500);
        
        // Klik link untuk mulai unduhan
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });

    // Fungsi CRUD
    async function loadHistory() {
        try {
            const response = await fetch(`/api/process_history?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
            const result = await response.json();
            
            if (result.success) {
                historyData = result.data;
                filteredData = [...historyData];
                renderTable();
                updatePagination(result.total);
            } else {
                showError('Gagal memuat data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    async function searchHistory(query) {
        try {
            const response = await fetch(`/api/process_history?search=${encodeURIComponent(query)}&limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
            const result = await response.json();
            
            if (result.success) {
                filteredData = result.data;
                renderTable();
                updatePagination(result.total);
            } else {
                showError('Gagal mencari data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    async function deleteHistory(id) {
        try {
            const response = await fetch(`/api/process_history/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess(result.message);
                await loadHistory();
            } else {
                showError('Gagal menghapus data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    // Fungsi untuk halaman dan filter
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        paginationInfo.textContent = totalItems > 0 
            ? `Menampilkan ${startItem}-${endItem} dari ${totalItems} data` 
            : 'Tidak ada data';
        
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    function renderTable() {
        // Kosongkan tabel
        historyTableBody.innerHTML = '';
        
        // Jika tidak ada data
        if (filteredData.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="10" class="no-data">Tidak ada data yang sesuai</td>`;
            historyTableBody.appendChild(noDataRow);
            return;
        }
        
        // Tambahkan data ke tabel
        filteredData.forEach(history => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${history.id}</td>
                <td>${history.file_name}</td>
                <td>${history.process_type}</td>
                <td>${history.client}</td>
                <td>${history.created_by}</td>
                <td>${history.processed_at}</td>
                <td>${history.sheet_count}</td>
                <td>${history.record_count}</td>
                <td>
                    <a href="/download/${history.output_file}" class="action-btn download" title="Unduh file">
                        <i class="fas fa-download"></i> ${history.output_file}
                    </a>
                </td>
                <td>
                    <button class="action-btn delete" data-id="${history.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            historyTableBody.appendChild(row);
        });
        
        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.currentTarget.getAttribute('data-id');
                const row = e.currentTarget.closest('tr');
                const fileName = row.cells[1].textContent;
                const client = row.cells[3].textContent;
                
                // Set data untuk modal konfirmasi
                deleteItemId = id;
                deleteItemDetails.textContent = `File: ${fileName}, Client: ${client}`;
                
                // Tampilkan modal
                deleteModal.style.display = 'block';
            });
        });
    }

    // Utility untuk pesan
    function showError(message) {
        // Hapus pesan sebelumnya
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Buat elemen pesan
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
            <button class="close-message"><i class="fas fa-times"></i></button>
        `;
        
        // Tambahkan ke halaman
        document.querySelector('main').prepend(errorDiv);
        
        // Event listener untuk tutup pesan
        errorDiv.querySelector('.close-message').addEventListener('click', () => {
            errorDiv.remove();
        });
        
        // Auto-remove setelah 5 detik
        setTimeout(() => {
            if (document.contains(errorDiv)) {
                errorDiv.remove();
            }
        }, 5000);
    }

    function showSuccess(message) {
        // Hapus pesan sebelumnya
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Buat elemen pesan
        const successDiv = document.createElement('div');
        successDiv.className = 'message success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i> ${message}
            <button class="close-message"><i class="fas fa-times"></i></button>
        `;
        
        // Tambahkan ke halaman
        document.querySelector('main').prepend(successDiv);
        
        // Event listener untuk tutup pesan
        successDiv.querySelector('.close-message').addEventListener('click', () => {
            successDiv.remove();
        });
        
        // Auto-remove setelah 5 detik
        setTimeout(() => {
            if (document.contains(successDiv)) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Tambahkan fungsi showNotification jika belum ada
    function showNotification(message, type = 'info', title = 'Informasi') {
        // Cek jika toastr tersedia
        if (typeof toastr !== 'undefined') {
            // Sesuaikan opsi toastr
            toastr.options = {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-right',
                timeOut: 5000
            };
            
            // Tampilkan notifikasi sesuai jenisnya
            if (type === 'success') {
                toastr.success(message, title);
            } else if (type === 'error') {
                toastr.error(message, title);
            } else if (type === 'warning') {
                toastr.warning(message, title);
            } else {
                toastr.info(message, title);
            }
        } else {
            // Fallback ke alert jika toastr tidak tersedia
            alert(`${title}: ${message}`);
        }
    }

    // EVENT LISTENERS
    
    // Konfirmasi hapus
    confirmDeleteBtn.addEventListener('click', function() {
        if (deleteItemId) {
            deleteHistory(deleteItemId);
            deleteModal.style.display = 'none';
            deleteItemId = null;
        }
    });
    
    // Batal hapus
    cancelDeleteBtn.addEventListener('click', function() {
        deleteModal.style.display = 'none';
        deleteItemId = null;
    });
    
    // Tutup modal dengan tombol close atau klik di luar
    closeModal.addEventListener('click', function() {
        deleteModal.style.display = 'none';
        deleteItemId = null;
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            deleteItemId = null;
        }
    });
    
    // Load data saat halaman dimuat
    loadHistory();
}); 