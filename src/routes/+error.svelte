<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head><title>Page not found | TBATEC Wiki</title></svelte:head>

<div class="not-found">
	<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p>{page.status === 404 ? 'There is no page at this address.' : page.error?.message}</p>
	<p><a href="{base}/">Go to the introduction</a></p>
</div>
