// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        firstName: params.get('firstName'),
        lastName: params.get('lastName'),
        email: params.get('email'),
        mobile: params.get('mobile'),
        businessName: params.get('businessName'),
        timestamp: params.get('timestamp')
    };
}

// Set the current date and time in ISO format to the hidden timestamp field
document.addEventListener("DOMContentLoaded", () => {
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
});

// Display form data on the page
function displayFormData() {
    const formData = getQueryParams();
    console.log(formData); // Debug: Log the retrieved form data
    const formDataContainer = document.getElementById('form-data');

    if (formDataContainer) {
        formDataContainer.innerHTML = `
            <p><strong>First Name:</strong> ${formData.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> ${formData.lastName || 'N/A'}</p>
            <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
            <p><strong>Mobile:</strong> ${formData.mobile || 'N/A'}</p>
            <p><strong>Business Name:</strong> ${formData.businessName || 'N/A'}</p>
            <p><strong>Submission Date:</strong> ${formData.timestamp || 'N/A'}</p>
        `;
    }
}

// Call the function to display form data
displayFormData();

// Chamber Member Directory
document.addEventListener("DOMContentLoaded", () => {
    const memberContainer = document.getElementById("member-container");
    const gridViewButton = document.getElementById("grid-view");
    const listViewButton = document.getElementById("list-view");

    // Set default view (grid view)
    if (memberContainer) {
        memberContainer.classList.add("grid");

        // Fetch and display member data
        fetch("data/members.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(member => {
                    const memberCard = document.createElement("section");

                    // Use member-specific image if available, otherwise use a default image
                    const memberImage = `images/${member.name.toLowerCase().replace(/ /g, "-")}.jpg`;
                    const imageExists = new Image();
                    imageExists.src = memberImage;

                    imageExists.onload = () => {
                        memberCard.innerHTML = `
                            <img src="${memberImage}" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.address}</p>
                            <p>${member.phone}</p>
                            <a href="${member.website}" target="_blank">Visit Website</a>
                        `;
                    };

                    imageExists.onerror = () => {
                        memberCard.innerHTML = `
                            <img src="images/default.jpg" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.address}</p>
                            <p>${member.phone}</p>
                            <a href="${member.website}" target="_blank">Visit Website</a>
                        `;
                    };

                    memberContainer.appendChild(memberCard);
                });
            })
            .catch(error => console.error("Error fetching member data:", error));
    }

    // Function to toggle views
    function toggleView(view) {
        if (memberContainer) {
            memberContainer.className = ""; // Clear all classes
            memberContainer.classList.add(view); // Add the selected view class
        }
    }

    // Event listeners for buttons
    if (gridViewButton && listViewButton) {
        gridViewButton.addEventListener("click", () => toggleView("grid"));
        listViewButton.addEventListener("click", () => toggleView("list"));
    }
});

// Responsive Navigation Menu
document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Set current year in the footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }

    // Set last modified date in the footer
    const lastModifiedElement = document.getElementById("last-modified-date");
    if (lastModifiedElement) {
        const lastModifiedDate = new Date(document.lastModified);
        lastModifiedElement.textContent = lastModifiedDate.toLocaleDateString();
    }
});

// Weather API Integration
document.addEventListener("DOMContentLoaded", () => {
    const weatherContainer = document.getElementById("weather-container");
    const apiKey = "53a642139468684fdf2f6d688a6f191e"; // Replace with your API key
    const city = "Freetown, SL"; // Replace with the chamber's location
    const units = "metric"; // Use "imperial" for Fahrenheit

    if (weatherContainer) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const currentTemp = data.main.temp;
                const weatherDescription = data.weather[0].description;

                weatherContainer.innerHTML = `
                    <p>Current Temperature: ${currentTemp}°C</p>
                    <p>Weather: ${weatherDescription}</p>
                `;

                // Fetch 3-day forecast
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
            })
            .then(response => response.json())
            .then(data => {
                const forecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 3); // Get 3 days (every 8th item)
                const forecastHTML = forecast.map(day => {
                    const date = new Date(day.dt * 1000).toLocaleDateString();
                    const temp = day.main.temp;
                    return `<p>${date}: ${temp}°C</p>`;
                }).join("");

                weatherContainer.innerHTML += `
                    <h4>3-Day Forecast:</h4>
                    ${forecastHTML}
                `;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherContainer.innerHTML = `<p>Unable to load weather data.</p>`;
            });
    }
});

