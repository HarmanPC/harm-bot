'use strict';

exports.commands = {
    seen: function(target, room, user) {
        if (room) return false;
        if (!target) return this.send('Invalid username.');
        if (toId(target) == toId(Monitor.username)) return this.send(Monitor.username + ' was last seen sending you this message.');
        if (toId(target) == user.id) return this.send('Look at the person in mirror.');
        this.can("set");
        target = toId(target);
        let lastSeen = Users.seen.get(target, null);
        if (!lastSeen) return this.send("'" + target + "' was never seen before.");
        let seenRoom = Db("settings").get([toId(lastSeen[1], true), "isPrivate"], false) && ((!user.isDev() && !user.isStaff) || room) ? "a private room" : lastSeen[1];
        this.send("'" + Users.get(target).name + "' was last seen " + Tools.getTimeAgo(lastSeen[0]) + " ago in " + seenRoom + ".");
    },
    uptime: function(target, room, user) {
        this.can("set");
        let startTime = Date.now() - (process.uptime() * 1000);
        this.send("The bot's uptime is: " + Tools.getTimeAgo(startTime));
    },
    guide: function(target, room, user) {
        this.can("set");
        if (!Config.guide) return this.send('There is no guide.');
        this.send('A guide on how to use ' + Monitor.username + ' can be found here: ' + Config.guide);
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
/*globals toId*/
/*globals getEST*/
/*globals Config*/
/*globals Users*/
/*globals Db*/