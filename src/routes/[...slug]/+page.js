import { error } from '@sveltejs/kit';
import { pages, loadComponent } from '$lib/docs.js';
import { sections } from '$lib/site.js';

export const entries = () => pages.map((page) => ({ slug: page.slug }));

export async function load({ params }) {
	const slug = params.slug.replace(/\/$/, '');
	const index = pages.findIndex((page) => page.slug === slug);
	if (index < 0) error(404, 'This page does not exist.');
	return {
		page: pages[index],
		section: sections.find((s) => s.dir === pages[index].dir)?.label ?? '',
		content: await loadComponent(pages[index]),
		previous: pages[index - 1] ?? null,
		next: pages[index + 1] ?? null
	};
}
