import { showFormattedDate } from "../../utils/index.js";

export default class BookmarkView {
    constructor() {
        this._onNavigate = null;
    }

    setNavigationCallback(callback) {
        this._onNavigate =
            callback ||
            ((path) => {
                window.location.hash = path;
            });
    }

    render() {
        return `
      <section class="bookmark-container">
        <h2>Bookmarked Stories</h2>
        <div id="bookmark-list" class="bookmark-list"></div>
      </section>
    `;
    }

    renderBookmarks(bookmarks) {
        const container = document.querySelector("#bookmark-list");
        if (!container) return;

        if (!bookmarks.length) {
            container.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 3rem;">
          <i class="fas fa-bookmark" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No bookmarks found.</p>
          <p style="opacity: 0.7;">Start bookmarking your favorite stories!</p>
        </div>
      `;
            return;
        }

        container.innerHTML = bookmarks
            .map(
                (story) => `
        <div class="bookmark-item">
          <h3>${story.name || story.title}</h3>
          <p>${story.description}</p>
          <div class="bookmark-actions">
            <button class="view-btn" data-id="${story.id}">View Details</button>
            <button class="delete-btn" data-id="${
                story.id
            }">Remove Bookmark</button>
          </div>
          <p class="bookmark-date">Bookmarked on: ${showFormattedDate(
              story.bookmarkedAt
          )}</p>
        </div>`
            )
            .join("");
    }

    setupEventListeners({ onViewStory, onRemoveBookmark }) {
        const container = document.querySelector("#bookmark-list");
        if (!container) return;

        // View details button handler
        container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("view-btn")) {
                const storyId = e.target.dataset.id;
                onViewStory(storyId);
            }
        });

        // Delete bookmark button handler
        container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-btn")) {
                const storyId = e.target.dataset.id;
                await onRemoveBookmark(storyId);
            }
        });
    }

    showMessage(message, type = "info") {
        // Create a toast notification
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "error" ? "#f44336" : "#4CAF50"};
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.opacity = "1";
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}
