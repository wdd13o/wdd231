document.addEventListener("DOMContentLoaded", () => {
    const memberContainer = document.getElementById("member-container");
    const gridViewButton = document.getElementById("grid-view");
    const listViewButton = document.getElementById("list-view");

    // Set default view (grid view)
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

    // Function to toggle views
    function toggleView(view) {
        memberContainer.className = ""; // Clear all classes
        memberContainer.classList.add(view); // Add the selected view class
    }

    // Event listeners for buttons
    gridViewButton.addEventListener("click", () => toggleView("grid"));
    listViewButton.addEventListener("click", () => toggleView("list"));
});

document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");

    burgerMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Set current year in the footer
    const yearElement = document.getElementById("year");
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;

    // Set last modified date in the footer
    const lastModifiedElement = document.getElementById("last-modified-date");
    const lastModifiedDate = new Date(document.lastModified);
    lastModifiedElement.textContent = lastModifiedDate.toLocaleDateString();
});