# Nameless.js
Nameless is a Discord bot designed specifically to help the [Nisemon League](https://discord.gg/kvWncZx) Discord community. Since she is specifically designed for that online community, much of her code is specialised for it. However, in case anyone else would happen to want to use the (admittedly very sloppy) work done for her in their own project, we're more than happy to share.

### Table of Contents
+ [Nameless rewrite](#nameless-rewrite)
+ [Contributing](#contributing)
+ [Installing](#installing)
+ [Notable dependencies](#notable-dependencies)

## Nameless rewrite
Currently, Nameless is in the process of rewriting her extremely messy code into something both easier to maintain and more efficient. Any progress being made on that front will be kept track of in [this branch](https://github.com/dististik/Nameless.js/tree/rewrite) and is the go-to for helping port her over to her more efficient model. `master` is only for the version currently running, at the moment; `rewrite` will merge with it once all of her current features are finished being ported over.

## Contributing
While it is likely currently out of date, see the [contributing markdown](https://github.com/dististik/Nameless.js/blob/master/CONTRIBUTING.md) for this project.

## Installing
Nameless runs on [Node.js](https://nodejs.org/en/) using the Discord API library, [Discord.js](https://github.com/discordjs/discord.js). As such a local install of Node, version 6.0.0 or higher, is required to run her on any machine she's installed on. Instead of clogging up the repo with them, all of her current dependencies are only included in her [release files](https://github.com/dististik/Nameless.js/releases) which are kept in for ease of launch using the included batch file. 

Notably, a `config.json` is not included in any of Nameless' releases. In order for her to run, you will either need a config file provided to you in the event that you're trusted to run a backup of her, or need to create your own using the token of your own Discord bot application. For the current running build of Nameless, her config file should look like this:

```json
{
	"token" : "DISCORD BOT TOKEN"
}
```

Once you have both Node, version 6.0.0 or higher, and a config file in the same directory as the `index.js` file, launching the provided batch file or running `node index.js` in the same directory as the `index.js` file should bring her online.

## Notable dependencies
+ [discordjs/discord.js](https://github.com/discordjs/discord.js)