// Chamber Member Spotlight
document.addEventListener("DOMContentLoaded", () => {
    const spotlightContainer = document.getElementById("spotlight-container");

    if (spotlightContainer) {
        fetch("data/members.json") // Replace with the correct path to your JSON file
            .then(response => response.json())
            .then(data => {
                // Filter gold and silver members
                const goldAndSilverMembers = data.filter(member =>
                    member.membershipLevel === "Gold" || member.membershipLevel === "Silver"
                );

                // Randomly shuffle members
                const shuffledMembers = goldAndSilverMembers.sort(() => 0.5 - Math.random());

                let currentIndex = 0;

                // Function to update the spotlight
                function updateSpotlight() {
                    // Get the next three members
                    const spotlightMembers = [
                        shuffledMembers[currentIndex],
                        shuffledMembers[(currentIndex + 1) % shuffledMembers.length],
                        shuffledMembers[(currentIndex + 2) % shuffledMembers.length]
                    ];

                    // Generate HTML for the three spotlight sections
                    const spotlightHTML = spotlightMembers.map(member => `
                        <div class="spotlight-card">
                            <img src="${member.logo}" alt="${member.name} Logo">
                            <h4>${member.name}</h4>
                            <p>Phone: ${member.phone}</p>
                            <p>Address: ${member.address}</p>
                            <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
                            <p>Membership Level: ${member.membershipLevel}</p>
                        </div>
                    `).join("");

                    // Update the spotlight container
                    spotlightContainer.innerHTML = spotlightHTML;

                    // Move to the next set of members
                    currentIndex = (currentIndex + 3) % shuffledMembers.length;
                }

                // Start the spotlight rotation
                setInterval(updateSpotlight, 3000); // Rotate every 3 seconds

                // Initialize the first spotlight
                updateSpotlight();
            })
            .catch(error => {
                console.error("Error fetching member data:", error);
                spotlightContainer.innerHTML = `<p>Unable to load spotlight data.</p>`;
            });
    }
});










