<script>
	import { base } from '$app/paths';
	import { href } from '$lib/docs.js';
	import { site } from '$lib/site.js';

	import { afterNavigate } from '$app/navigation';

	let { data } = $props();

	// The page's h2 and h3 headings, read from the page once it is shown (their ids come from rehype-slug).
	let headings = $state([]);
	afterNavigate(() => {
		headings = [...document.querySelectorAll('.prose h2[id], .prose h3[id]')].map((h) => ({
			depth: Number(h.tagName[1]),
			id: h.id,
			label: h.textContent.trim()
		}));
	});

	const doc = $derived(data.page);
	const Content = $derived(data.content);
	const generated = $derived(doc.dir !== '' && doc.dir !== 'guide');
	const editUrl = $derived(`${site.docsRepo}/edit/main/${site.contentPath}${doc.file.replace('/src/content', '')}`);
</script>

<svelte:head>
	<title>{doc.slug ? `${doc.title} | ${site.title}` : site.title}</title>
	<meta name="description" content={doc.description || site.description} />
</svelte:head>

<div class="main">
	<article>
		<ol class="breadcrumbs" aria-label="Breadcrumbs">
			<li>
				<a href="{base}/" aria-label="Home">
					<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" /></svg>
				</a>
			</li>
			{#if doc.slug}
				<li><span>{data.section}</span></li>
				<li><span aria-current="page">{doc.navTitle}</span></li>
			{/if}
		</ol>

		{#if headings.length > 1}
			<details class="toc-inline">
				<summary>On this page</summary>
				<ul>
					{#each headings as heading}
						<li class="depth-{heading.depth}"><a href="#{heading.id}">{heading.label}</a></li>
					{/each}
				</ul>
			</details>
		{/if}

		<h1>{#if doc.icon}<img class="icon title-icon" src="{base}{doc.icon}" alt="" />{/if}{doc.title}</h1>

		<div class="prose">
			<Content />
		</div>

		<footer class="page-foot">
			{#if generated}
				<p class="edit">This page is the same as its chapter in The Mage's Codex, the mod's in-game guidebook.</p>
			{:else}
				<p class="edit"><a href={editUrl} target="_blank" rel="noopener">Edit this page</a></p>
			{/if}
			<div class="pager">
				{#if data.previous}
					<a href={href(base, data.previous)}><small>Previous</small>{data.previous.navTitle}</a>
				{/if}
				{#if data.next}
					<a class="next" href={href(base, data.next)}><small>Next</small>{data.next.navTitle}</a>
				{/if}
			</div>
		</footer>
	</article>

	{#if headings.length > 1}
		<aside class="toc" aria-label="On this page">
			<ul>
				{#each headings as heading}
					<li class="depth-{heading.depth}"><a href="#{heading.id}">{heading.label}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>
