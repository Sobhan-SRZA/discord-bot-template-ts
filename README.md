# Discord Bot Template (TypeScript) – User Guide & Documentation

**Template Name:** `discord-bot-template-ts`  
**Version:** `1.0.0`  
**Author:** Sobhan-SRZA (mr.sinre)  
**Developed for:** Persian Caesar  
**License:** BSD-3-Clause  
**GitHub:** [https://github.com/Sobhan-SRZA/discord-bot-template-ts](https://github.com/Sobhan-SRZA/discord-bot-template-ts)

---

## Overview

This is a **production-ready, modular, and extensible Discord bot template** written in **TypeScript** using **Discord.js v14**. It includes:

- Slash & Message command handling
- Event system
- Configurable database (JSON, MySQL, MongoDB, SQLite)
- Anti-crash protection
- Webhook logging
- Cooldown & permission system
- Global prototype extensions
- Built-in help command
- Invite link generator
- Status loop with dynamic variables
- Dashboard support (planned)

Perfect for developers who want a **clean, scalable foundation** to build powerful Discord bots.

---

## Table of Contents

- [Discord Bot Template (TypeScript) – User Guide \& Documentation](#discord-bot-template-typescript--user-guide--documentation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Tech Stack \& Dependencies](#tech-stack--dependencies)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Bot](#running-the-bot)
    - [Development (with rebuild)](#development-with-rebuild)
    - [Production (pre-built)](#production-pre-built)
  - [Folder Structure](#folder-structure)
  - [Creating Commands](#creating-commands)
    - [File: `src/commands/Member/ping.ts`](#file-srccommandsmemberpingts)
    - [Command Options](#command-options)
  - [Events](#events)
    - [File: `src/events/ready/ready.ts`](#file-srceventsreadyreadyts)
  - [Database Usage](#database-usage)
  - [Anti-Crash \& Logging](#anti-crash--logging)
  - [Global Extensions](#global-extensions)
  - [Status Loop](#status-loop)
  - [Dashboard (Optional)](#dashboard-optional)
  - [Deploying Commands](#deploying-commands)
  - [Troubleshooting](#troubleshooting)
  - [Credits \& License](#credits--license)
  - [Need Help?](#need-help)

---

## Prerequisites

- **Node.js** ≥ `v18.0.0`
- **TypeScript** ≥ `v5.0.0`
- **Discord Bot Token** (from [Discord Developer Portal](https://discord.com/developers/applications))
- **Git** (optional)

---

## Tech Stack & Dependencies

| Package / Technology | Version    | Description                                         |
| -------------------- | ---------- | --------------------------------------------------- |
| **Node.js**          | `≥18.0.0`  | JavaScript runtime                                  |
| **TypeScript**       | `^5.9.3`   | Typed superset of JavaScript                        |
| **discord.js**       | `^14.24.2` | Discord API wrapper                                 |
| **quick.db**         | `^9.1.7`   | Lightweight database (JSON, MySQL, MongoDB, SQLite) |
| **dotenv**           | `^16.6.1`  | Environment variable management                     |
| **colors**           | `^1.4.0`   | Console color output                                |
| **@types/node**      | `^22.19.0` | Type definitions for Node.js                        |

> Versions are pulled from `package.json` as of `v1.0.0`.

---

## Installation

```bash
git clone https://github.com/Sobhan-SRZA/discord-bot-template-ts.git
cd discord-bot-template-ts
npm install
```

> Rename `example.env` to `.env` and fill in the required values.

---

## Configuration

Edit the `.env` file:

```env
# Required
token='YOUR_BOT_TOKEN'
prefix='!'

# Database
database_type='json'  # json | mysql | mongodb | sql
database_mongoURL='mongodb+srv://...'
# MySQL fields if using mysql

# Status
status_loop_count='30000'
status_activity='["Watching {members} members", "Playing in {servers} servers"]'
status_type='["Watching", "Playing"]'
status_presence='["online", "idle"]'

# Support
support_id='YOUR_SUPPORT_SERVER_ID'
support_url='https://discord.gg/yourserver'
webhook_url='YOUR_WEBHOOK_URL'

# Features
anti_crash='true'
logger='true'
one_guild='false'
delete_commands='false'
dashboard='false'
dashboard_port='3000'
```

> See `example.env` for full list.

---

## Running the Bot

### Development (with rebuild)

```bash
npm run start:build
```

### Production (pre-built)

```bash
npm run build    # Compile TypeScript
npm run start    # Run from dist/
```

> Use `pm2` or `systemd` for production deployment.

---

## Folder Structure

```
src/
├── commands/          → All commands (slash & message)
│   └── Misc/help.ts
├── events/            → Event listeners
│   ├── command/
│   ├── message/
│   └── ready/
├── functions/         → Utility functions
├── handlers/          → Command & event loaders
├── models/            → Client & Database classes
├── storage/           → Embed styles, colors, emotes
├── types/             → TypeScript interfaces & globals
└── utils/             → Core utilities (cooldown, perms, etc.)
```

---

## Creating Commands

### File: `src/commands/Member/ping.ts`

```ts
import { CommandType } from "../../types/interfaces";
import { ApplicationCommandType, PermissionsBitField } from "discord.js";

export default {
  data: {
    name: "ping",
    description: "Shows bot latency",
    type: ApplicationCommandType.ChatInput,
    dm_permission: true
  },
  category: "member",
  aliases: ["latency"],
  cooldown: 5,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    const msg = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const latency = msg.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      content: `Pong! 🏓\n**Latency:** ${latency}ms\n**API:** ${client.ws.ping}ms`
    });
  }
} as CommandType;
```

### Command Options

| Field          | Description                    |
| -------------- | ------------------------------ |
| `only_slash`   | Only register as slash command |
| `only_message` | Only trigger via prefix        |
| `aliases`      | Message command aliases        |
| `cooldown`     | Per-user cooldown (seconds)    |
| `only_owner`   | Restrict to bot owners         |
| `category`     | Used in help command           |

---

## Events

### File: `src/events/ready/ready.ts`

```ts
export default async (client) => {
  console.log(`${client.user!.tag} is online!`);
};
```

Events are auto-loaded from `src/events/**`.

Supported event folders:
- `command/`
- `message/`
- `ready/`
- `guild/`
- etc.

---

## Database Usage

```ts
// Get value
const prefix = await client.db?.get("guilds:123456:prefix");

// Set value
await client.db?.set("user:123", { level: 5 });

// Add to counter
await client.db?.add("totalCommandsUsed", 1);
```

Supported drivers:
- `json` → `quickdb.json`
- `mysql`
- `mongodb`
- `sql` (SQLite)

---

## Anti-Crash & Logging

Enabled via `.env`:

```env
anti_crash='true'
logger='true'
webhook_url='https://...'
```

- Catches `unhandledRejection`, `uncaughtException`
- Sends errors to Discord webhook with stack trace
- Logs to console with colors

---

## Global Extensions

Added via `setupGlobalExtensions()`:

```ts
"hello world".toCapitalize(); // "Hello World"
"{name} is {age}".replaceValues({ name: "Ali", age: 20 });

[1,2,3,4].random(); // 3
[1,2,3,4].chunk(2); // [[1,2], [3,4]]

"#ff0000".HexToNumber(); // 16711680
"123".convertToPersianString(); // ۱۲۳
```

---

## Status Loop

Dynamic variables:
- `{members}` → Total users
- `{servers}` → Guild count
- `{usedCommands}` → Total commands used
- `{prefix}` → Bot prefix

```env
status_activity='["Watching {members} users"]'
status_type='["Watching"]'
status_presence='["online"]'
status_loop_count='30000'
```

---

## Dashboard (Optional)

Enable in `.env`:

```env
dashboard='true'
dashboard_port='3000'
```

> Currently a placeholder. Extend in future.

---

## Deploying Commands

Commands are **automatically deployed** on startup.

To delete all commands:

```env
delete_commands='true'
```

> Only use during development.

---

## Troubleshooting

| Issue                     | Solution                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `Token is invalid`        | Double-check `.env` token                                                           |
| `INTENTS are OFF`         | Enable **Privileged Intents** in [Developer Portal](https://discord.com/developers) |
| `Database not connecting` | Check MongoDB URL or MySQL credentials                                              |
| `Commands not loading`    | Ensure `only_slash` or `only_message` is `true`                                     |
| `Permission errors`       | Bot needs `Send Messages`, `Embed Links`, etc.                                      |

---

## Credits & License

**Coded by:** Sobhan-SRZA (mr.sinre)  
**Framework:** Persian Caesar  
**Support:** [https://dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)

```
BSD 3-Clause License
Copyright (c) 2025, Sobhan-SRZA
All rights reserved.
```

> You are free to use, modify, and distribute this template.  
> **Credit "Persian Caesar"** in your project if you use this code.

---

## Need Help?

- Open an issue on GitHub
- Join support server: [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)
- Contact: `mr.sinre` on Discord

---

**Start building your dream bot today!** 🚀

---

*This template is maintained and improved regularly. Star the repo to stay updated!* ⭐