document.addEventListener('DOMContentLoaded', function() {
    // Load and display visitor message
    displayVisitorMessage();
    
    // Load and display gallery items
    loadGalleryItems();
  });
  
  function displayVisitorMessage() {
    const sidebar = document.querySelector('.sidebar');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    
    if (!lastVisit) {
      sidebar.innerHTML = `
        <div class="visitor-message">
          <h2>Welcome!</h2>
          <p>Let us know if you have any questions about our community.</p>
        </div>
      `;
    } else {
      const daysBetween = Math.floor((currentDate - lastVisit) / (1000 * 60 * 60 * 24));
      
      if (daysBetween < 1) {
        sidebar.innerHTML = `
          <div class="visitor-message">
            <h2>Welcome Back!</h2>
            <p>Back so soon! Awesome!</p>
          </div>
        `;
      } else {
        sidebar.innerHTML = `
          <div class="visitor-message">
            <h2>Welcome Back!</h2>
            <p>You last visited ${daysBetween} day${daysBetween === 1 ? '' : 's'} ago.</p>
          </div>
        `;
      }
    }
    
    localStorage.setItem('lastVisit', currentDate.toString());
  }
  
  async function loadGalleryItems() {
    try {
      const response = await fetch('data/attractions.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayGalleryItems(data.items);
    } catch (error) {
      console.error('Error loading gallery items:', error);
      document.getElementById('gallery').innerHTML = `
        <div class="error-message">
          <p>We're having trouble loading our local attractions. Please try again later.</p>
        </div>
      `;
    }
  }
  
  function displayGalleryItems(items) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear any placeholder
    
    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${item.name}</h2>
        <figure>
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <figcaption>${item.name}</figcaption>
        </figure>
        <div class="card-content">
          <address>${item.address}</address>
          <p>${item.description}</p>
          <button class="learn-more" aria-label="Learn more about ${item.name}">Learn More</button>
        </div>
      `;
      
      // Add hover effect to images (desktop only)
      const img = card.querySelector('img');
      img.addEventListener('mouseenter', () => {
        if (window.innerWidth > 640) {
          img.style.transform = 'scale(1.05)';
          img.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        }
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = '';
        img.style.boxShadow = '';
      });
      
      gallery.appendChild(card);
    });
  }



  document.addEventListener('DOMContentLoaded', function() {
    // Enhanced visitor message functionality
    displayVisitorMessage();
    
    // Rest of your existing code...
    loadGalleryItems();
  });
  
  function displayVisitorMessage() {
    const now = new Date();
    const lastVisit = localStorage.getItem('lastVisit');
    const sidebar = document.querySelector('.sidebar');
    
    // Create message container with close button
    const messageContainer = document.createElement('div');
    messageContainer.className = 'visitor-message';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-message';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close welcome message');
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Determine the appropriate message
    if (!lastVisit) {
      messageContent.innerHTML = `
        <h2>Welcome to Our Community!</h2>
        <h6>Let us know if you have any questions about our area.</h6>
        <p>Let us know if you have any questions about our area.</p>
      `;
    } else {
      const lastVisitDate = new Date(parseInt(lastVisit));
      const timeDiff = now - lastVisitDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 1) {
        messageContent.innerHTML = `
          <h2>Welcome Back!</h2>
          <p>Back so soon! Awesome!</p>
          <p>Let us know if you have any questions about our area.</p>
        `;
      } else {
        messageContent.innerHTML = `
          <h2>Welcome Back!</h2>
          <p>You last visited ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} ago.</p>
        `;
      }
    }
    
    // Assemble the message container
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(closeButton);
    
    // Clear sidebar and add new message
    sidebar.innerHTML = '';
    sidebar.appendChild(messageContainer);
    
    // Add close functionality
    closeButton.addEventListener('click', function() {
      messageContainer.style.display = 'none';
    });
    
    // Store current visit date
    localStorage.setItem('lastVisit', now.getTime());
  }

  

  document.addEventListener('DOMContentLoaded', function() {
    // Load and display visitor message
    displayVisitorMessage();
    
    // Load gallery items with enhanced animations
    loadGalleryItems();
    
    // Add responsive behavior
    setupCardInteractions();
  });
  
  function setupCardInteractions() {
    // Handle card hover/tap effects
    document.addEventListener('mousemove', handleCardTilt);
    document.addEventListener('touchmove', handleCardTilt, { passive: true });
  }
  
  function handleCardTilt(e) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleY = (x - centerX) / 20;
      const angleX = (centerY - y) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
  }
  
  async function loadGalleryItems() {
    try {
      const response = await fetch('data/attractions.json');
      const data = await response.json();
      renderCards(data.items);
      initializeAnimations();
    } catch (error) {
      console.error('Error loading gallery:', error);
      document.getElementById('gallery').innerHTML = `
        <div class="error-message">Failed to load attractions. Please check back later.</div>
      `;
    }
  }
  
  function renderCards(items) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = items.map((item, index) => `
      <div class="card" data-delay="${index * 100}">
        <div class="card-inner">
          <figure class="card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="image-overlay"></div>
          </figure>
          <div class="card-content">
            <h2>${item.name}</h2>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button class="learn-more" aria-label="Learn about ${item.name}">
              Explore <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  function initializeAnimations() {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay');
          entry.target.style.animation = `cardEntrance 0.6s ease-out ${delay}ms forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    cards.forEach(card => observer.observe(card));
  }