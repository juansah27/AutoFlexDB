document.addEventListener('DOMContentLoaded', function() {
    // Elemen-elemen DOM
    const addMappingForm = document.getElementById('addMappingForm');
    const importForm = document.getElementById('importForm');
    const importFile = document.getElementById('importFile');
    const importFileName = document.getElementById('importFileName');
    const mappingTableBody = document.getElementById('mappingTableBody');
    const searchInput = document.getElementById('searchInput');
    const refreshButton = document.getElementById('refreshButton');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.querySelector('#deleteModal .close');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteItemDetails = document.getElementById('deleteItemDetails');
    const paginationInfo = document.getElementById('paginationInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageEl = document.getElementById('currentPage');

    // Variabel data dan pagination
    let allMappings = [];
    let filteredMappings = [];
    let itemsPerPage = 10;
    let currentPage = 1;
    let deleteItemId = null;

    // Fungsi CRUD
    async function loadMappings() {
        try {
            const response = await fetch('/api/shop_mappings');
            const result = await response.json();
            
            if (result.success) {
                allMappings = result.data;
                filteredMappings = [...allMappings];
                renderTable();
                updatePagination();
            } else {
                showError('Gagal memuat data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    async function addMapping(data) {
        try {
            const response = await fetch('/api/shop_mappings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess(result.message);
                addMappingForm.reset();
                await loadMappings();
            } else {
                showError('Gagal menyimpan data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    async function deleteMapping(id) {
        try {
            const response = await fetch(`/api/shop_mappings/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess(result.message);
                await loadMappings();
            } else {
                showError('Gagal menghapus data: ' + result.error);
            }
        } catch (error) {
            showError('Terjadi kesalahan: ' + error.message);
        }
    }

    // Fungsi untuk halaman dan filter
    function applyFilter() {
        const query = searchInput.value.toLowerCase();
        
        if (query.trim() === '') {
            filteredMappings = [...allMappings];
        } else {
            filteredMappings = allMappings.filter(mapping => 
                mapping.marketplace.toLowerCase().includes(query) ||
                mapping.client.toLowerCase().includes(query) ||
                mapping.shop_id.toLowerCase().includes(query)
            );
        }
        
        currentPage = 1;
        renderTable();
        updatePagination();
    }

    function updatePagination() {
        const totalItems = filteredMappings.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        paginationInfo.textContent = totalItems > 0 
            ? `Menampilkan ${startItem}-${endItem} dari ${totalItems} data` 
            : 'Tidak ada data';
        
        currentPageEl.textContent = currentPage;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    function renderTable() {
        // Perhitungan untuk paginasi
        const startIdx = (currentPage - 1) * itemsPerPage;
        const paginatedData = filteredMappings.slice(startIdx, startIdx + itemsPerPage);
        
        // Kosongkan tabel
        mappingTableBody.innerHTML = '';
        
        // Jika tidak ada data
        if (paginatedData.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="5" class="no-data">Tidak ada data yang sesuai</td>`;
            mappingTableBody.appendChild(noDataRow);
            return;
        }
        
        // Tambahkan data ke tabel
        paginatedData.forEach(mapping => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mapping.id}</td>
                <td>${mapping.marketplace}</td>
                <td>${mapping.client}</td>
                <td>${mapping.shop_id}</td>
                <td>
                    <button class="action-btn delete" data-id="${mapping.id}" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            mappingTableBody.appendChild(row);
        });
        
        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.currentTarget.getAttribute('data-id');
                const row = e.currentTarget.closest('tr');
                const marketplace = row.cells[1].textContent;
                const client = row.cells[2].textContent;
                const shopId = row.cells[3].textContent;
                
                // Set data untuk modal konfirmasi
                deleteItemId = id;
                deleteItemDetails.textContent = `Marketplace: ${marketplace}, Client: ${client}, Shop ID: ${shopId}`;
                
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

    // EVENT LISTENERS
    
    // Submit form tambah data
    if (addMappingForm) {
        addMappingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = {
                marketplace: document.getElementById('marketplace').value.trim(),
                client: document.getElementById('client').value.trim(),
                shop_id: document.getElementById('shopId').value.trim()
            };
            
            addMapping(data);
        });
    }
    
    // Handle file import change
    if (importFile) {
        importFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                importFileName.textContent = this.files[0].name;
            } else {
                importFileName.textContent = 'Pilih File';
            }
        });
    }
    
    // Submit form import
    if (importForm) {
        importForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (importFile.files.length === 0) {
                showError('Silakan pilih file terlebih dahulu');
                return;
            }
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/api/import_shop_mappings', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showSuccess(result.message);
                    importForm.reset();
                    importFileName.textContent = 'Pilih File';
                    await loadMappings();
                } else {
                    showError('Gagal mengimpor data: ' + result.error);
                }
            } catch (error) {
                showError('Terjadi kesalahan: ' + error.message);
            }
        });
    }
    
    // Pencarian
    if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
    }
    
    // Refresh data
    if (refreshButton) {
        refreshButton.addEventListener('click', loadMappings);
    }
    
    // Konfirmasi hapus
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (deleteItemId) {
                deleteMapping(deleteItemId);
                deleteModal.style.display = 'none';
                deleteItemId = null;
            }
        });
    }
    
    // Batal hapus
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
            deleteItemId = null;
        });
    }
    
    // Tutup modal dengan tombol close atau klik di luar
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            deleteModal.style.display = 'none';
            deleteItemId = null;
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            deleteItemId = null;
        }
    });
    
    // Paginasi
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
            const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                updatePagination();
            }
        });
    }
    
    // Load data saat halaman dimuat
    loadMappings();
}); 