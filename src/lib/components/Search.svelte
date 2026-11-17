<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { sections } from '$lib/site.js';

	let query = $state('');
	let index = $state(null);
	let active = $state(0);
	let focused = $state(false);
	let input;

	const sectionOf = (slug) => {
		const dir = slug.includes('/') ? slug.slice(0, slug.indexOf('/')) : slug;
		return sections.find((s) => s.dir === dir)?.label ?? '';
	};

	async function load() {
		if (index) return;
		const res = await fetch(`${base}/search.json`);
		index = (await res.json()).map((p) => ({ ...p, lt: p.t.toLowerCase(), lh: p.h.toLowerCase(), lw: p.w.toLowerCase() }));
	}

	/** Every word must appear; a word in the title counts most, then headings, then the description, then the text. */
	const results = $derived.by(() => {
		const words = query.toLowerCase().split(/\s+/).filter(Boolean);
		if (!index || !words.length) return [];
		const out = [];
		for (const p of index) {
			let score = 0;
			let ok = true;
			for (const w of words) {
				const s = (p.lt.includes(w) ? 10 : 0) + (p.lh.includes(w) ? 4 : 0) + (p.d.toLowerCase().includes(w) ? 2 : 0) + (p.lw.includes(w) ? 1 : 0);
				if (!s) {
					ok = false;
					break;
				}
				score += s + (p.lt.startsWith(w) ? 5 : 0);
			}
			if (ok) out.push({ p, score });
		}
		return out.sort((a, b) => b.score - a.score || a.p.t.localeCompare(b.p.t)).slice(0, 12);
	});

	function snippet(p) {
		const w = query.toLowerCase().split(/\s+/).filter(Boolean)[0] ?? '';
		const i = p.lw.indexOf(w);
		if (i < 0 || p.lt.includes(w)) return p.d;
		const start = Math.max(0, i - 50);
		return (start ? '…' : '') + p.w.slice(start, i + 90) + '…';
	}

	function open(p) {
		query = '';
		input?.blur();
		goto(`${base}/${p.s ? p.s + '/' : ''}`);
	}

	function keydown(e) {
		if (e.key === 'ArrowDown') {
			active = Math.min(active + 1, results.length - 1);
			e.preventDefault();
		} else if (e.key === 'ArrowUp') {
			active = Math.max(active - 1, 0);
			e.preventDefault();
		} else if (e.key === 'Enter' && results[active]) {
			open(results[active].p);
		} else if (e.key === 'Escape') {
			query = '';
			input?.blur();
		}
	}

	function globalKey(e) {
		if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
			e.preventDefault();
			input?.focus();
		}
	}
</script>

<svelte:window onkeydown={globalKey} />

<div class="search">
	<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.42 1.4-5.39-5.38A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" /></svg>
	<input
		bind:this={input}
		bind:value={query}
		type="search"
		placeholder="Search the wiki"
		aria-label="Search the wiki"
		onfocus={() => {
			focused = true;
			load();
		}}
		onblur={() => setTimeout(() => (focused = false), 150)}
		oninput={() => (active = 0)}
		onkeydown={keydown}
	/>
	<kbd class="hint">/</kbd>
	{#if focused && query.trim()}
		<ul class="results" role="listbox">
			{#each results as r, i}
				<li role="option" aria-selected={i === active}>
					<button type="button" class:active={i === active} onmousedown={() => open(r.p)}>
						<strong>{r.p.t}</strong>
						<small class="where">{sectionOf(r.p.s)}</small>
						<small>{snippet(r.p)}</small>
					</button>
				</li>
			{:else}
				<li class="none">{index ? 'Nothing found.' : 'Loading…'}</li>
			{/each}
		</ul>
	{/if}
</div>
