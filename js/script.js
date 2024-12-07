const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
let currentSectionIndex = 0;

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
  // Only handle wheel event on desktop
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
  document.documentElement.style.overflow = isMobileDevice() ? 'auto' : 'hidden';
}

window.addEventListener('resize', debounce(updateScrollBehavior, 150));

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

highlightNavLink();
