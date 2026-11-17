import { escapeSvelte } from 'mdsvex';
import { createHighlighter, createCssVariablesTheme } from 'shiki';
import rehypeSlug from 'rehype-slug';

const BASE = process.env.BASE_PATH ?? '';

// Token colors come from CSS variables, so code follows the light and dark themes (see app.css).
const theme = createCssVariablesTheme({ name: 'tbatec', variablePrefix: '--code-', fontStyle: true });
const highlighter = await createHighlighter({ themes: [theme], langs: ['json', 'toml', 'bash'] });
const LANGS = new Set(highlighter.getLoadedLanguages());

function highlight(code, lang) {
	const html = highlighter.codeToHtml(code.replace(/\n$/, ''), { lang: LANGS.has(lang) ? lang : 'text', theme: 'tbatec' });
	return `{@html \`${escapeSvelte(html)}\`}`;
}

function visit(node, fn, parent = null, index = 0) {
	fn(node, parent, index);
	(node.children ?? []).forEach((child, i) => visit(child, fn, node, i));
}

const text = (node) => (node.type === 'text' ? node.value : (node.children ?? []).map(text).join(''));

/** Internal links get the site's base path; external links open in a new tab. */
function links() {
	return (tree) =>
		visit(tree, (node) => {
			if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') return;
			const href = node.properties.href;
			if (/^https?:/.test(href)) {
				node.properties.target = '_blank';
				node.properties.rel = 'noopener';
			} else if (href.startsWith('/')) {
				// Pages are served as folders, so "/powers/gui" becomes "/powers/gui/".
				const [, path, rest] = /^([^?#]*)(.*)$/.exec(href);
				node.properties.href = BASE + (path.endsWith('/') ? path : path + '/') + rest;
			}
		});
}

/** Raw HTML (the Codex's cards, icons, recipes and portraits) gets the base path on its own links and pictures too. */
function rawPaths() {
	return (tree) =>
		visit(tree, (node) => {
			if (node.type !== 'raw' || typeof node.value !== 'string') return;
			node.value = node.value
				.replace(/(href|src)="\/(?!\/)([^"#?]*)([^"]*)"/g, (all, attr, path, rest) => {
					if (attr === 'href' && !/\.[a-z0-9]+$/i.test(path) && path && !path.endsWith('/')) path += '/';
					return `${attr}="${BASE}/${path}${rest}"`;
				});
		});
}

/** Wide tables scroll sideways inside their own box instead of stretching the page. */
function scrollableTables() {
	return (tree) =>
		visit(tree, (node, parent, index) => {
			if (node.tagName !== 'table' || !parent || parent.properties?.className === 'table-scroll') return;
			parent.children[index] = {
				type: 'element',
				tagName: 'div',
				properties: { className: 'table-scroll', tabIndex: 0 },
				children: [node]
			};
		});
}

/** "> [!NOTE]" and "> [!WARNING]" blockquotes become callouts. */
function callouts() {
	return (tree) =>
		visit(tree, (node) => {
			if (node.tagName !== 'blockquote') return;
			const first = (node.children ?? []).find((child) => child.tagName === 'p');
			const lead = first?.children?.[0];
			if (!lead || lead.type !== 'text') return;
			const match = /^\s*\[!(NOTE|WARNING)\]\s*/.exec(lead.value);
			if (!match) return;
			lead.value = lead.value.slice(match[0].length);
			const kind = match[1].toLowerCase();
			node.tagName = 'aside';
			node.properties = { className: `callout callout-${kind}` };
			node.children.unshift({
				type: 'element',
				tagName: 'p',
				properties: { className: 'callout-title' },
				children: [{ type: 'text', value: kind === 'note' ? 'Note' : 'Warning' }]
			});
		});
}

export default {
	extensions: ['.md'],
	smartypants: false,
	highlight: { highlighter: highlight },
	rehypePlugins: [rehypeSlug, links, rawPaths, scrollableTables, callouts]
};
