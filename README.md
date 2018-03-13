# De-Bait
A bot for the room debate.

Set-up
------
``npm install``
``node app.js [your name]``
You will be given admin privileges on the bot that way.
# Owner
1) Harman PC

# Contributers
1) A Helpful Rayquaza
2) Jr Nice Guy
3) sniper
# Special Thanks
1)  XnadrojX
2)  Hoeenhero
3)  ZestOfLife
4)  Sparkychild

# Config
This is the `../config/config.js` file.
`'use strict';
// Server you want to connect
exports.info = {
    server: "sim.smogon.com",
    port: 8000,
    serverid: "showdown"
};
// Bot username and password
exports.bot = {
    name: "De-Bait",
    pass: "",
};
// Default command character
const defaultCharacter = exports.defaultCharacter = ["."];
// default rank to use bot before doing any ranks
exports.defaultRank = "@";
// When someone PMs Bot
exports.pmMessage = 'Sorry, I am a bot! Use ' + defaultCharacter[0] + ' guide to view a list of some of my commands! Have a nice day!';

exports.customRank = {
    "broadcast": "+",
    "managegames": "#",
};
exports.monitorDefault = true;

exports.watchConfig = true;
// log() messages
exports.logging = ["info", "error", "join", "left", "ok", "monitor", "debate"];

exports.secprotocols = [];
// Bot guide 
exports.guide = '';
// Bot ranks including host
exports.ranks = {
    " ": 0,
    // Debate host
    "host": 0.5,
    "+": 1,
    //player
    "★": 1.3,
    "%": 2,
    "@": 3,
    "*": 3.5,
    "&": 4,
    "#": 5,
    "~": 6,
};
// commands that can be set
exports.settableCommands = {
    "say": true,
    "debate": true,
    "addcom": true,
    "settings": true,
    "banword": true,
    "autoban": true,
};
// Moderations settings
exports.modSettings = {
    "caps": true,
    "flooding": true,
    "spam": true,
    "face": true,
    "stretching": true,
    "bannedwords": true
};

// commands that do not trigger monitor
exports.whitelistCommands = {
    // "command": true,
};
// commands users can still used when bot locked
// done so that bot locks/mutes do not affect the user.
exports.lockedCommands = {
    "set": true,
    "autoban": true,
    "banword": true,
    "regexbanword": true,
    "settings": true,
    "setprivate": true,
    "ai": true
};

// whether or not the bot will answer people.
exports.AIEnabled = false;

exports.permissions = {
    " ": new Object(),
    "host": {
        games: true,
        promote: [" "],
    },
    "+": {
        games: true,
        promote: ["host", " "],
    },
    "%": {
        lock: [" "],
        mute: [" "],
        games: true,
        promote: ["host", " "],
    },
    "@": {
        lock: ["+", " "],
        mute: ["%", "+", " "],
        ban: ["%", "+", " "],
        games: true,
        promote: ["host", " "],
    },
    "~": {
        lock: ["~", "@", "%", "+", " "],
        mute: ["~", "@", "%", "+", " "],
        ban: ["~", "@", "%", "+", " "],
        games: true,
        promote: ["@", "%", "+", " ", "host"],
        bypassall: true,
    },
};`
