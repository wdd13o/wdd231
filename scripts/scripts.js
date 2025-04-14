document.addEventListener('DOMContentLoaded', function() {
    // Responsive menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Update the current year in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').innerHTML = `&copy;${currentYear} 🌺 Bundu Kallon Freetown 🌺 Sierra Leone`;

    // Update the last modified date in the footer
    document.getElementById('last-modified').innerHTML = `Last Update: ${document.lastModified}`;

    // Course List Array
    const courses = [
        { code: 'CSE 110', name: 'Introduction to Programming', credits: 3, completed: false },
        { code: 'WDD 130', name: 'Web Fundamentals', credits: 3, completed: false },
        { code: 'CSE 111', name: 'Programming with Functions', credits: 3, completed: false },
        { code: 'CSE 210', name: 'Data Structures', credits: 3, completed: false },
        { code: 'WDD 131', name: 'Web Development', credits: 3, completed: false },
        { code: 'WDD 231', name: 'Advanced CSS', credits: 3, completed: false }
    ];



    // Mark completed courses
    courses.forEach(course => {
        if (course.code === 'CSE 110' || course.code === 'WDD 130') {
            course.completed = true;
        }
    });

    // Function to display courses
    function displayCourses(filteredCourses) {
        const coursesContainer = document.getElementById('courses');
        coursesContainer.innerHTML = '';
        filteredCourses.forEach(course => {
            const courseButton = document.createElement('button');
            courseButton.className = `course ${course.completed ? 'completed' : ''}`;
            courseButton.innerHTML = `
                <h3>${course.code}</h3>
                <p>${course.name}</p>
                <p>Credits: ${course.credits}</p>
            `;
            coursesContainer.appendChild(courseButton);
        });

        // Display total credits
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        const totalCreditsElement = document.createElement('p');
        totalCreditsElement.innerHTML = `Total Credits: ${totalCredits}`;
        coursesContainer.appendChild(totalCreditsElement);
    }

    // Function to filter courses
    window.filterCourses = function(category) {
        let filteredCourses;
        if (category === 'all') {
            filteredCourses = courses;
        } else {
            filteredCourses = courses.filter(course => course.code.startsWith(category));
        }
        displayCourses(filteredCourses);
    };

    // Display all courses by default
    filterCourses('all');
});


// Ensure all images have lazy loading
document.querySelectorAll('img').forEach(img => {
    if (!img.loading) {
        img.loading = 'lazy';
    }
});