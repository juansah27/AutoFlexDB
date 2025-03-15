// Onboarding Tour Script dengan Shepherd.js - Versi Dioptimasi
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk cek apakah ini pertama kali user membuka aplikasi
    function isFirstVisit() {
        return localStorage.getItem('onboardingCompleted') !== 'true';
    }

    // Fungsi untuk menandai onboarding sudah selesai
    function markOnboardingAsCompleted() {
        localStorage.setItem('onboardingCompleted', 'true');
    }

    // Fungsi untuk simpan langkah terakhir (untuk melanjutkan tour nanti)
    function saveCurrentStep(stepId) {
        localStorage.setItem('onboardingLastStep', stepId);
    }

    // Fungsi untuk mendapatkan langkah terakhir
    function getLastStep() {
        return localStorage.getItem('onboardingLastStep');
    }

    // Fungsi untuk reset onboarding (untuk testing)
    window.resetOnboarding = function() {
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('onboardingLastStep');
        showSuccess('Onboarding telah direset. Silakan muat ulang halaman.');
    };

    // Fungsi untuk menambahkan progress bar
    function createProgressBar(tour) {
        // Hapus progress bar yang mungkin sudah ada
        const existingBar = document.querySelector('.shepherd-progress-bar');
        if (existingBar) existingBar.remove();
        
        // Buat element progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'shepherd-progress-bar';
        
        // Hitung progress
        const totalSteps = tour.steps.length;
        const currentStepNumber = tour.getCurrentStep() ? 
            tour.steps.indexOf(tour.getCurrentStep()) + 1 : 1;
        
        // Hitung persentase progress
        const percentage = Math.round((currentStepNumber / totalSteps) * 100);
        
        // Tambahkan teks progress
        const progressText = document.createElement('span');
        progressText.className = 'shepherd-progress-text';
        progressText.textContent = `Langkah ${currentStepNumber} dari ${totalSteps}`;
        
        // Tambahkan bar visual
        const progressBarInner = document.createElement('div');
        progressBarInner.className = 'shepherd-progress-bar-inner';
        progressBarInner.style.width = `${percentage}%`;
        
        // Gabungkan elemen
        progressBar.appendChild(progressText);
        progressBar.appendChild(progressBarInner);
        
        // Cari wrapper
        const shepherdContent = document.querySelector('.shepherd-content');
        if (shepherdContent) {
            // Tambahkan progress bar setelah title, sebelum text
            const shepherdText = shepherdContent.querySelector('.shepherd-text');
            if (shepherdText) {
                shepherdContent.insertBefore(progressBar, shepherdText);
            }
        }
    }

    // Setup tour dengan optimasi
    function setupTour() {
        // Deteksi apakah user adalah admin
        const isAdmin = document.querySelector('body').getAttribute('data-role') === 'admin' || 
                        (typeof window.isAdmin !== 'undefined' && window.isAdmin === true);

        // Cari menu admin yang tersedia
        const hasDatabase = document.querySelector('.nav-link[href="/database"]');
        const hasHistory = document.querySelector('.nav-link[href="/process_history"]');
        const hasUsers = document.querySelector('.nav-link[href="/users"]');
        
        const tour = new Shepherd.Tour({
            defaultStepOptions: {
                cancelIcon: {
                    enabled: true
                },
                classes: 'shepherd-theme-custom',
                scrollTo: { behavior: 'smooth', block: 'center' },
                when: {
                    cancel: function() {
                        markOnboardingAsCompleted();
                    },
                    show: function() {
                        // Selalu update progress bar saat menampilkan langkah
                        createProgressBar(tour);
                        
                        // Simpan langkah saat ini
                        const currentStep = tour.getCurrentStep();
                        if (currentStep && currentStep.id) {
                            saveCurrentStep(currentStep.id);
                        }
                    }
                },
                // Tambahkan animasi transisi
                modalOverlayOpeningPadding: 5,
                modalOverlayOpeningRadius: 20,
                canClickTarget: false  // Hindari klik di belakang tour
            },
            useModalOverlay: true,
            exitOnEsc: true,
            keyboardNavigation: true
        });

        // Buat daftar langkah
        const steps = [
            {
                id: 'welcome',
                title: 'Selamat Datang!',
                text: '<p><strong class="tour-highlight">All In One Setting</strong> membantu Anda memproses file Excel dengan mudah dan cepat.</p><p>Mari pelajari fitur utama aplikasi ini!</p>',
                buttons: [
                    {
                        text: 'Lewati',
                        action: function() {
                            markOnboardingAsCompleted();
                            return tour.complete();
                        },
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            },
            {
                id: 'upload-file',
                title: 'Unggah File',
                text: '<p>Unggah file Excel Anda disini.</p><p>Hanya format <strong class="tour-highlight">.xlsx</strong> dan <strong class="tour-highlight">.xls</strong> yang didukung.</p>',
                attachTo: {
                    element: '.file-upload',
                    on: 'bottom'
                },
                buttons: [
                    {
                        text: 'Kembali',
                        action: tour.back,
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            },
            {
                id: 'process-type',
                title: 'Jenis Proses',
                text: '<p>Pilih jenis proses sesuai kebutuhan:</p><ul><li><strong class="tour-highlight">Bundle</strong>: Mengelompokkan produk</li><li><strong class="tour-highlight">Supplementary</strong>: Menambahkan data tambahan</li><li><strong class="tour-highlight">Gift</strong>: Mengelola produk hadiah</li></ul>',
                attachTo: {
                    element: '#processType',
                    on: 'bottom'
                },
                buttons: [
                    {
                        text: 'Kembali',
                        action: tour.back,
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            },
            {
                id: 'output-format',
                title: 'Format Output',
                text: '<p>Pilih format hasil yang Anda inginkan:</p><ul><li><strong class="tour-highlight">Excel (.xlsx)</strong>: Format spreadsheet standar</li><li><strong class="tour-highlight">CSV (.csv)</strong>: Format teks yang kompatibel dengan banyak aplikasi</li></ul>',
                attachTo: {
                    element: '#outputFormat',
                    on: 'bottom'
                },
                buttons: [
                    {
                        text: 'Kembali',
                        action: tour.back,
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            },
            {
                id: 'process-button',
                title: 'Proses File',
                text: '<p>Setelah semua opsi diatur, klik tombol ini untuk memulai pemrosesan file.</p><p>Progres dan log akan ditampilkan dibawah.</p>',
                attachTo: {
                    element: '#processButton',
                    on: 'bottom'
                },
                buttons: [
                    {
                        text: 'Kembali',
                        action: tour.back,
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            },
            {
                id: 'theme-toggle',
                title: 'Ubah Tema',
                text: '<p>Klik ikon ini untuk beralih antara tema <strong class="tour-highlight">Terang</strong> dan <strong class="tour-highlight">Gelap</strong>.</p><p>Pilih tema yang paling nyaman untuk mata Anda.</p>',
                attachTo: {
                    element: '.theme-toggle',
                    on: 'left'
                },
                buttons: [
                    {
                        text: 'Kembali',
                        action: tour.back,
                        classes: 'btn btn-text'
                    },
                    {
                        text: 'Lanjut',
                        action: tour.next,
                        classes: 'btn btn-primary'
                    }
                ]
            }
        ];

        // Langkah navigasi yang akan disesuaikan berdasarkan peran pengguna
        const navigationStep = {
            id: 'navigation',
            title: 'Menu Navigasi',
            text: generateNavigationText(isAdmin, hasDatabase, hasHistory, hasUsers),
            attachTo: {
                element: '.navbar-nav',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Kembali',
                    action: tour.back,
                    classes: 'btn btn-text'
                },
                {
                    text: 'Selesai',
                    action: function() {
                        markOnboardingAsCompleted();
                        // Tampilkan gambar konfeti untuk perayaan
                        showCompletionAnimation();
                        showSuccess('Anda telah menyelesaikan tour pengenalan!');
                        return tour.complete();
                    },
                    classes: 'btn btn-success'
                }
            ]
        };

        // Fungsi untuk menghasilkan teks navigasi yang sesuai dengan peran pengguna
        function generateNavigationText(isAdmin, hasDatabase, hasHistory, hasUsers) {
            let text = '<p>Gunakan menu ini untuk mengakses halaman lain:</p><ul>';
            
            // Tambahkan menu berdasarkan ketersediaan atau peran
            if (isAdmin || hasDatabase) {
                text += '<li><strong class="tour-highlight">Database</strong>: Manajemen data</li>';
            }
            
            if (isAdmin || hasHistory) {
                text += '<li><strong class="tour-highlight">Riwayat</strong>: Melihat proses sebelumnya</li>';
            }
            
            if (isAdmin || hasUsers) {
                text += '<li><strong class="tour-highlight">Pengguna</strong>: Pengaturan pengguna</li>';
            }
            
            // Menu yang tersedia untuk semua pengguna
            text += '<li><strong class="tour-highlight">Profil</strong>: Informasi akun Anda</li>';
            text += '</ul>';
            
            return text;
        }

        // Tambahkan semua langkah ke tour
        steps.push(navigationStep);
        steps.forEach(step => tour.addStep(step));

        // Fungsi untuk menambahkan animasi saat tour selesai
        function showCompletionAnimation() {
            // Cari library konfeti atau buat sendiri animasi sederhana
            try {
                // Buat elemen div untuk animasi
                const animationContainer = document.createElement('div');
                animationContainer.id = 'tour-completion-animation';
                animationContainer.innerHTML = '<i class="fas fa-check-circle"></i><p>Selesai!</p>';
                document.body.appendChild(animationContainer);
                
                // Tambahkan kelas untuk animasi
                setTimeout(() => {
                    animationContainer.classList.add('show');
                    
                    // Hapus setelah animasi selesai
                    setTimeout(() => {
                        animationContainer.classList.remove('show');
                        setTimeout(() => {
                            animationContainer.remove();
                        }, 500);
                    }, 2000);
                }, 100);
            } catch (error) {
                console.error('Error showing completion animation:', error);
            }
        }

        return tour;
    }

    // Tambahkan fungsi untuk menampilkan tombol yang memungkinkan user memulai tour lagi
    function addTourButton() {
        // Cek apakah tombol sudah ada
        if (document.getElementById('startTourButton')) return;
        
        // Buat tombol tour
        const tourButton = document.createElement('button');
        tourButton.id = 'startTourButton';
        tourButton.className = 'btn-fab tour-button';
        tourButton.innerHTML = '<i class="fas fa-question"></i>';
        tourButton.setAttribute('data-tooltip', 'Mulai Tour Pengenalan');
        
        // Tambahkan event listener
        tourButton.addEventListener('click', function() {
            const tour = setupTour();
            
            // Cek apakah ada langkah terakhir tersimpan
            const lastStepId = getLastStep();
            if (lastStepId && confirm('Lanjutkan dari langkah terakhir Anda?')) {
                // Mulai tour dari langkah terakhir yang disimpan
                tour.start(lastStepId);
            } else {
                // Mulai dari awal
                tour.start();
            }
        });
        
        // Tambahkan ke body
        document.body.appendChild(tourButton);
        
        // Tambahkan animasi agar perhatian pengguna tertarik
        setTimeout(() => {
            tourButton.classList.add('pulse');
            setTimeout(() => {
                tourButton.classList.remove('pulse');
            }, 1000);
        }, 3000);
    }

    // Fungsi success message (menggunakan implementasi yang sudah ada jika tersedia)
    function showSuccess(message) {
        if (typeof window.showSuccess === 'function') {
            window.showSuccess(message);
        } else if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'success', 'Berhasil');
        } else {
            const notification = document.createElement('div');
            notification.className = 'tour-notification success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            `;
            document.body.appendChild(notification);
            
            // Tampilkan notifikasi
            setTimeout(() => {
                notification.classList.add('show');
                
                // Atur timer untuk menutup
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 5000);
                
                // Tambahkan event listener untuk tombol tutup
                const closeBtn = notification.querySelector('.close-notification');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            notification.remove();
                        }, 300);
                    });
                }
            }, 100);
        }
    }

    // Coba deteksi peran pengguna di body dan simpan untuk referensi global
    try {
        // Cek apakah session.role tersedia dalam template
        if (document.querySelector('.navbar-nav a[href="/database"]') || 
            document.querySelector('.navbar-nav a[href="/users"]') || 
            document.querySelector('.navbar-nav a[href="/process_history"]')) {
            // Tambahkan data-role pada body
            document.querySelector('body').setAttribute('data-role', 'admin');
            // Simpan juga di window object
            window.isAdmin = true;
        } else {
            document.querySelector('body').setAttribute('data-role', 'user');
            window.isAdmin = false;
        }
    } catch (e) {
        console.log('Tidak dapat mendeteksi peran pengguna:', e);
    }

    // Tambahkan shortcut keyboard untuk mengakses tour
    document.addEventListener('keydown', function(event) {
        // Alt + H untuk membuka tour
        if (event.altKey && event.key === 'h') {
            const tourButton = document.getElementById('startTourButton');
            if (tourButton) {
                tourButton.click();
            }
        }
    });

    // Mulai tour jika ini kunjungan pertama
    if (isFirstVisit()) {
        // Beri sedikit delay agar halaman dimuat sempurna
        setTimeout(function() {
            const tour = setupTour();
            tour.start();
        }, 1000);
    }

    // Selalu tambahkan tombol untuk memulai tour
    addTourButton();
}); 