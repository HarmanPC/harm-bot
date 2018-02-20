'use strict';

exports.commands = {
    uptime: function(target, room, user) {
        this.can("set");
        let startTime = Date.now() - (process.uptime() * 1000);
        this.send("The bot's uptime is: " + Tools.getTimeAgo(startTime));
    },
    help: function(target, room, user) {
        if (!target) return this.parse("/guide");
        target = target.toLowerCase();
        this.can("say");
        if (!Tools.helpEntries[target]) return false;
        Tools.helpEntries[target].forEach(e => {
            this.send(e.replace(/^\//i, room ? room.commandCharacter[0] : Config.defaultCharacter));
        });
    },
    guide: function(target, room, user) {
        this.can("set");
        let useCommandCharacter = room ? room.commandCharacter[0] : Config.defaultCharacter[0];
        let hastebin = Object.keys(Tools.helpEntries).sort().map(entry => Tools.helpEntries[entry].join("\n").replace(/^\//i, useCommandCharacter).replace(/\n\//i, useCommandCharacter)).join("\n\n");
        Tools.uploadToHastebin("Bot Commands: \n\n" + hastebin, link => {
            this.send("Bot Guide: " + link);
        });
    },
    git: function(target, room, user) {
        this.can("set");
        this.send(Monitor.username + "'s github repository: https://github.com/HarmanPC/harm-bot");
    },
    time: function (target, room, user) {
        this.can('debate');
        this.send('The EST time is: ' + getEST());
    },
};
/*globals Monitor*/
/*globals Tools*/