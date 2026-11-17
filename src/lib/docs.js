import { sections } from './site.js';
import { allPages } from './pages.js';

// Each page's component is loaded only when the page is opened.
const components = import.meta.glob('/src/content/**/*.md');

const sectionIndex = (dir) => {
	const i = sections.findIndex((s) => s.dir === dir);
	return i < 0 ? sections.length : i;
};

/** Every page, in sidebar order. */
export const pages = [...allPages].sort(
	(a, b) => sectionIndex(a.dir) - sectionIndex(b.dir) || a.order - b.order || a.title.localeCompare(b.title)
);

/** The sidebar: sections that have at least one page. */
export const nav = sections
	.map((section) => ({ ...section, pages: pages.filter((p) => p.dir === section.dir) }))
	.filter((section) => section.pages.length > 0);

export const href = (base, page) => `${base}/${page.slug ? page.slug + '/' : ''}`;

export async function loadComponent(page) {
	return (await components[page.file]()).default;
}
