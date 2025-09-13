// Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobilenavLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      mobilenavLinks.classList.toggle('show');
    });

// Highlight the active link based on current page
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop(); // e.g. about.html
  const navLinks = document.querySelectorAll("nav ul li a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

const backToTopBtn = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});
