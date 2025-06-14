import App from "./pages/app";
import "../styles/styles.css";
import "regenerator-runtime/runtime";

const app = new App({
    navigationDrawer: document.querySelector("#navigation-drawer"),
    drawerButton: document.querySelector("#drawer-button"),
    content: document.querySelector("#main-content"),
});

window.addEventListener("popstate", () => {
    app.renderPage();
});

window.addEventListener("hashchange", () => {
    app.renderPage();
});

window.addEventListener("DOMContentLoaded", () => {
    app.renderPage();
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (
            link &&
            link.getAttribute("href") &&
            link.getAttribute("href").startsWith("/")
        ) {
            e.preventDefault();
            window.location.hash = link.getAttribute("href");
        }
    });
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/sw.js")
            .then(() => {
                console.log("Service Worker registered");
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    }
});
