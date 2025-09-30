// auth/togglePassword.js
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-visibility").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const targetId = toggleBtn.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (!input) return;

      // Toggle input type
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Swap icon
      toggleBtn.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");

      // Refresh Lucide icons
      lucide.createIcons();
    });
  });
});
