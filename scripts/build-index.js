// Reads every page under src/content and writes:
//   src/lib/pages.js   - each page's title, sidebar title, description, order, icon and headings (no page text, so the
//                        sidebar stays small);
//   static/search.json - each page's words for the search box, fetched only when someone searches.
// Runs before `npm run dev` and `npm run build`.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import GithubSlugger from 'github-slugger';

const CONTENT = 'src/content';

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
	});
}

function frontmatter(source) {
	const match = /^---\n([\s\S]*?)\n---\n?/.exec(source);
	const data = {};
	if (!match) return { data, body: source };
	for (const line of match[1].split('\n')) {
		const pair = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
		if (pair) data[pair[1]] = pair[2].replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	}
	return { data, body: source.slice(match[0].length) };
}

const unescape = (s) =>
	s
		.replace(/<[^>]+>/g, '')
		.replace(/&#123;/g, '{')
		.replace(/&#125;/g, '}')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\\([*_`[\]\\])/g, '$1');

function headings(body) {
	const slugger = new GithubSlugger();
	const out = [];
	let fenced = false;
	for (const line of body.split('\n')) {
		if (line.startsWith('```')) fenced = !fenced;
		if (fenced) continue;
		const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
		if (!match) continue;
		const label = unescape(match[2].replace(/`/g, ''));
		out.push({ depth: match[1].length, label, id: slugger.slug(label) });
	}
	return out;
}

function words(body) {
	return unescape(body.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' '))
		.replace(/\]\([^)]*\)/g, ' ')
		.replace(/[*_`#>[\]|]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

const pages = [];
const search = [];
for (const file of walk(CONTENT).sort()) {
	const path = relative(CONTENT, file).replace(/\\/g, '/').replace(/\.md$/, '');
	const slug = path === 'index' ? '' : path.replace(/\/index$/, '');
	const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
	const { data, body } = frontmatter(readFileSync(file, 'utf8'));
	const title = data.title ?? slug;
	pages.push({
		file: '/' + file.replace(/\\/g, '/'),
		slug,
		dir,
		title,
		navTitle: data.nav_title ?? title,
		description: data.description ?? '',
		order: Number(data.order ?? 100),
		icon: data.icon ?? ''
	});
	search.push({ s: slug, t: title, d: data.description ?? '', h: headings(body).map((h) => h.label).join(' · '), w: words(body) });
}

writeFileSync('src/lib/pages.js', '// Written by scripts/build-index.js from src/content: do not edit.\nexport const allPages = ' + JSON.stringify(pages) + ';\n');
mkdirSync('static', { recursive: true });
writeFileSync('static/search.json', JSON.stringify(search));
console.log(`indexed ${pages.length} pages`);
