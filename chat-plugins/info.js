'use strict';

exports.commands = {
     seen: function(target, room, user) {
        if(!target) return this.parse("/help seen");
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
    calculate: function (target, room, user) {
        this.can('debate');
        if (target.match(/[a-z]/i)) return this.send('Please only use this command to calculate.');
        if (typeof eval(target) == 'undefined') return this.send('Invalid calculation.');
        this.send(eval(target));
    }
};
/*globals Monitor*/
/*globals Tools*/
/*globals toId*/
/*globals getEST*/
/*globals Config*/
/*globals Users*/
/*globals Db*/