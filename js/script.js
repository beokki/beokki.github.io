const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
let currentSectionIndex = 0;

window.addEventListener('beforeunload', () => {
    location.reload(true);
});


function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;

    const targetSection = sections[index];
    window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
    });

    currentSectionIndex = index;
    highlightNavLink();
}

function highlightNavLink() {
    navLinks.forEach((link, index) => {
        if (index === currentSectionIndex) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

let isScrolling = false;
window.addEventListener('wheel', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) {
        if (currentSectionIndex < sections.length - 1) {
            scrollToSection(currentSectionIndex + 1);
        }
    } else {
        if (currentSectionIndex > 0) {
            scrollToSection(currentSectionIndex - 1);
        }
    }

    setTimeout(() => {
        isScrolling = false;
    }, 1000);
});

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionIndex = index;
            highlightNavLink();
        }
    });
});

highlightNavLink();

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}
function updateAge() {
    const ageElement = document.getElementById('age');
    const birthDate = '2000-10-28';
    ageElement.textContent = calculateAge(birthDate);
}
document.addEventListener('DOMContentLoaded', updateAge);
