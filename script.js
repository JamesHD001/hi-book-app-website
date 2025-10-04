/* ---------------------------
  script.js  — consolidated
  - Unified DOMContentLoaded
  - Posts (text + image/video) with preview + remove
  - localStorage persistence
  - Go Live modal (created if missing) with Esc support
  - Lucide initialization + accessible nav links
  - Tab switching for profile
  - Sanitization to prevent XSS
--------------------------- */

(function () {
  "use strict";

  /* ---------- Utilities ---------- */

  // sanitize user text (basic)
  function sanitizeText(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // create element from HTML string
  function createFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  /* ---------- Local Storage Helpers ---------- */

  const STORAGE_KEY = "hibook_posts_v1"; // shared store for feed/profile posts; adapt as needed

  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Failed to load posts:", e);
      return [];
    }
  }

  function savePosts(posts) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.warn("Failed to save posts:", e);
    }
  }

  /* ---------- UI Renderers ---------- */

  function renderPost(post) {
    // post = { id, author, text, mediaType, mediaDataURL, time, likes }
    const time = new Date(post.time).toLocaleString();
    const sanitized = sanitizeText(post.text || "");
    const mediaHTML =
      post.mediaDataURL && post.mediaType
        ? post.mediaType.startsWith("image/")
          ? `<img src="${post.mediaDataURL}" alt="User uploaded image">`
          : `<video src="${post.mediaDataURL}" controls></video>`
        : "";

    const html = `
      <div class="post" data-id="${post.id}">
        <div class="post-author">${sanitizeText(post.author || "User")}</div>
        ${sanitized ? `<div class="post-content">${sanitized}</div>` : ""}
        ${mediaHTML}
        <div class="post-meta">
          <span class="post-time">${time}</span>
        </div>
        <div class="post-actions-bar">
          <button class="like-btn" aria-label="Like post"> <i data-lucide="heart"></i> <span class="like-count">${post.likes||0}</span></button>
          <button class="comment-btn" aria-label="Comment on post"><i data-lucide="message-circle"></i> Comment</button>
          <button class="share-btn" aria-label="Share post"><i data-lucide="share-2"></i> Share</button>
        </div>
      </div>
    `;
    const node = createFromHTML(html);
    return node;
  }

  function prependPostToContainer(post, container) {
    const node = renderPost(post);
    container.prepend(node);
    // re-create icons inside this new node
    lucide.createIcons();
  }

  /* ---------- Post Creator (reusable) ---------- */

  function wirePostUI({
    textareaSelector,
    fileInputSelector,
    previewContainerSelector,
    postButtonSelector,
    postsContainerSelector,
    authorName = "2ten",
  }) {
    const textarea = document.querySelector(textareaSelector);
    const fileInput = document.querySelector(fileInputSelector);
    const previewContainer = document.querySelector(previewContainerSelector);
    const postButton = document.querySelector(postButtonSelector);
    const postsContainer = document.querySelector(postsContainerSelector);

    if (!postButton || !postsContainer || !textarea) {
      // UI not present on this page — nothing to wire
      return;
    }

    let selectedFile = null; // File object
    let selectedDataURL = null; // preview dataURL

    function clearMediaSelection() {
      selectedFile = null;
      selectedDataURL = null;
      if (fileInput) fileInput.value = "";
      if (previewContainer) previewContainer.innerHTML = "";
    }

    // file chosen -> show preview
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        previewContainer && (previewContainer.innerHTML = "");
        selectedFile = null;
        selectedDataURL = null;

        const f = e.target.files && e.target.files[0];
        if (!f) return;

        // accept only image/video
        if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
          alert("Only images and videos are supported.");
          return;
        }

        selectedFile = f;
        // show preview via object URL
        selectedDataURL = URL.createObjectURL(f);

        const previewEl =
          f.type.startsWith("image/")
            ? createFromHTML(`<img src="${selectedDataURL}" alt="Preview Image">`)
            : createFromHTML(`<video src="${selectedDataURL}" controls></video>`);

        // Remove button
        const removeBtn = createFromHTML(
          `<button class="media-remove-btn" title="Remove media" aria-label="Remove media">&times;</button>`
        );
        removeBtn.addEventListener("click", () => {
          clearMediaSelection();
        });

        if (previewContainer) {
          previewContainer.appendChild(previewEl);
          previewContainer.appendChild(removeBtn);
        }
      });
    }

    // If posts are persisted in localStorage, render existing posts initially
    const stored = loadPosts();
    // Render posts (newest first)
    if (postsContainer && stored.length) {
      stored.slice().reverse().forEach((p) => prependPostToContainer(p, postsContainer));
    }

    // Post button handler
    postButton.addEventListener("click", () => {
      const rawText = textarea.value || "";
      const text = rawText.trim();

      if (!text && !selectedDataURL) {
        alert("You can't post an empty message!");
        return;
      }

      // Build post object
      const postObj = {
        id: "p_" + Date.now(),
        author: authorName,
        text: text,
        time: Date.now(),
        likes: 0,
      };

      if (selectedFile && selectedDataURL) {
        postObj.mediaType = selectedFile.type;
        postObj.mediaDataURL = selectedDataURL;
      }

      // Save to storage
      const posts = loadPosts();
      posts.push(postObj);
      savePosts(posts);

      // Prepend to UI
      prependPostToContainer(postObj, postsContainer);

      // Clear inputs
      textarea.value = "";
      clearMediaSelection();
    });

    // Delegate like button clicks inside postsContainer
    postsContainer.addEventListener("click", (e) => {
      const likeBtn = e.target.closest(".like-btn");
      if (!likeBtn) return;
      const postNode = likeBtn.closest(".post");
      if (!postNode) return;
      const id = postNode.dataset.id;
      const posts = loadPosts();
      const idx = posts.findIndex((p) => p.id === id);
      if (idx === -1) return;
      posts[idx].likes = (posts[idx].likes || 0) + 1;
      savePosts(posts);
      // update UI count
      const countSpan = likeBtn.querySelector(".like-count");
      if (countSpan) countSpan.textContent = posts[idx].likes;
    });
  }

  /* ---------- Go Live Modal ---------- */

  function ensureGoLiveModalExists() {
    let modal = document.getElementById("goLiveModal");
    if (modal) return modal;

    // create modal markup and append to body
    const html = `
      <div id="goLiveModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="goLiveTitle" tabindex="-1">
        <div class="modal-content">
          <h2 id="goLiveTitle">Start Live Stream</h2>
          <input type="text" id="liveTitle" placeholder="Enter stream title..." aria-label="Live stream title">
          <div class="modal-actions">
            <button class="btn cancel-btn" id="cancelGoLive">Cancel</button>
            <button class="btn start-btn" id="startGoLive">Start Live</button>
          </div>
        </div>
      </div>
    `;
    const node = createFromHTML(html);
    document.body.appendChild(node);
    modal = document.getElementById("goLiveModal");
    return modal;
  }

  function wireGoLive() {
    const goLiveBtn = document.getElementById("goLiveBtn");
    if (!goLiveBtn) return;

    const modal = ensureGoLiveModalExists();
    const cancelGoLive = modal.querySelector("#cancelGoLive");
    const startGoLive = modal.querySelector("#startGoLive");
    const liveTitleInput = modal.querySelector("#liveTitle");

    function openModal() {
      modal.style.display = "flex";
      // focus the input
      setTimeout(() => liveTitleInput && liveTitleInput.focus(), 60);
      // trap focus simple approach
      document.addEventListener("keydown", escClose);
    }
    function closeModal() {
      modal.style.display = "none";
      document.removeEventListener("keydown", escClose);
      if (goLiveBtn) goLiveBtn.focus();
    }
    function escClose(e) {
      if (e.key === "Escape") closeModal();
    }

    goLiveBtn.addEventListener("click", openModal);
    cancelGoLive && cancelGoLive.addEventListener("click", closeModal);
    startGoLive &&
      startGoLive.addEventListener("click", () => {
        const title = (liveTitleInput && liveTitleInput.value || "").trim();
        if (!title) {
          alert("Please enter a stream title.");
          return;
        }
        closeModal();
        // For now, we simulate starting a live stream — later you'd open a new live page
        alert(`Starting live stream: ${title}`);
        // Example: window.location.href = `live.html?title=${encodeURIComponent(title)}`;
      });

    // close when clicking outside content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  /* ---------- Nav accessibility + hamburger ---------- */

  function setupNavAndHamburger() {
    // render lucide icons (if loaded)
    if (window.lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }

    // set aria-labels for icon-only links (use title if present)
    document.querySelectorAll(".main-nav-links a, .nav-links a").forEach((a) => {
      if (!a.getAttribute("aria-label") && a.title) {
        a.setAttribute("aria-label", a.title);
      }
    });

    // active link highlight
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav-links a, .nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.split("/").pop() === current) a.classList.add("active");
    });

    // hamburger
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks") || document.querySelector(".main-nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => navLinks.classList.toggle("show"));
    }
  }

  /* ---------- Profile Tabs ---------- */

  function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    const panes = document.querySelectorAll(".tab-pane");
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        const id = tab.dataset.tab;
        const pane = document.getElementById(id);
        pane && pane.classList.add("active");
      });
    });
  }

  /* ---------- Initialization ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    // Initialize icons
    try {
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    } catch (e) {
      console.warn("Lucide error", e);
    }

    // Setup nav + hamburger + aria
    setupNavAndHamburger();

    // wire go live (modal created if needed)
    wireGoLive();

    // tab switching
    setupTabs();

    // Wire posting UI (home feed)
    wirePostUI({
      textareaSelector: "#create-post-text",
      fileInputSelector: "#upload-media",
      previewContainerSelector: "#media-preview",
      postButtonSelector: "#postButton",
      postsContainerSelector: "#posts-container",
      authorName: "2ten", // replace with dynamic username if available
    });

    // Wire profile posting UI (profile page)
    wirePostUI({
      textareaSelector: "#profile-post-text",
      fileInputSelector: "#profile-upload-media", // if present on profile, optional
      previewContainerSelector: "#profile-media-preview", // if present, optional
      postButtonSelector: "#profile-post-btn",
      postsContainerSelector: "#profile-posts-container",
      authorName: "2ten", // replace with dynamic username if available
    });

    /* OPTIONAL: Clean up unused handlers in old code by not running them */
    // (We intentionally do not run other page-specific listeners here; the new module covers the features.)
  });

  // end IIFE
})();

