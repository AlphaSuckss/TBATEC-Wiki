<script>
	import { base } from '$app/paths';
	import { nav, href } from '$lib/docs.js';

	let { current } = $props();

	// A chapter opens when one of its pages is shown; the reader can open and close the others.
	const here = $derived(current.includes('/') ? current.slice(0, current.indexOf('/')) : current);
	let opened = $state({});
	const isOpen = (dir) => dir === '' || dir === 'guide' || opened[dir] || here === dir;
</script>

<nav aria-label="Pages">
	{#each nav as section}
		{#if section.dir === '' || section.dir === 'guide'}
			<p class="nav-label">{section.label}</p>
			<ul class="nav-list">
				{#each section.pages as page}
					<li><a href={href(base, page)} aria-current={page.slug === current ? 'page' : undefined}>{page.navTitle}</a></li>
				{/each}
			</ul>
		{:else}
			<details class="nav-chapter" open={isOpen(section.dir)} ontoggle={(e) => (opened[section.dir] = e.currentTarget.open)}>
				<summary>
					{#if section.icon}<img class="icon" src="{base}{section.icon}" alt="" />{/if}
					<span>{section.label}</span>
				</summary>
				<ul class="nav-list">
					{#each section.pages as page}
						<li><a href={href(base, page)} aria-current={page.slug === current ? 'page' : undefined}>{page.navTitle}</a></li>
					{/each}
				</ul>
			</details>
		{/if}
	{/each}
</nav>
