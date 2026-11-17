<script>
	import '../app.css';

	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Search from '$lib/components/Search.svelte';
	import { site } from '$lib/site.js';

	let { children } = $props();
	let menuOpen = $state(false);
	let dark = $state(false);

	const current = $derived((page.params.slug ?? '').replace(/\/$/, ''));

	function readTheme() {
		const set = document.documentElement.dataset.theme;
		dark = set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function toggleTheme() {
		dark = !dark;
		document.documentElement.dataset.theme = dark ? 'dark' : 'light';
		try {
			localStorage.setItem('tbatec-theme', dark ? 'dark' : 'light');
		} catch (e) {}
	}

	/** Adds a Copy button to every code block on the page. */
	function addCopyButtons() {
		for (const pre of document.querySelectorAll('.prose pre')) {
			if (pre.parentElement.classList.contains('code-block')) continue;
			const wrap = document.createElement('div');
			wrap.className = 'code-block';
			pre.replaceWith(wrap);
			wrap.append(pre);
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'copy';
			button.textContent = 'Copy';
			button.addEventListener('click', async () => {
				await navigator.clipboard.writeText(pre.textContent);
				button.textContent = 'Copied';
				setTimeout(() => (button.textContent = 'Copy'), 1500);
			});
			wrap.append(button);
		}
	}

	afterNavigate(() => {
		menuOpen = false;
		readTheme();
		addCopyButtons();
	});
</script>

<header class="navbar">
	<button class="icon-button menu-button" type="button" aria-label="Pages" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}>
		<svg viewBox="0 0 30 30" aria-hidden="true"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4 7h22M4 15h22M4 23h22" /></svg>
	</button>
	<a class="brand" href="{base}/">
		<img src="{base}/icon.png" alt="" width="28" height="28" />
		<span class="brand-name">TBATEC</span>
		<span>Wiki</span>
	</a>
	<Search />
	<a class="navbar-link" href={site.docsRepo} target="_blank" rel="noopener">GitHub</a>
	<button class="icon-button" type="button" aria-label={dark ? 'Switch to the light theme' : 'Switch to the dark theme'} onclick={toggleTheme}>
		<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2v16a8 8 0 0 1 0-16Z" /></svg>
	</button>
</header>

<div class="frame">
	<aside class="sidebar" class:open={menuOpen}>
		<Nav {current} />
	</aside>
	{@render children()}
</div>

<footer class="site-footer">
	TBATEC is made by AlphaSucks. It is a fan work based on <em>The Beginning After the End</em> by TurtleMe, and is not
	affiliated with TurtleMe or Tapas.
</footer>
