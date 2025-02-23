// 等待 DOM 完全加載
document.addEventListener('DOMContentLoaded', function() {
    // 導航欄滾動效果
    let lastScrollTop = 0;
    const nav = document.querySelector('.navigation');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // 向下滾動
            nav.style.transform = 'translateY(-100%)';
        } else {
            // 向上滾動
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Hero 圖片載入優化
    const heroImages = document.querySelectorAll('.hero-image');
    heroImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    // 導航鏈接點擊效果
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活動狀態
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加活動狀態到當前鏈接
            this.classList.add('active');
        });
    });
});

// 圖片懶加載
function lazyLoadImages() {
    const images = document.querySelectorAll('.hero-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 視窗調整響應
window.addEventListener('resize', function() {
    // 在這裡添加任何需要響應視窗大小變化的邏輯
    const heroGrid = document.querySelector('.hero-grid');
    if (window.innerWidth <= 768) {
        heroGrid.style.gridTemplateColumns = '1fr';
    } else {
        heroGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
});