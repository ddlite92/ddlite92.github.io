document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.main-header nav > ul > li > a');
  const sections = {
    'About Me': document.getElementById('about-me'),
    'Experiences': document.getElementById('experiences'),
    'Projects': document.getElementById('projects'),
    'Tools' : document.getElementById('tools')
  };
  
  // Add click event to each link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Smooth scroll to the section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without reload
        history.pushState(null, null, `#${targetId}`);
        
        // Update active class
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Highlight active section based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 200; // Adding offset
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Highlight correct link on page load if hash exists
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetSection = document.getElementById(hash);
    if (targetSection) {
      targetSection.scrollIntoView();
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
          link.classList.add('active');
        }
      });
    }
  }
});