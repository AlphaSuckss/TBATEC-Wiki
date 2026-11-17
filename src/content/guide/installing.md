---
title: "Installing TBATEC"
nav_title: "Installing"
description: "What TBATEC needs, what it works with, and how to set it up on a client or a server."
order: 1
---

TBATEC is a mod for **Minecraft 1.21.1** on **NeoForge**. It must be installed on both the server and every player's game.

## What you need

| Mod | Version | |
| --- | --- | --- |
| [NeoForge](https://neoforged.net/) | 21.1.209 or newer | Required |
| [GeckoLib](https://www.curseforge.com/minecraft/mc-mods/geckolib) | 4.9.3 or newer | Required: the models and animations of beasts, people and armour |
| [Curios API](https://www.curseforge.com/minecraft/mc-mods/curios) | 9.2.0 or newer | Required: rings, necklaces, bracelets, gauntlets, cloaks and charms are worn in Curios slots |
| [AttributeFix](https://www.curseforge.com/minecraft/mc-mods/attributefix) | 21.1.1 or newer | Required: the strongest bodies and weapons go past the game's attribute caps. It needs [Bookshelf](https://www.curseforge.com/minecraft/mc-mods/bookshelf) and [Prickle](https://www.curseforge.com/minecraft/mc-mods/prickle) |
| [Patchouli](https://www.curseforge.com/minecraft/mc-mods/patchouli) | any | Optional: the in-game guidebook, The Mage's Codex |
| [JEI](https://www.curseforge.com/minecraft/mc-mods/jei) | 19 or newer | Optional: recipes and beast information |
| [Jade](https://www.curseforge.com/minecraft/mc-mods/jade) | 15 or newer | Optional: what you look at |

## Setting it up

1. Install NeoForge for Minecraft 1.21.1 (a launcher such as CurseForge or Prism does this for you).
2. Put TBATEC and the required mods above into the `mods` folder.
3. Start the game and make a **new world**. TBATEC adds its own lands (the kingdoms of Dicathen, the Beast Glades, the realm of Epheotus, the continent of Alacrya and the Relictombs); worlds made without it have none of them.
4. When you join, the heritage menu opens. [Your First Day](/first_steps/first_day) takes it from there.

> [!NOTE]
> A world first made with an older TBATEC keeps working: places that already stand keep their old shape, and new land is made with the new version.

## Servers

The same mods go on the server. Every setting is in the `config` folder and is described in [Server Settings](/first_steps/settings); the admin commands are in [Commands](/first_steps/commands).

## Other mods

- **Epic Fight** or **Better Combat**: TBATEC turns its own player animations off when Epic Fight is installed.
- **Shader packs**: TBATEC works with them. Campfire smoke only rises within 32 blocks of you (`effects.campfireSmokeReach` in the client settings), which keeps big towns smooth.
