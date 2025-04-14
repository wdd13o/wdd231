// Track visits to discover page
document.addEventListener('DOMContentLoaded', function() {
    // Set last modified date
    document.getElementById('last-modified-date').textContent = new Date(document.lastModified).toLocaleDateString();
    
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Visit tracking
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = document.getElementById('last-visit');
    const now = Date.now();
    const lastVisitTime = localStorage.getItem('lastVisitTime');
    
    if (!lastVisitTime) {
        visitMessage.textContent = "Welcome! This is your first visit to our Discover page.";
    } else {
        const daysSinceLastVisit = Math.floor((now - lastVisitTime) / (1000 * 60 * 60 * 24));
        visitMessage.textContent = `Welcome back! You last visited ${daysSinceLastVisit} day${daysSinceLastVisit !== 1 ? 's' : ''} ago.`;
    }
    
    localStorage.setItem('lastVisitTime', now);
    lastVisit.textContent = `Current visit: ${new Date(now).toLocaleString()}`;
    
    // Calculate page weight
    calculatePageWeight();
    
    // Load gallery items
    loadGalleryItems();
    
    // Load demographics data
    loadDemographics();
});

async function loadGalleryItems() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();
        const gallery = document.getElementById('gallery');
        
        data.forEach(item => {
            const galleryItem = document.createElement('figure');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <picture>
                    <source srcset="images/${item.filename}.webp" type="image/webp">
                    <img src="images/${item.filename}.jpg" alt="${item.alt}" loading="lazy" width="400" height="300">
                </picture>
                <figcaption>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </figcaption>
            `;
            gallery.appendChild(galleryItem);
        });
        
        // Lazy load images
        lazyLoadImages();
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
}

async function loadDemographics() {
    try {
        const response = await fetch('data/demographics.json');
        const data = await response.json();
        const statsContainer = document.querySelector('.stats-container');
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Population</h3>
                <p>${data.population.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Median Age</h3>
                <p>${data.medianAge}</p>
            </div>
            <div class="stat-card">
                <h3>Median Income</h3>
                <p>$${data.medianIncome.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Founded</h3>
                <p>${data.founded}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading demographics data:', error);
    }
}

function lazyLoadImages() {
    const images = document.querySelectorAll('.gallery-item img');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('src');
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });
    
    images.forEach(img => observer.observe(img));
}

function calculatePageWeight() {
    // This is a simplified calculation
    let totalWeight = 0;
    
    // HTML weight
    totalWeight += new TextEncoder().encode(document.documentElement.outerHTML).length / 1024;
    
    // CSS weight (approximate)
    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach(sheet => {
        if (sheet.href) {
            // Assume average CSS file size
            totalWeight += 10; // KB
        }
    });
    
    // JS weight (approximate)
    const scripts = Array.from(document.scripts);
    scripts.forEach(script => {
        if (script.src) {
            // Assume average JS file size
            totalWeight += 20; // KB
        }
    });
    
    // Image weight (approximate)
    const images = Array.from(document.images);
    images.forEach(img => {
        // Check if WebP is used
        const isWebP = img.src.endsWith('.webp') || (img.parentElement.tagName === 'PICTURE' && img.src.includes('.webp'));
        totalWeight += isWebP ? 30 : 50; // WebP is typically smaller
    });
    
    document.getElementById('weight-value').textContent = Math.round(totalWeight);
}// Ensure all images have lazy loading
document.querySelectorAll('img').forEach(img => {
    if (!img.loading) {
        img.loading = 'lazy';
    }
});