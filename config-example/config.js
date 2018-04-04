'use strict';
// server info 
exports.info = {
    server: "sim.smogon.com",
    port: 8000,
    serverid: "showdown"
};
// details
exports.bot = {
    name: "Username",
    pass: "Password",
};
// command character
const defaultCharacter = exports.defaultCharacter = ["."];

exports.defaultRank = "%";
// PM message
exports.pmMessage = `Sorry, I am a bot! Use ${defaultCharacter[0]}guide to view a list of some of my commands! Have a nice day!`;

exports.customRank = {
    "broadcast": "+",
    "managegames": "#",
};
exports.monitorDefault = true;

exports.watchConfig = true;

exports.logging = ["info", "error", "join", "left", "ok", "monitor","debate"];

exports.secprotocols = [];
// All ranks
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
// settable commands
exports.settableCommands = {
    "say": true,
    "debate": true,
    "addcom": true,
    "settings": true,
    "banword": true,
    "autoban": true,
};
// moderation settings
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
// Bot guide 
exports.guide = '';
// whether or not the bot will answer people.
exports.AIEnabled = false;
// permissions for each rank
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
};
