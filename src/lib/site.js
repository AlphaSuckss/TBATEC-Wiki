import { chapters } from './chapters.js';

export const site = {
	name: 'TBATEC',
	title: 'TBATEC Wiki',
	description: 'The wiki for TBATEC, a NeoForge 1.21.1 mod of The Beginning After the End: mana cores, spellcraft, mana beasts, Dicathen, Epheotus, Alacrya and the Relictombs.',
	/** This site's repository and where its Markdown lives, for "Edit this page" links. */
	docsRepo: 'https://github.com/AlphaSuckss/TBATEC-Wiki',
	contentPath: 'src/content'
};

/**
 * Sidebar sections, in order. `dir` is the folder under src/content ('' is the top level). The chapters come from the
 * in-game Codex (chapters.js is written by the TBATEC tools' wiki_export.py).
 */
export const sections = [{ dir: '', label: 'Start here', icon: '' }, { dir: 'guide', label: 'Guides', icon: '' }, ...chapters];
