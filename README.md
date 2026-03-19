# discord-mobile-status

Give a `discord.js` bot the mobile phone status badge by changing the gateway identify properties to `Discord iOS` or `Discord Android`.

## Install

```bash
npm install discord-mobile-status
```

## Usage

```js
const { Client, GatewayIntentBits } = require('discord.js');
const { enableMobileStatus } = require('discord-mobile-status');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

enableMobileStatus(client, { platform: 'ios' });

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
```

## Shortcut

If you do not need the client guard, you can patch the process-wide defaults directly:

```js
const patchMobileIdentifyProperties = require('discord-mobile-status');

patchMobileIdentifyProperties('android');
```

## API

### `enableMobileStatus(client, options?)`

Enables the mobile identify properties for a `discord.js` client. Call it before `client.login()`.

### `patchMobileIdentifyProperties(platform?)`

Patches `@discordjs/ws` defaults for the current Node.js process.

### `disableMobileStatus()`

Restores the default `@discordjs/ws` device and browser values.

### `getIdentifyProperties()`

Returns the current identify properties in use.

## Notes

- Supported platforms: `ios`, `android`
- This package targets `discord.js` v14
- The patch is process-wide because `discord.js` builds gateway connections from shared `@discordjs/ws` defaults
