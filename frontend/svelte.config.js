import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// export default {
//   plugins: [sveltekit()],
//   server: {
//     host: '0.0.0.0',
//     port: 3000 // asegúrate de que coincida con el expuesto en Docker
//   }
// };
export default {
  plugins: [tailwindcss()],
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: ''
    }
  }
};
