document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM - dengan pengecekan null
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const processButton = document.getElementById('processButton');
    const resetButton = document.getElementById('resetButton');
    const progressBar = document.getElementById('progressBar');
    const logOutput = document.getElementById('logOutput');
    const downloadContainer = document.getElementById('downloadContainer');
    const downloadButton = document.getElementById('downloadButton');
    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const closeModal = document.querySelector('.close');

    // Variabel untuk menyimpan nama file hasil
    let outputFileName = '';

    // Menangani perubahan file yang dipilih - dengan pengecekan null
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0 && fileName) {
                fileName.textContent = this.files[0].name;
            } else if (fileName) {
                fileName.textContent = 'Pilih File';
            }
        });
    }

    // Menangani reset formulir - dengan pengecekan null
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Tambahkan konfirmasi reset
            if (confirm('Apakah Anda yakin ingin mengatur ulang form? Semua data dan file yang telah diproses akan dihapus.')) {
                // Tampilkan loading state pada tombol
                const originalButtonText = resetButton.innerHTML;
                resetButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mereset...';
                resetButton.disabled = true;
                
                // Reset form dan UI
                if (uploadForm) uploadForm.reset();
                if (fileName) fileName.textContent = 'Pilih File';
                if (logOutput) logOutput.innerHTML = '';
                if (progressBar) {
                    progressBar.style.width = '0%';
                    progressBar.textContent = '0%';
                }
                if (downloadContainer) downloadContainer.style.display = 'none';
                
                // Reset grafik jika ada
                const chartContainer = document.getElementById('chartContainer');
                if (chartContainer) chartContainer.style.display = 'none';
                
                // Hapus value dari file input
                if (fileInput) fileInput.value = '';
                
                // Bersihkan variabel global
                if (window.outputData) window.outputData = null;
                
                // Reset UI
                resetUI();
                
                // Memanggil API untuk membersihkan file sementara di server
                fetch('/api/clear_temp_files', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (typeof addLog === 'function') {
                            addLog(`${data.message}`);
                        } else {
                            console.log(data.message);
                        }
                    } else if (data.error) {
                        console.error('Error:', data.error);
                    }
                    
                    // Kembalikan tombol ke state normal
                    resetButton.innerHTML = originalButtonText;
                    resetButton.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Kembalikan tombol ke state normal
                    resetButton.innerHTML = originalButtonText;
                    resetButton.disabled = false;
                });
                
                // Tampilkan pesan sukses jika fungsi tersedia
                if (typeof showSuccess === 'function') {
                    showSuccess('Form berhasil direset. Anda dapat mengunggah file baru.');
                }
            }
        });
    }

    // Menangani pengiriman formulir - dengan pengecekan null
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validasi file
            if (!fileInput || fileInput.files.length === 0) {
                showError('Silakan pilih file terlebih dahulu');
                return;
            }

            // Persiapan pengiriman data
            const formData = new FormData(this);
            
            // Ubah checkbox menjadi string boolean
            const combineSheets = document.getElementById('combineSheets');
            if (combineSheets) {
                formData.set('combine_sheets', combineSheets.checked.toString());
            }
            
            // Reset UI
            if (logOutput) logOutput.innerHTML = '';
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.textContent = '0%';
            }
            if (downloadContainer) downloadContainer.style.display = 'none';
            
            // Tampilkan progres awal
            updateProgress(10);
            addLog('Mengunggah file...');
            
            // Nonaktifkan tombol selama pemrosesan
            processButton.disabled = true;
            
            // Kirim permintaan AJAX
            fetch('/process', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                updateProgress(50);
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showError(data.error);
                    updateProgress(0);
                } else {
                    updateProgress(100);
                    addLog('File berhasil diproses!');
                    
                    // Tampilkan log dari server
                    if (data.log && Array.isArray(data.log)) {
                        data.log.forEach(logMessage => {
                            addLog(logMessage);
                        });
                    }
                    
                    // Tampilkan tombol unduh
                    if (data.output_file) {
                        outputFileName = data.output_file;
                        downloadContainer.style.display = 'block';
                        addLog(`File hasil: ${outputFileName}`);
                    }
                    
                    showSuccess(data.message || 'File berhasil diproses');
                }
            })
            .catch(error => {
                showError('Terjadi kesalahan: ' + error.message);
                updateProgress(0);
            })
            .finally(() => {
                // Aktifkan kembali tombol
                processButton.disabled = false;
            });
        });
    }

    // Tombol unduh file hasil
    downloadButton.addEventListener('click', function() {
        if (outputFileName) {
            window.location.href = `/download/${outputFileName}`;
        }
    });

    // Tampilkan modal info
    infoButton.addEventListener('click', function() {
        infoModal.style.display = 'block';
    });

    // Tutup modal
    closeModal.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });

    // Tutup modal saat klik di luar modal
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    // Fungsi utilitas
    function updateProgress(percent) {
        progressBar.style.width = percent + '%';
        progressBar.textContent = percent + '%';
    }

    function addLog(message) {
        const time = new Date().toLocaleTimeString();
        logOutput.innerHTML += `[${time}] ${message}\n`;
        logOutput.scrollTop = logOutput.scrollHeight;
    }

    function showError(message) {
        // Hapus pesan error sebelumnya jika ada
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Buat elemen pesan error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Tambahkan ke awal form
        uploadForm.prepend(errorDiv);
        
        // Tambahkan ke log
        addLog('Error: ' + message);
        
        // Hapus pesan setelah 5 detik
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        // Hapus pesan sukses sebelumnya jika ada
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Buat elemen pesan sukses
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Tambahkan ke awal form
        uploadForm.prepend(successDiv);
        
        // Hapus pesan setelah 5 detik
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function resetUI() {
        // Reset ringkasan jika elemen-elemen tersebut ada
        const processType = document.getElementById('processType');
        const processTypeSummary = document.getElementById('processTypeSummary');
        const sheetCount = document.getElementById('sheetCount');
        const recordCount = document.getElementById('recordCount');
        
        // Reset tampilan ringkasan
        if (processTypeSummary) processTypeSummary.textContent = '-';
        if (sheetCount) sheetCount.textContent = '0';
        if (recordCount) recordCount.textContent = '0';
        
        // Reset dropdown jenis proses ke opsi pertama jika ada
        if (processType) {
            // Pastikan tidak disabled
            processType.disabled = false;
            
            // Reset ke opsi pertama
            if (processType.options && processType.options.length > 0) {
                processType.selectedIndex = 0; // Pilih opsi pertama (Bundle)
                
                // Log status dropdown
                console.log('Reset jenis proses ke:', processType.value);
                console.log('Dropdown jenis proses enabled:', !processType.disabled);
                
                // Picu event change secara manual
                try {
                    const event = new Event('change');
                    processType.dispatchEvent(event);
                } catch (e) {
                    console.error('Error saat memicu event change:', e);
                }
            }
        }
        
        // Reset tabel sampel data jika fungsi tersedia
        if (typeof clearDataSample === 'function') {
            clearDataSample();
        } else {
            // Alternatif jika fungsi clearDataSample tidak tersedia
            const dataSampleContainer = document.getElementById('dataSampleContainer');
            if (dataSampleContainer) dataSampleContainer.innerHTML = '';
        }
        
        // Reset pemilih sheet jika ada
        const sheetSelector = document.getElementById('sheetSelector');
        if (sheetSelector) {
            sheetSelector.innerHTML = '<option value="">-- Pilih Sheet --</option>';
        }
        
        // Hapus kelas sukses/error pada form jika ada
        if (uploadForm) {
            uploadForm.classList.remove('border-success', 'border-danger');
        }
    }
}); 