import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';
import { mkdirSync, existsSync } from 'fs';
import sharp from 'sharp';

const ICON_SIZES = [16, 48, 128];
const SOURCE_ICON = 'assets/icon.png';

function generateIconsPlugin() {
    return {
        name       : 'generate-icons',
        closeBundle: async function() {
            if (!existsSync('dist/icons')) {
                mkdirSync('dist/icons', { recursive: true });
            }

            for (const size of ICON_SIZES) {
                await sharp(SOURCE_ICON)
                    .resize(size, size)
                    .png()
                    .toFile(`dist/icons/icon${size}.png`);
            }

            console.log('✓ Generated icons from', SOURCE_ICON);
        }
    };
}

export default defineConfig({
    plugins: [
        react(),
        webExtension({
            manifest: 'manifest.json'
        }),
        generateIconsPlugin()
    ],
    build: {
        outDir     : 'dist',
        emptyOutDir: true,
        minify     : false
    }
});
