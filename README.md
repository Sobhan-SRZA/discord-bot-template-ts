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
  - [Key Functions \& Utilities](#key-functions--utilities)
    - [From `src/functions/`](#from-srcfunctions)
    - [From `src/utils/`](#from-srcutils)
  - [Status Loop](#status-loop)
  - [Dashboard (Optional)](#dashboard-optional)
  - [Deploying Commands](#deploying-commands)
  - [Extending the Bot](#extending-the-bot)
  - [Troubleshooting](#troubleshooting)
  - [Best Practices](#best-practices)
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
├── functions/         → Utility functions (e.g., post, logger, sleep)
├── handlers/          → Command & event loaders
├── models/            → Client & Database classes
├── storage/           → Embed styles, colors, emotes
├── types/             → TypeScript interfaces & globals
└── utils/             → Core utilities (e.g., error handling, response helpers)
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

## Key Functions & Utilities

Below is a comprehensive list of the most important functions and utilities from the template (primarily from `src/functions/` and `src/utils/`). Each one includes a detailed explanation of its purpose, parameters, return value, how it works internally, potential use cases, and a code example. These functions form the core of the bot's modularity, error handling, and utility features. I've grouped them by folder for clarity.

### From `src/functions/`

1. **setupGlobalExtensions()**
   - **Description**: This function extends built-in JavaScript prototypes (String, Array) with custom methods for string manipulation, randomization, and chunking. It's called once at startup in `index.ts` to make these utilities globally available. This promotes cleaner code by avoiding repeated utility imports. Internally, it checks if the method already exists before adding it to prevent overrides. Use cases: String capitalization in command responses, random status selection, or splitting arrays for pagination in embeds.
   - **Parameters**: None.
   - **Returns**: `void` (modifies prototypes in place).
   - **Example**:
     ```ts
     import setupGlobalExtensions from "./src/functions/setupGlobalExtensions";

     // Call at startup
     setupGlobalExtensions();

     // Usage examples
     console.log("hello world".toCapitalize()); // Output: "Hello World"

     const status = "{servers} servers".replaceValues({ servers: 100 }); // Output: "100 servers"

     console.log("#ff0000".HexToNumber()); // Output: 16711680

     console.log("123 members".convertToPersianString()); // Output: "۱۲۳ members"

     const arr = [1, 2, 3, 4];
     console.log(arr.random()); // Output: Random number from array, e.g., 3
     console.log(arr.chunk(2)); // Output: [[1, 2], [3, 4]]
     ```

2. **post(data: any, name: string, color1?: Color, color2?: Color)**
   - **Description**: A colored console logging utility for displaying messages with customizable colors and prefixes. It handles strings, objects, booleans, and other types differently (e.g., JSON.stringify for objects). The `name` is used as a prefix (e.g., "S" for success). Colors are from the `colors` package. Internally, it constructs a log string with ANSI colors and handles multi-line data. Use cases: Logging bot startup, command loads, or errors in a visually distinct way.
   - **Parameters**:
     - `data`: The content to log (any type).
     - `name`: Prefix label (e.g., "S" for success, "E" for error).
     - `color1`: Color for the prefix (optional, default: "yellow").
     - `color2`: Color for the data (optional, default: "green").
   - **Returns**: `void` (logs to console).
   - **Example**:
     ```ts
     import post from "./src/functions/post";

     post("Bot is online!", "S", "green", "cyan"); // Logs: [S]〢┃  Bot is online! (with colors)

     post({ status: "ready" }, "I"); // Logs JSON object with default colors
     ```

3. **logger(data: any)**
   - **Description**: Similar to `post`, but specialized for green-themed logging with a fixed prefix ("[G]〢┃ Persian Caesar"). It handles multi-line strings, objects, and booleans. Internally, it's a wrapper around console.log with color application. Use cases: Logging bot stats or ready events in a consistent format.
   - **Parameters**:
     - `data`: The content to log (any type).
   - **Returns**: `void` (logs to console).
   - **Example**:
     ```ts
     import logger from "./src/functions/logger";

     logger("Bot stats: 10 guilds"); // Logs: [G]〢┃  Persian Caesar 〢 Bot stats: 10 guilds (in green)
     ```

4. **sleep(ms: number)**
   - **Description**: A simple async delay function using `setTimeout`. It wraps the timeout in a Promise for awaitable usage. Internally, it catches errors but rarely throws. Use cases: Delaying responses in commands or retry logic.
   - **Parameters**:
     - `ms`: Delay in milliseconds.
   - **Returns**: `Promise<void>`.
   - **Example**:
     ```ts
     import sleep from "./src/functions/sleep";

     async function delayedLog() {
       console.log("Start");
       await sleep(2000); // Wait 2 seconds
       console.log("End");
     }
     delayedLog();
     ```

5. **strToMs(input: string)**
   - **Description**: Converts a time string (e.g., "1h") to milliseconds. It uses regex to parse value and unit (s/m/h/d). Returns null on invalid input. Internally, it matches and switches on the unit for multiplication. Use cases: Parsing cooldowns or timeouts from config.
   - **Parameters**:
     - `input`: Time string (e.g., "30s").
   - **Returns**: `number | null` (milliseconds or null).
   - **Example**:
     ```ts
     import strToMs from "./src/functions/strToMs";

     console.log(strToMs("1h")); // Output: 3600000
     console.log(strToMs("invalid")); // Output: null
     ```

6. **getLinkResponse(apiKey: keyof typeof config.api | string, endpoint?: string)**
   - **Description**: Fetches data from a URL or configured API endpoint using `fetch`. It handles API keys from config and appends endpoints. Internally, it checks if the input is a config key, fetches JSON, and catches errors. Use cases: Integrating external APIs for commands like weather or quotes.
   - **Parameters**:
     - `apiKey or url`: Config API key or direct URL.
     - `endpoint`: Optional path to append.
   - **Returns**: `Promise<any>` (JSON data).
   - **Example**:
     ```ts
     import getLinkResponse from "./src/functions/getLinkResponse";

     async function fetchData() {
       const data = await getLinkResponse("example", "/test"); // Uses config.api.example.url + "/test"
       console.log(data);
     }
     fetchData();
     ```

7. **Functions from `functions.ts`** (Helper utilities for interactions):
   - **isBaseInteraction(obj: Respondable)**: Checks if obj is a BaseInteraction. Returns boolean.
   - **isMessage(obj: Respondable)**: Checks if obj is a Message. Returns boolean.
   - **getOption<T>(interaction: Respondable, method: string, optionName?: string, fallbackIndex?: number, args?: string[])**: Retrieves options from interactions or falls back to args. Generic for type safety.
   - **getChannel(interaction: Respondable, optionName?: string, fallbackIndex?: number, args?: string[])**: Gets a channel from interaction or args.
   - **getUser(interaction: Respondable, user: User | string)**: Resolves a User from ID or object.
   - **getMember(interaction: Respondable, user: GuildMember | string)**: Resolves a GuildMember from ID or object.
   - **filterMembers(guild: Guild, doFor: string, issuer: GuildMember, botMember: GuildMember)**: Filters members based on "everyone", "bots", or humans, checking manageability.
   - **canManage(target: GuildMember, issuer: GuildMember, botMember: GuildMember)**: Checks if issuer and bot can manage the target based on role positions.
   - **Example (for getOption)**:
     ```ts
     import { getOption } from "./src/functions/functions";

     // In a command run function
     const userId = getOption<string>(interaction, "getString", "user", 0, args); // Gets string option or from args
     ```

### From `src/utils/`

1. **checkCmdCooldown(interaction: CommandInteraction | Message, command: CommandType, prefix?: string, args?: string[] | null)**
   - **Description**: Manages per-user command cooldowns using a Collection. It calculates remaining time and replies with an ephemeral embed if on cooldown. Internally, it uses timestamps and setTimeout for cleanup. Use cases: Preventing spam in commands.
   - **Parameters**:
     - `interaction`: CommandInteraction or Message.
     - `command`: The command object.
     - `prefix`: Optional prefix for mention.
     - `args`: Optional args for subcommands.
   - **Returns**: `Promise<boolean | void>` (true if on cooldown).
   - **Example**:
     ```ts
     import checkCmdCooldown from "./src/utils/checkCmdCooldown";

     if (await checkCmdCooldown(interaction, command)) return; // Skip if on cooldown
     ```

2. **checkCmdPerms(interaction: CommandInteraction | Message, command: CommandType, prefix?: string, args?: string[] | null)**
   - **Description**: Verifies bot and member permissions for the command, including subcommands. Replies with an embed if missing perms. Internally, it resolves subcommands and checks PermissionsBitField. Use cases: Ensuring commands like ban require proper perms.
   - **Parameters**: Similar to checkCmdCooldown.
   - **Returns**: `Promise<boolean | void>` (true if perms missing).
   - **Example**:
     ```ts
     import checkCmdPerms from "./src/utils/checkCmdPerms";

     if (await checkCmdPerms(interaction, command)) return; // Skip if perms missing
     ```

3. **database()** (exported as default from `src/utils/database.ts`)
   - **Description**: Initializes and returns a QuickDB instance based on config (JSON, MySQL, etc.). It connects drivers asynchronously and logs success. Use cases: Setting up persistent storage.
   - **Parameters**: None.
   - **Returns**: `Promise<QuickDB>`.
   - **Example**:
     ```ts
     import loadDB from "./src/utils/database";

     const db = await loadDB();
     await db.set("key", "value");
     ```

4. **error(err: unknown)**
   - **Description**: Handles errors by logging to console or sending to a webhook with an embed or attachment if stack is long. It formats timestamps and optional codes. Use cases: Global error catching.
   - **Parameters**:
     - `err`: The error object.
   - **Returns**: `void`.
   - **Example**:
     ```ts
     import error from "./src/utils/error";

     try { /* code */ } catch (e) { error(e); }
     ```

5. **getAuthor(interaction: CommandInteraction | Message)**
   - **Description**: Extracts the user/author from an interaction or message. Use cases: Setting embed footers.
   - **Parameters**:
     - `interaction`: CommandInteraction or Message.
   - **Returns**: `User | undefined`.
   - **Example**:
     ```ts
     import getAuthor from "./src/utils/getAuthor";

     const user = getAuthor(interaction);
     ```

6. **GetInvite(guild: Guild)**
   - **Description**: Generates or fetches an invite link for the guild, preferring existing ones or creating in specific channels. Use cases: Sharing guild invites.
   - **Parameters**:
     - `guild`: The Guild object.
   - **Returns**: `Promise<Invite | null>`.
   - **Example**:
     ```ts
     import GetInvite from "./src/utils/GetInvite";

     const invite = await GetInvite(guild);
     ```

7. **repeatAction<T>(action: () => Promise<T>, maxAttempts = 3, delayMs = 3000)**
   - **Description**: Retries an async action up to maxAttempts with delays. Use cases: Reliable deferReply or edits.
   - **Parameters**:
     - `action`: The async function.
     - `maxAttempts`: Retry count.
     - `delayMs`: Delay between retries.
   - **Returns**: `Promise<T | undefined>`.
   - **Example**:
     ```ts
     import repeatAction from "./src/utils/repeatAction";

     await repeatAction(() => interaction.deferReply());
     ```

8. **response(interaction: Respondable, data: InteractionReplyOptions | MessageReplyOptions)**
   - **Description**: Sends a reply to an interaction or message, using repeatAction for reliability. Use cases: Unified replying.
   - **Parameters**:
     - `interaction`: Respondable (Interaction or Message).
     - `data`: Reply options.
   - **Returns**: `Promise<void>`.
   - **Example**:
     ```ts
     import response from "./src/utils/response";

     await response(interaction, { content: "Hello!" });
     ```

9. **responseDelete(interaction: Respondable, message?: Message | null)**
   - **Description**: Deletes a reply or message using repeatAction. Use cases: Cleaning up temporary messages.
   - **Parameters**:
     - `interaction`: Respondable.
     - `message`: Optional message to delete.
   - **Returns**: `Promise<void>`.
   - **Example**:
     ```ts
     import responseDelete from "./src/utils/responseDelete";

     await responseDelete(interaction);
     ```

10. **responseEdit(message: Message, data: MessageEditOptions)**
    - **Description**: Edits a message using repeatAction. Use cases: Updating command outputs.
    - **Parameters**:
      - `message`: The Message to edit.
      - `data`: Edit options.
    - **Returns**: `Promise<void>`.
    - **Example**:
      ```ts
      import responseEdit from "./src/utils/responseEdit";

      await responseEdit(message, { content: "Updated!" });
      ```

11. **responseError(interaction: Respondable, log?: string, data?: InteractionReplyOptions | MessageReplyOptions, isUpdateNeed?: boolean, message?: Message)**
    - **Description**: Sends or edits an error response with a default embed. Supports ephemeral and updates. Use cases: Graceful error handling in commands.
    - **Parameters**:
      - `interaction`: Respondable.
      - `log`: Error description.
      - `data`: Custom options.
      - `isUpdateNeed`: If true, edits instead of replies.
      - `message`: Message to edit if needed.
    - **Returns**: `Promise<void>`.
    - **Example**:
      ```ts
      import responseError from "./src/utils/responseError";

      await responseError(interaction, "Invalid input");
      ```

12. **SendGuildAlert({ client, guild, guildChannel?, isWebhook?, description?, isLeaved? }: SendGuildAlert)**
    - **Description**: Sends a guild join/leave alert to a channel or webhook with an embed. Fetches owner and invite. Use cases: Logging guild events.
    - **Parameters**: Object with client, guild, etc.
    - **Returns**: `Promise<void>`.
    - **Example**:
      ```ts
      import SendGuildAlert from "./src/utils/SendGuildAlert";

      await SendGuildAlert({ client, guild, isWebhook: true });
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

## Extending the Bot

- **Adding APIs**: Use `getLinkResponse` in commands for external data.
- **Custom Events**: Create files in `src/events/` subfolders (e.g., `guild/guildCreate.ts`).
- **Database Schemas**: Use dot notation in keys (e.g., "guilds.123.prefix") for organization.
- **Error Handling**: Wrap code in try-catch and call `error(e)`.

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

## Best Practices

- Use `repeatAction` for Discord API calls to handle rate limits.
- Always check cooldowns and perms before command logic.
- Test database connections early in development.
- Credit the original authors when forking.

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