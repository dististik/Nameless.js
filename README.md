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
Nameless currently runs in a very specific environment due to being fine tuned for the Nisemon League Discord server. Before recreating her run environment, you'll need the following:
+ [Node.js](https://nodejs.org/) version 12.0.0 or higher
+ A Discord application via the [developer portal](https://discord.com/developers) with a bot account attached

After cloning her repository, run `npm install` in her source directory to download all of her node dependencies. Before you can run Nameless, you will need to add your bot (created above) to a test server of your own and give her a `config.json`. Currently, Nameless' config file looks like the following:

```json
{
	"token": "BOT TOKEN HERE",
	"prefix" : "COMMAND PREFIX HERE"
}
```

`token` should be set to your own bot's token from your application's bot tab and `prefix` should be set to whichever character(s) you would like to precede all of your commands -- for example `!hello`'s prefix is `"!"`.

As of now you should be able to run most of Nameless' basic commands, however to fully replicate her run environment (and by extension use her more involved commands) you will need to provide alternatives to all of the IDs in `templates/discord_ids.json` and place your version of the file in the `src/json` subdirectory. These IDs are obtained by turning on Discord's developer mode under "Appearance" in your settings and right click the roles, channels, server(s)/guild(s), and users you're using as replacements in your own server.

Now by running `node index.js` in her source directory you should have full access to a copy of Nameless. If this is for development purposes, a batch file ending with a `pause` command is recommended in Windows environments as not all of Nameless' errors are handled yet.

## Notable dependencies
+ [discordjs/discord.js](https://github.com/discordjs/discord.js)
