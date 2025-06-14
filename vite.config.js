import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "src", "public"),
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    plugins: [
        VitePWA({
            devOptions: {
                enabled: true,
            },
            registerType: "autoUpdate",
            includeAssets: [
                "/favicon.png",
                "/images/logo.png",
                "/images/Bojji1.jpeg",
            ],
            workbox: {
                globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,ico,json}"],
            },
            manifest: {
                theme_color: "#0F172A",
                background_color: "#f5f8fa",
                display: "standalone",
                scope: "/",
                start_url: "/",
                name: "My App",
                short_name: "My Story",
                description:
                    "A news aggregator web app for the latest stories.",
                icons: [
                    {
                        src: "/images/logo.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/images/logo.png",
                        sizes: "256x256",
                        type: "image/png",
                    },
                    {
                        src: "/images/logo.png",
                        sizes: "384x384",
                        type: "image/png",
                    },
                    {
                        src: "/images/logo.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
