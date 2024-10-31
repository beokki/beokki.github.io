const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-menu a');
const progressBar = document.querySelector('.progress-bar');

function highlightSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach((link) => link.classList.remove('active'));
            if (index === 0) {
                document.querySelector('.home-link').classList.add('active');
            } else {
                navLinks[index - 1].classList.add('active');
            }
        }
    });
}

function checkInView() {
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
            section.classList.add('in-view');
        }
    });
}

function updateProgressBar() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
}

window.addEventListener('scroll', () => {
    highlightSection();
    checkInView();
    updateProgressBar();
});

document.querySelectorAll('.nav-menu a, .home-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    });
});

checkInView();
