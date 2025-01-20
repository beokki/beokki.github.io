const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

const projectImages = document.querySelectorAll(".project-image");
const previewImages = document.querySelectorAll(".preview-image");
const projectInfo = document.querySelector(".project-info");

let currentIndex = 0;
let currentSectionIndex = 0;
let isTransitioning = false;

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = Array.from(sections).indexOf(entry.target);
      currentSectionIndex = index;
      highlightNavLink();
      entry.target.classList.add("in-view");
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

const projectData = [
  {
    title: "Personal Portfolio",
    description:
      "Portfolio website showcasing my projects and skills.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    link: "https://github.com/beokki/stevens.github.io",
  },
  {
    title: "Shiro Bot",
    description:
      "Discord Bot built with JavaScript, featuring custom commands.",
    tags: ["JavaScript", "Discord.js", "Node.js"],
    link: "https://github.com/beokki/Shiro-Bot",
  },
  {
    title: "Game Project",
    description:
      "HD-2D game developed in Unreal Engine 5.4",
    tags: ["Unreal Engine", "3D", "Game Design"],
    link: "#",
  }
];

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
  sections[index].scrollIntoView({ behavior: "smooth" });
  currentSectionIndex = index;
  highlightNavLink();
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

function updateProjectInfo(index) {
  const project = projectData[index];
  const title = projectInfo.querySelector(".project-title");
  const description = projectInfo.querySelector(".project-description");
  const tags = projectInfo.querySelector(".project-tags");
  const link = projectInfo.querySelector(".project-link");

  title.textContent = project.title;
  description.textContent = project.description;
  tags.innerHTML = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  link.href = project.link;
}

function updatePreviews(newIndex) {
  const totalPreviews = previewImages.length;
  const spacing = 90; // Spacing between items
  const centerY = 100; // Center position

  previewImages.forEach((preview, i) => {
    // Calculate relative position in the rotation
    let relativeIndex = i - newIndex;
    if (relativeIndex > totalPreviews / 2) relativeIndex -= totalPreviews;
    if (relativeIndex < -totalPreviews / 2) relativeIndex += totalPreviews;

    // Always calculate position along the oval path
    const y = centerY + relativeIndex * spacing;
    const x = -50 + Math.abs(relativeIndex) * 3; // Subtle horizontal movement

    // Show/hide based on position
    if (Math.abs(relativeIndex) <= 1) {
      preview.classList.add("visible");
    } else {
      preview.classList.remove("visible");
    }

    // Apply transform - items always follow the path
    preview.style.transform = `translate(${x}%, ${y}px)`;

    // Update active state
    preview.setAttribute("data-active", i === newIndex ? "true" : "false");
  });
}

function selectProject(newIndex) {
  if (isTransitioning) return;
  isTransitioning = true;

  const totalProjects = projectImages.length;
  newIndex = ((newIndex % totalProjects) + totalProjects) % totalProjects;

  // Update main project
  projectImages[currentIndex].classList.remove("active");
  projectImages[newIndex].classList.add("active");

  // Update previews
  updatePreviews(newIndex);

  // Update project info
  updateProjectInfo(newIndex);

  // Update current index
  currentIndex = newIndex;

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updatePreviews(0);
});

previewImages.forEach((preview, index) => {
  preview.addEventListener("click", () => {
    selectProject(index);
  });
});

function addProjectCorners() {
  const projectContainer = document.querySelector('.project-image-container');
  if (!projectContainer.querySelector('.corner')) {
      const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      corners.forEach(position => {
          const corner = document.createElement('div');
          corner.className = `corner ${position}`;
          projectContainer.appendChild(corner);
      });
  }
}

// Touch handling variables
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // Minimum distance for a swipe

// Handle touch start
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

// Handle touch end
function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe();
}

// Process swipe
function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
          // Swipe right - go to previous project
          selectProject(currentIndex - 1);
      } else {
          // Swipe left - go to next project
          selectProject(currentIndex + 1);
      }
  }
}

// Initialize touch controls
function initTouchControls() {
  const projectContainer = document.querySelector('.project-image-container');
  
  // Add touch event listeners
  projectContainer.addEventListener('touchstart', handleTouchStart, false);
  projectContainer.addEventListener('touchend', handleTouchEnd, false);
  
  // Add corner elements
  addProjectCorners();
}

// Add to document ready
document.addEventListener('DOMContentLoaded', () => {
  updatePreviews(0);
  initTouchControls();
});

// Update any existing event listeners to work with touch
previewImages.forEach((preview, index) => {
  preview.addEventListener('click', () => {
      selectProject(index);
  });
  preview.addEventListener('touchend', (e) => {
      e.preventDefault();
      selectProject(index);
  });
});

highlightNavLink();
