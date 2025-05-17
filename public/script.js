
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Dark/Light mode toggle
        const modeToggle = document.getElementById('modeToggle');
        const body = document.body;
        
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        modeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        
        // Scroll animation
        const animateOnScroll = function() {
            const sections = document.querySelectorAll('section, footer');
            
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 100) {
                    section.classList.add('animated');
                }
            });
        };
        
        // Initialize animations
        window.addEventListener('load', function() {
            document.getElementById('hero').classList.add('animated');
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll();
        });
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Show loading state
        function showLoading() {
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            downloadBtn.disabled = true;
        }
        
        // Reset button state
        function resetButton() {
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Now';
            downloadBtn.disabled = false;
        }
        
        // Show error message
        function showError(message) {
            const formGroup = document.querySelector('.form-group');
            let errorElement = document.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
        }
        
        // Show success message
        function showSuccess(message) {
            const formGroup = document.querySelector('.form-group');
            let successElement = document.querySelector('.success-message');
            
            if (!successElement) {
                successElement = document.createElement('div');
                successElement.className = 'success-message';
                formGroup.appendChild(successElement);
            }
            
            successElement.textContent = message;
        }
        
        // Clear messages
        function clearMessages() {
            const errorElement = document.querySelector('.error-message');
            const successElement = document.querySelector('.success-message');
            
            if (errorElement) errorElement.remove();
            if (successElement) successElement.remove();
        }
        
        // Detect platform from URL
        function detectPlatform(url) {
            if (url.includes('facebook.com') || url.includes('fb.watch')) {
                return 'facebook';
            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                return 'youtube';
            } else if (url.includes('instagram.com')) {
                return 'instagram';
            } else if (url.includes('tiktok.com')) {
                return 'tiktok';
            }
            return null;
        }
        
        // Handle Facebook download with fallback
        async function downloadFacebook(url) {
            try {
                // Try first API
                const response = await fetch(`https://api.agatz.xyz/api/facebook?url=${encodeURIComponent(url)}`);
                if (!response.ok) throw new Error('First API failed');
                const data = await response.json();
                
                if (data.status === 200 && data.data.hd) {
                    return { url: data.data.hd };
                } else {
                    throw new Error('No download link found in first API');
                }
            } catch (error) {
                console.log('Trying fallback Facebook API...');
                // Try fallback API
                const fallbackResponse = await fetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`);
                if (!fallbackResponse.ok) throw new Error('Both Facebook APIs failed');
                const fallbackData = await fallbackResponse.json();
                
                if (fallbackData.status === true && fallbackData.data.length > 0) {
                    return { url: fallbackData.data[0].url };
                } else {
                    throw new Error('No download link found in fallback API');
                }
            }
        }
        
        // Handle YouTube download
        async function downloadYouTube(url, format) {
            if (format === 'mp4') {
                const apiUrl = `https://ytdlpyton.nvlgroup.my.id/download/?url=${encodeURIComponent(url)}&resolution=720&mode=url`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.download_url) {
                    return { url: data.download_url };
                } else {
                    throw new Error('Failed to get YouTube MP4 download link');
                }
            } else {
                // MP3
                const apiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (data.data && data.data.dl) {
                    return { url: data.data.dl };
                } else {
                    throw new Error('Failed to get YouTube MP3 download link');
                }
            }
        }
        
        // Handle Instagram download
        async function downloadInstagram(url) {
            const apiUrl = `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status && data.data && data.data.length > 0) {
                return { url: data.data[0].url };
            } else {
                throw new Error('Failed to get Instagram download link');
            }
        }
        
        // Handle TikTok download
        async function downloadTikTok(url) {
            const apiUrl = `https://api.siputzx.my.id/api/tiktok/v2?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.success && data.data && data.data.download && data.data.download.video) {
                // Use the HD version (server 2)
                return { url: data.data.download.video[1] };
            } else {
                throw new Error('Failed to get TikTok download link');
            }
        }
        
        // Handle download based on platform
        async function handleDownload(url) {
            if (!url) {
                const urlInput = document.getElementById('videoUrl');
                url = urlInput.value.trim();
                
                if (!url) {
                    showError('Please enter a video URL');
                    urlInput.focus();
                    return;
                }
            }
            
            clearMessages();
            showLoading();
            
            try {
                const platform = detectPlatform(url);
                
                if (!platform) {
                    throw new Error('Unsupported platform. Please use Facebook, YouTube, Instagram, or TikTok.');
                }
                
                let result;
                
                switch (platform) {
                    case 'facebook':
                        result = await downloadFacebook(url);
                        window.open(result.url, '_blank');
                        showSuccess('Facebook video download started!');
                        break;
                        
                    case 'youtube':
                        // Show format selection (MP4 or MP3)
                        const format = confirm('Download as MP4 (OK) or MP3 (Cancel)?') ? 'mp4' : 'mp3';
                        result = await downloadYouTube(url, format);
                        window.open(result.url, '_blank');
                        showSuccess(`YouTube ${format.toUpperCase()} download started!`);
                        break;
                        
                    case 'instagram':
                        result = await downloadInstagram(url);
                        window.open(result.url, '_blank');
                        showSuccess('Instagram download started!');
                        break;
                        
                    case 'tiktok':
                        result = await downloadTikTok(url);
                        window.open(result.url, '_blank');
                        showSuccess('TikTok HD download started!');
                        break;
                }
                
            } catch (error) {
                showError(error.message);
                console.error('Download error:', error);
            } finally {
                resetButton();
            }
        }
        
        // Attach download handler to main button
        document.getElementById('downloadBtn').addEventListener('click', function() {
            handleDownload();
        });
        
        // Handle download when pressing Enter in the input field
        document.getElementById('videoUrl').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleDownload();
            }
        });
        
        // Handle download for sample videos
        document.querySelectorAll('.download-btn-small').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.getAttribute('data-url');
                handleDownload(url);
            });
        });
    