// When login/signup is successful:
localStorage.setItem("loggedInUser", "2ten"); // Replace "2ten" with actual username input

document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("profile-name");
  const usernameEl = document.getElementById("profile-username");

  // Get stored data (fallbacks in case nothing is saved yet)
  const displayName = localStorage.getItem("displayName") || "Guest";
  const username = localStorage.getItem("username") || "@guest";

  if (nameEl) nameEl.textContent = displayName;
  if (usernameEl) usernameEl.textContent = username;
});

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Tab switching logic (unchanged)
  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Get current user info from localStorage
  const displayName = localStorage.getItem("displayName") || "Guest";
  const username = localStorage.getItem("username") || "@guest";

  // Update profile header
  document.getElementById("profile-name").textContent = displayName;
  document.getElementById("profile-username").textContent = username;

  // Profile posting logic
  const postBtn = document.getElementById("profile-post-btn");
  const postText = document.getElementById("profile-post-text");
  const postsContainer = document.getElementById("profile-posts-container");

  postBtn.addEventListener("click", () => {
    const text = postText.value.trim();
    if (text === "") return;

    // Create post dynamically with user info
    const postDiv = document.createElement("div");
    postDiv.classList.add("profile-post");
    postDiv.innerHTML = `
      <strong>${displayName}</strong> <span class="username">${username}</span>
      <p>${text}</p>
    `;

    // Prepend (newest post on top)
    postsContainer.prepend(postDiv);

    postText.value = "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const profileLink = document.getElementById("profile-link");

  profileLink.addEventListener("click", (e) => {
    const displayName = localStorage.getItem("displayName");
    const username = localStorage.getItem("username");

    if (!displayName || !username) {
      e.preventDefault(); // Stop default navigation

      // Show modal encouraging login/signup
      document.getElementById("loginPromptModal").classList.add("show");
    }
  });

  // Modal button actions
  document.getElementById("goToLogin").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  document.getElementById("goToSignup").addEventListener("click", () => {
    window.location.href = "signup.html";
  });
});

   document.addEventListener("DOMContentLoaded", function () {
        lucide.createIcons();

        const displayName = localStorage.getItem("displayName");
        const username = localStorage.getItem("username");
        const profileSection = document.querySelector(".profile-section");
        const loginPromptModal = document.getElementById("loginPromptModal");

        if (!displayName || !username) {
          // Show login prompt modal for guests
          loginPromptModal.classList.add("show");
        } else {
          // Show profile section for logged-in users
          profileSection.style.display = "block";
          document.getElementById("profile-name").textContent = displayName;
          document.getElementById("profile-username").textContent = `@${username}`;
        }

        // Modal button actions
        document.getElementById("goToLogin").addEventListener("click", () => {
          window.location.href = "login.html";
        });

        document.getElementById("goToSignup").addEventListener("click", () => {
          window.location.href = "signup.html";
        });
      });
      