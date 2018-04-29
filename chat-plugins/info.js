'use strict';
let receiveMail = function (user) {
    let myMail = Db("mail").get(user.userid, []);
    if (!myMail.length) return false;
    myMail.forEach(function(m) {
        user.sendTo("[" + getEST(m.date) + " EST] " + m.from + ": " + m.message);
    });
    Db("mail").set(user.userid, []);
    return true;
};

let sendMail = function (user, targetuserid, message) {
    //count mail
    let targetMail = Db("mail").get(targetuserid, []);
    //parse patterns
    let patternCount = 0;
    targetMail.forEach(function(m) {
        if (Tools.matchText(m.message, message) > 90) patternCount++;
        if (patternCount >= 3 && !user.isStaff) {
            Monitor.mute(user.userid, 30);
            log("monitor", user.name + " was caught for suspected mail spam.");
        }
    });

    targetMail.push({
        "from": user.name,
        "date": Date.now(),
        "message": message
    });
    Db("mail").set(targetuserid, targetMail);

    user.mailCount++;
    setTimeout(function() {
        user.mailCount--;
        if (user.mailCount < 0) user.mailCount === 0;
    }.bind(this), 60000);
};

Plugins.mail = {
    "receive": receiveMail,
    "send": sendMail,
};
exports.commands = {
    seen: function(target, room, user) {
        if (room) return false;
        if (!target) return this.send('Invalid username.');
        if (toId(target) == toId(Monitor.username)) return this.send(Monitor.username + ' was last seen sending you this message.');
        if (toId(target) == user.id) return this.send('Look at the person in mirror.');
        target = toId(target);
        let lastSeen = Users.seen.get(target, null);
        if (!lastSeen) return this.send("'" + target + "' was never seen before.");
        let seenRoom = Db("settings").get([toId(lastSeen[1], true), "isPrivate"], false) && ((!user.isDev() && !user.isStaff) || room) ? "a private room" : lastSeen[1];
        this.send("'" + Users.get(target).name + "' was last seen " + Tools.getTimeAgo(lastSeen[0]) + " ago in " + seenRoom + ".");
    },
    uptime: function(target, room, user) {
        let startTime = Date.now() - (process.uptime() * 1000);
        user.send("The bot's uptime is: " + Tools.getTimeAgo(startTime));
    },
    guide: function(target, room, user) {
        if (!Config.guide) return this.send('There is no guide.');
        user.sendTo('A guide on how to use ' + Monitor.username + ' can be found here: ' + Config.guide);
    },
    git: function(target, room, user) {
        user.sendTo(Monitor.username + "'s github repository: https://github.com/HarmanPC/harm-bot");
    },
    time: function (target, room, user) {
        if (!user.hasBotRank('+')) return user.sendTo('The EST time is: ' + getEST());
        this.send('The EST time is: ' + getEST());
    },
    mail: function(target, room, user) {
        if (room) return false;
        if (!target) return this.send('Usage .mail user, message');
        let [sendUser, ...message] = target.split(',');
        if (!message || message.length > 250) return this.parse("/help mail");
        if (!user.mailCount) user.mailCount = 0;
        if (user.mailCount > 5 && !user.isStaff) return false;
        try {
            sendMail(user, toId(sendUser) || sendUser, message.trim());
        }
        catch (e) {
            this.send("ERROR: unable to send mail.");
            this.send('/W lady Monita, .mail harmanpc, Mail error: ' + e.message);
        }
        this.send("Swish, mail has been sent to " + (Users.get(sendUser).name || sendUser));
    },
    checkmail: function(target, room, user) {
        if (room) return false;
        let mail = receiveMail(user);
        if (!mail) return user.sendTo("You have no mail!");
    },
    suggest: 'submit',
    submit: function (target, room, user) {
        if (room || !target) return false;
        fs.appendFile('config/suggestions.txt', 'Suggested by ' + user.name + ': ' + target + '\n\n');
        this.sendTo('Your suggestion: "' + target + '" has been submitted.');
    },
    suggestions: function (target, room, user) {
        if (!user.hasBotRank('%')) return false;
		if (room) return user.sendTo('Please use this command in my PMs only.');
		if (!fs.existsSync('./config/suggestions.txt')) return this.sendTo('The suggestions are empty.');
		fs.readFile("./config/suggestions.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin(data, link => this.sendTo("Suggestions: " + link));
			}
			else {
				this.send('Error getting suggestions.');
				console.log(err);
			}
		});
	}
};
/* globals Monitor Tools toId getEST Config Users Db Plugins log fs*/
