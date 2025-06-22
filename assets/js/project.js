document.addEventListener('DOMContentLoaded', function() {
    const projectsSection = document.getElementById('projects');
    
    // Projects data with correct paths
    const projects = [
        {
            title: "Interactive Calculator",
            description: "HTML, CSS, and JavaScript calculator",
            image: "basicProjects/calculator/images/calc_preview.png",
            demo: "basicProjects/calculator/index.html",
            code: "https://github.com/ddlite92/ddlite92.github.io/tree/main/basicProjects/calculator"
        },
        {
            title: "Cat Food Order",
            description: "HTML, CSS, JavaScript and Firebase",
            image: "basicProjects/AddToCart/catOrderApp.png",
            demo: "basicProjects/AddToCart/index.html",
            code: "https://github.com/ddlite92/ddlite92.github.io/tree/main/basicProjects/AddToCart"
        },
        {
            title: "ToDo App",
            description: "Interactive task manager with JSON integration",
            image: "basicProjects/todDoApp/toDoApp.png",
            demo: "basicProjects/todDoApp/index.html",  // Updated path
            code: "https://github.com/ddlite92/ddlite92.github.io/tree/main/basicProjects/todDoApp"
        }
    ];

    // Create projects section HTML
    let projectsHTML = `
        <h3 class="section-title">Projects and Tutorials</h3>
        <p class="section-description">
            This section showcases all my coding projects, tutorials, and scripts. 
            <a href="https://github.com/ddlite92" target="_blank">See more on GitHub →</a>
        </p>
        <div class="projects-grid">
    `;

    // Add each project to the grid
    projects.forEach(project => {
        projectsHTML += `
            <div class="project-card">
                <img src="${project.image}" alt="${project.title} Preview" class="project-image">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        <a href="${project.demo}" class="demo-btn" target="_blank">Live Demo</a>
                        <a href="${project.code}" class="code-btn" target="_blank">Source Code</a>
                    </div>
                </div>
            </div>
        `;
    });

    projectsHTML += `</div>`;
    projectsSection.innerHTML = projectsHTML;
    
    // Debugging check
    console.log('Projects section populated:', projectsSection.innerHTML.length > 0);
});