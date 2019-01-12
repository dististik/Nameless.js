# Contributing to Nameless.js

Thanks for considering contributing to our project here! In order to make sure everyone is on the same page and to keep contributions helpful for everyone lending a hand, there are a few guidelines to follow. Before anything, please have a basic understanding of JavaScript, have the most up-to-date version of Node.js installed, and consider joining our [Discord server](https://discord.gg/kvWncZx) to keep in contact with other contributors.

## Table of contents

[Beginner Resources](#beginner-resources)
* [Developer tools](#developer-tools)
* [Reading list](#reading-list)
* [Understanding Discord bots](#understanding-discord-bots)

[Guidelines to Follow](#guidelines-to-follow)
* [Where to Start](#where-to-start)
* [Opening issues](#opening-issues)
* [Dos and don'ts](#dos-and-donts)
* [Nameless code conventions](#nameless-code-conventions)

# Beginner Resources

Below are a few links and things to note for those new to contributing to open source projects or may even be new to developing in general. If you have no programming experience at all, we recommend taking the time to understand web languages on your own as our Discord server is not one for a programming-centred community. A good resource for this is [w3schools](https://www.w3schools.com/).

## Developer tools

This is the list of tools necessary for contributing to Nameless.

* [Node.js](https://nodejs.org/en/) - Node.js is a runtime environment that allows you to run JavaScript outside of a browser while packaging in a few other neat tools we can use to fully utilize the environment.
* [Discord.js](https://discord.js.org/#/) - Discord.js is a Discord API library that utilizes Node in order to make use of every single part of the Discord API. If a user can do it, Nameless can too with help from this library.
* [Sublime Text](https://www.sublimetext.com/) - Alternatively, literally any other source code editor. Other good ones include [Komodo Edit](https://www.activestate.com/products/komodo-edit/), [Atom](https://atom.io/), [Visual Studio Code](https://code.visualstudio.com/), and [Brackets](http://brackets.io/). 

While it is possible to run Discord.js on Node.js versions as old as 6.0.0, we ask that you please be fully up-to-date for contributing to this project.

## Reading list

This is a list of resources to refer to if anything goes wrong so you can try to understand the issue better before asking others for help if necessary.

* [Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
* [MDN JavaScript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Node.js documentation](https://nodejs.org/en/docs/)
* [w3schools JavaScript reference](https://www.w3schools.com/jsref/default.asp)

## Understanding Discord bots

Obviously, we can't give access to Nameless to just anyone who wants to contribute. As such, it's important that you understand Discord bots so that you can test your contributions on your own. To get started, navigate to the [Discord developer portal](https://discordapp.com/developers) and create a new application. After filling everything out, just click the "Bot" tab on the left and add a bot! From there you can add it to a test server by using the below link but replacing `<client id>` with the client ID that Discord provided you. If you want to dive more into the subject, you can read Discord's [API documentation](https://discordapp.com/developers/docs/intro).

```
https://discordapp.com/oauth2/authorize?client_id=<client id>&scope=bot
```

# Guidelines to Follow

Below are a list of guidelines we ask you to follow for contributing to Nameless.js.

## Where to start

A great place to start adding to Nameless is by checking and seeing if there are any open [quests](https://github.com/dististik/Nameless.js/labels/quest)! Quests are goals set by primary contributors that are typically steps to take in order to add a large bit of functionality to Nameless. We ask that you check these first before creating pull requests to solve things other than quests to avoid conflicts.

## Opening issues

Opening issues is a great way to point out problems or provide meaningful suggestions. However, before opening an issue, please make sure your issue doesn't fit into any of the below criteria.

* __Is your issue a question about how Nameless works?__ - If so, do not open an issue. You're free to ask any of the developers on Discord whenever they're online or you can check the above provided documentations to figure out how Nameless does what she does. Issues are not our FAQ centre.
* __Is your issue a suggestion that does not add major functionality?__ - If so, do not open an issue. Suggestions that don't add major functionality include fun or "Easter egg" commands, changing variable or function names, code cosmetic changes (such as changing whitespace), or changes that would improve efficiency.
* __Is your issue already being focused on in a quest?__ - If so, do not open an issue. If your issue is encompassed by a quest in any way, that means we will likely hit and solve it in the process. If we don't after the quest is marked as solved, feel free to point it out to us.
* __Is your issue irrelevant to what Nameless aims to do?__ - If so, do not open an issue. Please keep in mind that Nameless is a private bot made specifically for the Nisemon League and as such your issues should aim to make her help our community better.

If you've avoided all of the above pitfalls with your issue, feel free to open it!

## Dos and don'ts

When creating pull requests, to help your contributions be easily understandable it's important to keep the following in mind:

__DO:__
* Describe what you changed in a brief summery at the beginning of your pull request
* Thoroughly describe what your contribution does
* Explain why your code is a better alternative to existing code
* Explain the verification you did to make sure your code does what you described

__DON'T:__
* Fail to include any of the above
* Contribute any code that you haven't thoroughly tested
* Contribute any code that doesn't follow our current conventions

## Nameless code conventions

There are a few conventions that the public version of Nameless.js's code follows to make sure it's readable for anyone wanting to use it as a starting ground for their own projects or new to contributing to the project. They include:

* __All indentations need to be tabs__ - Tabs are a billion times easier to manage in text editors than spaces
* __Replace all plain IDs with a string describing what they are__ - `'nisemon league id'` means a lot more to a reader than `'207392567925538817'`
* __Temp commands start with `?`, full commands start with `!`__ - This is to keep everything in line with what people are used to
* __Add `$` to variables to avoid conflicts even if your variable is safe in-scope__ - It's easier to point out variables from reserved words this way
* __Break all cases in a switch statement__ - Helps us avoid future silly syntax errors; this includes default cases