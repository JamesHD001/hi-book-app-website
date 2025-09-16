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

document.addEventListener("DOMContentLoaded", () => {
  // Render all lucide icons initially
  lucide.createIcons();

  // Toggle password visibility with icon switching
  document.querySelectorAll(".toggle-visibility").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.target);

      if (input.type === "password") {
        input.type = "text";
        toggle.setAttribute("data-lucide", "eye-off");
      } else {
        input.type = "password";
        toggle.setAttribute("data-lucide", "eye");
      }

      // Re-render lucide icons after changing data-lucide
      lucide.createIcons();
    });
  });

  const signupForm = document.getElementById("signupForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");
  const emailFeedback = document.getElementById("emailFeedback");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const confirmFeedback = document.getElementById("confirmFeedback");
  const passwordStrength = document.getElementById("passwordStrength");

  // Email Validation (basic)
  emailInput.addEventListener("input", () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!emailPattern.test(emailInput.value)) {
      emailFeedback.textContent = "Please enter a valid email.";
      emailFeedback.style.color = "red";
    } else {
      emailFeedback.textContent = "";
    }
  });

  // Password Strength Check
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    let strength = 0;

    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    let message = "";
    let color = "";

    switch (strength) {
      case 0:
      case 1:
        message = "Weak";
        color = "red";
        break;
      case 2:
        message = "Medium";
        color = "orange";
        break;
      case 3:
      case 4:
        message = "Strong";
        color = "green";
        break;
    }

    passwordStrength.textContent = message;
    passwordStrength.style.color = color;
  });

  // Confirm Password Check
  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmFeedback.textContent = "Passwords do not match.";
      confirmFeedback.style.color = "red";
    } else {
      confirmFeedback.textContent = "";
    }
  });

  // Form Submit Handler
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (emailFeedback.textContent || confirmFeedback.textContent) {
      alert("Please fix errors before submitting.");
      return;
    }

    alert("Signup successful! Welcome to Hi!Book.");
    signupForm.reset();
    passwordStrength.textContent = "";
    lucide.createIcons(); // Reset icons after reset
  });
});

const passwordField = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
  const type = passwordField.type === 'password' ? 'text' : 'password';
  passwordField.type = type;

  // Change icon (👁 to 👁‍🗨 or vice versa)
  togglePassword.textContent = type === 'password' ? '👁' : '🙈';
});

document.querySelector('.contact-form-card form').addEventListener('submit', function (e) {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  if (!name || !email || !message) {
    e.preventDefault(); // Stop form submission
    const card = document.querySelector('.contact-form-card');
    card.classList.remove('shake'); // Reset animation if already played
    void card.offsetWidth; // Trick to restart animation
    card.classList.add('shake');
  }
});
