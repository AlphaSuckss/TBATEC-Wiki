import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

export default {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexConfig)],
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		// BASE_PATH is "/<repository name>" on GitHub Pages and empty for local builds.
		paths: { base: process.env.BASE_PATH ?? '', relative: false }
	}
};
