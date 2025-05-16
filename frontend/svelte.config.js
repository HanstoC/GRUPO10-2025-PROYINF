import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() }
};

// export default {
//   plugins: [sveltekit()],
//   server: {
//     host: '0.0.0.0',
//     port: 3000 // asegúrate de que coincida con el expuesto en Docker
//   }
// };
export default {
  kit: {
    adapter: adapter({
      fallback: 'index.html'  // o el nombre correcto
    })
  
}
};
