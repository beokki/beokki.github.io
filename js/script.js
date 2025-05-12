const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

let currentSectionIndex = 0;

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.95,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      // Skip animations if on mobile
      if (isMobileDevice()) {
          entry.target.classList.add("in-view");
          return;
      }

      const section = entry.target;
      const isAboutSection = section.classList.contains('about-section');
      
      if (entry.isIntersecting) {
          setTimeout(() => {
              const index = Array.from(sections).indexOf(section);
              currentSectionIndex = index;
              highlightNavLink();
              
              section.classList.add("in-view");
              if (isAboutSection) {
                  section.classList.add("animate-about");
              }
          }, 100);
      } else {
          section.classList.add('transitioning-out');
          
          setTimeout(() => {
              section.classList.remove("in-view", "animate-about", "transitioning-out");
          }, 500);
      }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isMobileDevice() {
  return window.innerWidth <= 1024;
}

const handleWheel = debounce((event) => {
  if (!isMobileDevice()) {
    if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1);
    } else if (event.deltaY < 0 && currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1);
    }
  }
}, 150);

window.addEventListener("wheel", handleWheel);

function updateScrollBehavior() {
  document.documentElement.style.overflow = isMobileDevice()
    ? "auto"
    : "hidden";
}

window.addEventListener("resize", debounce(updateScrollBehavior, 150));

updateScrollBehavior();

function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return;
  
  // Skip transition if on mobile
  if (isMobileDevice()) {
      sections[index].scrollIntoView({ behavior: "smooth" });
      currentSectionIndex = index;
      highlightNavLink();
      return;
  }
  
  const currentSection = sections[currentSectionIndex];
  if (currentSection) {
      currentSection.classList.add('transitioning-out');
  }
  
  setTimeout(() => {
      sections[index].scrollIntoView({ behavior: "smooth" });
      currentSectionIndex = index;
      highlightNavLink();
  }, 100);
}

function highlightNavLink() {
  navLinks.forEach((link, index) => {
    link.setAttribute(
      "aria-current",
      index === currentSectionIndex ? "page" : "false"
    );
    link.classList.toggle("active", index === currentSectionIndex);
  });
}

highlightNavLink();

// Project data
const projects = [
  {
      title: "REEFTOWN",
      description: "Reeftown is a short 2.5D game built in Unreal Engine 5.5, where players must escape a shark-infested town. I designed the game mechanics and level, to create an engaging experience with dynamic abilities and combat. Players can utilize two unique abilities to defeat sharks and to escape the town.",
      link: "https://github.com/beokki/Reeftown",
      number: "01"
  },
  {
    title: "I-LAND (In Progress)",
    description: "I-LAND is a cozy open-world single-player game inspired by The Legend of Zelda: Breath of the Wild and Stardew Valley. Set in a land of lush landscapes and floating islands, the game invites players to explore, gather resources and uncover hidden secrets. I contributed as the Game Designer, focusing on crafting an engaging world, light survival mechanics and seamless exploration.The warm color palette and calming atmosphere aim to provide players with an immersive and relaxing experience, blending fantasy with heartfelt storytelling.",
    link: "assets/(GDD) I-LAND.pdf",
    number: "02"
  },
  {
      title: "Portfolio",
      description: "Portfolio website showcasing my projects and skills.",
      link: "https://github.com/beokki/stevens.github.io",
      number: "03"
  },
  {
      title: "Shiro",
      description: "Discord Bot built with JavaScript, featuring custom commands.",
      link: "https://github.com/beokki/Shiro-Bot",
      number: "04"
  },
  {
      title: "Dojo",
      description: "3-D Environment Modeling Project",
      link: "media/HighresScreenshot00001.png",
      number: "05"
  }
  // Add more projects here
];

// DOM Elements
const carousel = document.querySelector('.carousel-content');
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.nav-arrow.prev');
const nextBtn = document.querySelector('.nav-arrow.next');
const projectInfo = document.querySelector('.project-info');
const featureNumber = document.querySelector('.number-bg');

let currentIndex = 0;
let isTransitioning = false;
let touchStartX = 0;
let touchEndX = 0;

// Update project information with animation
function updateProjectInfo(index) {
  const project = projects[index];
  const infoContent = projectInfo.querySelector('.info-content');
  const infoBox = projectInfo.querySelector('.info-box');

  // Animate out
  projectInfo.style.opacity = '0';
  projectInfo.style.transform = 'translateX(-20px)';

  setTimeout(() => {
      // Update content
      infoContent.querySelector('.project-name').textContent = project.title;
      infoBox.querySelector('.project-description').textContent = project.description;
      infoBox.querySelector('.project-link').href = project.link;

      // Update feature number
      featureNumber.textContent = project.number;

      // Update navigation numbers
      const prevIndex = (index - 1 + projects.length) % projects.length;
      const nextIndex = (index + 1) % projects.length;
      prevBtn.querySelector('span').textContent = projects[prevIndex].number;
      nextBtn.querySelector('span').textContent = projects[nextIndex].number;

      // Animate in
      projectInfo.style.opacity = '1';
      projectInfo.style.transform = 'translateX(0)';
  }, 300);
}

// Slide transition
function transitionSlide(index) {
  if (isTransitioning) return;
  isTransitioning = true;

  // Update slides
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');

  // Update indicators
  indicators.forEach(indicator => indicator.classList.remove('active'));
  indicators[index].classList.add('active');

  // Update project info
  updateProjectInfo(index);

  // Reset transition flag
  setTimeout(() => {
      isTransitioning = false;
  }, 500);
}

// Navigation functions
function nextSlide() {
  if (isTransitioning) return;
  currentIndex = (currentIndex + 1) % slides.length;
  transitionSlide(currentIndex);
}

function prevSlide() {
  if (isTransitioning) return;
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  transitionSlide(currentIndex);
}

// Touch handlers
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  const minSwipeDistance = 50;

  if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
          prevSlide();
      } else {
          nextSlide();
      }
  }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
      if (currentIndex !== index) {
          currentIndex = index;
          transitionSlide(currentIndex);
      }
  });
});

carousel.addEventListener('touchstart', handleTouchStart);
carousel.addEventListener('touchend', handleTouchEnd);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
      prevSlide();
  } else if (e.key === 'ArrowRight') {
      nextSlide();
  }
});

// function startAutoSlide(interval = 5000) {
//   return setInterval(() => {
//       if (!document.hidden && !isTransitioning) {
//           nextSlide();
//       }
//   }, interval);
// }

// Initialize
function initializeCarousel() {
  // Set initial state
  transitionSlide(currentIndex);
  // startAutoSlide();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
      isTransitioning = false;
  }
});

// Add resize handler for mobile optimization
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  carousel.style.height = isMobile ? 'auto' : '100%';
}

window.addEventListener('resize', handleResize);
handleResize();