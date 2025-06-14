import { showFormattedDate } from "../../utils/index.js";
import {
    deleteReport as deleteReportDB,
    getReport,
    saveReport,
    getAllBookmarkedReports,
} from "../../data/indexed-DB.js";

const BookmarkView = {
    renderContainer() {
        return `
      <section class="bookmark-section">
        <div class="bookmark-header">
          <div class="header-content">
            <i class="fas fa-bookmark header-icon"></i>
            <h2 class="section-title">Bookmarked Stories</h2>
            <p class="section-subtitle">Your collection of saved stories</p>
          </div>
        </div>
        <div id="bookmark-list" class="bookmark-grid"></div>
      </section>
    `;
    },
    renderBookmarks(bookmarks) {
        const container = document.querySelector("#bookmark-list");
        if (!bookmarks.length) {
            container.innerHTML = `
                <div class="empty-bookmark-state">
                    <div class="empty-icon-container">
                        <i class="fas fa-bookmark empty-icon"></i>
                        <div class="empty-icon-bg"></div>
                    </div>
                    <h3 class="empty-title">No Bookmarks Yet</h3>
                    <p class="empty-description">Start building your personal collection by bookmarking stories you love!</p>
                    <div class="empty-actions">
                        <a href="/" class="btn-primary browse-btn">
                            <i class="fas fa-compass"></i>
                            <span>Explore Stories</span>
                        </a>
                    </div>
                    <div class="empty-decoration">
                        <div class="decoration-circle"></div>
                        <div class="decoration-circle"></div>
                        <div class="decoration-circle"></div>
                    </div>
                </div>
            `;
            return;
        }
        container.innerHTML = bookmarks
            .map((story) => {
                console.log("Story data:", story); // Debug log
                // Try multiple possible field names for image URL
                const imageUrl =
                    story.photoUrl ||
                    story.photo ||
                    story.image ||
                    story.thumbnail ||
                    story.pictureUrl ||
                    story.imageUrl ||
                    "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=200&fit=crop&crop=center";

                console.log("Image URL for story", story.id, ":", imageUrl); // Debug log

                return `
        <div class="bookmark-card" data-id="${story.id}">
          <div class="bookmark-card-header">
            <div class="bookmark-image-container">
              <img src="${imageUrl}" 
                   alt="${story.description || story.name || "Story image"}" 
                   loading="lazy" 
                   class="bookmark-image"
                   onload="console.log('✅ Image loaded successfully:', this.src)"
                   onerror="console.log('❌ Image failed to load:', this.src); this.src='https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop&crop=center'; this.classList.add('image-error');"/>
              <div class="bookmark-overlay">
                <i class="fas fa-bookmark bookmark-icon"></i>
              </div>
            </div>
          </div>
          <div class="bookmark-card-body">
            <div class="bookmark-meta">
              <span class="bookmark-date">
                <i class="fas fa-calendar-alt"></i>
                ${showFormattedDate(story.bookmarkedAt)}
              </span>
            </div>
            <h3 class="bookmark-title">${
                story.name || story.title || "Untitled Story"
            }</h3>
            <p class="bookmark-description">${(
                story.description || "No description available"
            ).substring(0, 120)}${
                    (story.description || "").length > 120 ? "..." : ""
                }</p>
            <div class="bookmark-stats">
              <div class="stat-item">
                <i class="fas fa-eye"></i>
                <span>Story</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span>Saved</span>
              </div>
            </div>
          </div>
          <div class="bookmark-card-footer">
            <button class="btn-primary view-btn" data-id="${story.id}">
              <i class="fas fa-eye"></i>
              <span>View Details</span>
            </button>
            <button class="btn-danger delete-btn" data-id="${story.id}">
              <i class="fas fa-trash-alt"></i>
              <span>Remove</span>
            </button>
          </div>
        </div>`;
            })
            .join("");

        this._addEventListeners();
    },
    async init() {
        try {
            const bookmarks = await getAllBookmarkedReports();
            console.log("Loaded bookmarks:", bookmarks); // Debug log
            this.renderBookmarks(bookmarks);
        } catch (error) {
            console.error("Error loading bookmarks:", error);
            const container = document.querySelector("#bookmark-list");
            container.innerHTML =
                "<p>Error loading bookmarks. Please try again later.</p>";
        }
    },

    _addEventListeners() {
        const container = document.querySelector("#bookmark-list");

        // View details button handler
        container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("view-btn")) {
                const reportId = e.target.dataset.id;
                // Navigasi ke halaman detail story
                window.location.hash = `/stories/${reportId}`;
            }
        });

        // Delete bookmark button handler
        container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-btn")) {
                const reportId = e.target.dataset.id;
                try {
                    await deleteReportDB(reportId);
                    // Refresh the bookmarks list
                    this.init();
                } catch (error) {
                    console.error("Error deleting bookmark:", error);
                }
            }
        });
    },
};

export default BookmarkView;
