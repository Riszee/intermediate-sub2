import { getStories } from "../../data/api";
import {
    saveReport,
    deleteReport,
    getReport,
    getAllBookmarkedReports,
} from "../../data/indexed-DB";

export default class HomeModel {
    async getStories({ page = 1, size = 10, location = 0, token }) {
        return await getStories({ page, size, location, token });
    }

    async getAllBookmarks() {
        return await getAllBookmarkedReports();
    }

    async getBookmarkedIds() {
        try {
            const bookmarks = await getAllBookmarkedReports();
            return bookmarks.map((bookmark) => bookmark.id);
        } catch (error) {
            console.error("Error getting bookmarked IDs:", error);
            return [];
        }
    }

    async toggleBookmark(story, isCurrentlyBookmarked) {
        try {
            if (isCurrentlyBookmarked) {
                await deleteReport(story.id);
                return false;
            } else {
                await saveReport(story);
                return true;
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            throw error;
        }
    }

    async isBookmarked(storyId) {
        try {
            const result = await getReport(storyId);
            return !!result;
        } catch (error) {
            console.error("Error checking bookmark status:", error);
            return false;
        }
    }
}
