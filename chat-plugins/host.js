"use strict";
exports.game = 'host';

class hostGame extends Rooms.botGame {
    constructor(room, target) {
        super(room);

        this.gameId = "host";
        this.gameName = 'Host';
        this.official = false;

        this.hostid = toId(target);
        this.pl;

        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        this.topic = '';

        this.sendRoom(`Debateinfo! ${Users.get(this.hostid).name} is hosting. Do \`\`.join\`\` to join.`);

    }
    onStart(user) {
        if (this.state !== "signups") return false;
        hostlog(Users.get(this.hostid).name + "'s debate started.");
        hostlog('Players (' + this.startingPlayers + '): ' +  this.pl.join(', '));
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
        this.postPlayerList();
    }
    postPlayerList() {
        this.pl = this.userList.sort().map(u => this.users[u].name);

        this.sendRoom(`Players (${this.userList.length}): ${this.pl.join(", ")}`);
    }
    onEnd() {
        this.state = "ended";
        this.destroy();
    }
}
let millisToTime = function(millis){
    let seconds = millis/1000;
    let hours = Math.floor(seconds/3600);
    let minutes = Math.floor((seconds-hours*3600)/60);
    let response;
    if(hours>0){
        response = hours + " hour" + (hours === 1 ? "" : "s") + " and " + minutes + " minute" + (minutes === 1 ? "" : "s");
    } else {
        response = minutes + " minute" + (minutes === 1 ? "" : "s");
    }
    return response;
};

exports.commands = {
    host: function (target, room, user) {
        if (!room || !target || !user.hasBotRank('+')) return false;
        target = target.split(',');
        if (!room.users.has(toId(target[0]))) return this.room.send(null, 'The user "' + Users.get(target[0]).name + '" is not in the room.');
        if (room.game && room.game.gameId == 'host') {
            this.room.send(null, Users.get(target[0]).name + ' was added to hostqueue.');
            queue.push(target[0]);
            return;
        }
        if (room.game && room.game.gameId == 'debate') return this.room.send(null, 'There is already a debate going on in this room! (' + room.game.type + ')');
        if (toId(target[1]) === 'official') {
           room.game = new hostGame(room, target[0]);
           officiallog(Users.get(target).name + " hosted official.");
           room.game.official = true;
           return;
        }
        if (queue.indexOf(target[0]) > -1) {
            queue.splice(target[0], 1);
        }
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target[0] + ', host'}`); 
        room.game = new hostGame(room, target[0]);
        hostlog(Users.get(target[0]).name + " hosted.");
    },
    dehost: function (target, room, user) {
        if (!user.hasBotRank('+') || !room) return false;
        if (!(queue.indexOf(target) > -1)) return this.room.send(null, Users.get(target).name + ' is not in the hostqueue.');
        queue.splice(target, 1);
        this.room.send(null, Users.get(target).name + ' has been removed from hostqueue.');
    },
    subhost: function (target, room, user) {
        if (!room || !room.game || room.game.gameId !== 'host' || !target || !user.hasBotRank('+')) return false;
        this.parse(`${Users.get(toId(target)).hasBotRank('+') ? '/kek' : '/promote ' + target + ', host'}`);
        this.parse(`${Users.get(room.game.userHost).hasBotRank('+') ? '/kek' : '/promote ' + room.game.userHost + ', deauth'}`);
        this.room.send(null, Users.get(target).name + ' has been subhosted.');
        hostlog(Users.get(target).name + " subhosted " + Users.get(room.game.hostid).name + "'s host.");
        room.game.hostid = toId(target);
    },
    hostqueue: function (target, room, user) {
        if (!room || !user.hasBotRank('+')) return false;
        if (!queue.length) return this.room.send(null, 'Hostqueue is empty.');
        let msg = 'Hostqueue: ' + queue.map(str => '__' + Users.get(str).name + '__').join(', ');
        this.room.send(null, msg);
    },
    settopic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room || !room.game || !room.game.gameId === "host" || !target) return false;
        room.game.topic = target;
        this.room.send(null, 'The topic has been set to: ' + target);
    },
    topic: function (target, room, user) {
        if (!user.hasBotRank('host') || !room || !room.game || !room.game.gameId === "host" ) return false;
        if (!room.game.topic) return this.room.send(null, 'There is no topic.');
        this.room.send(null, 'Topic is: ' + room.game.topic);
    },
    parts:'participations',
    participations: function (target, room, user) {
        if (!user.hasBotRank('+') || !room || !target) return false;
        target = target.split(',');
        for (let i = 0; i <= target.length - 1; i++) {
            Leaderboard.onWin('t', this.room, toId(target[i]), 4).write();
        }
        this.room.send(null,'/wall Participation points awarded to ' + target.map(u => Users.get(u).name).join(', ') + '.');
        officiallog('Participation points awarded to ' +  target.map(u => Users.get(u).name).join(', ') + '.');
    },
    win: function (target, room, user) {
        if (!user.hasBotRank('+') || !room || !room.game || !target) return false;
        //if (!room.game.official) return this.room.send(null,'This host isn\'t official.');
        target = target.split(',');
        for (let i=0; i<=target.length - 1; i++) {
            Leaderboard.onWin('t', this.room, toId(target[i]), 10).write();
        }
        this.room.send(null, '/wall The winner' + target.length < 2 ? ' is' : 's are ' + target.map(u => Users.get(u).name).join(', ') + '! Thanks for hosting.');
        officiallog('The official winner' + target.length < 2 ? ' is ' : ' were ' + target.map(u => Users.get(u).name).join(', ') + '.');
        hostlog('The official winner' + target.length < 2 ? 'is ' : ' were ' + target.map(u => Users.get(u).name).join(', ') + '.');
        room.game.onEnd();
    },
    mvp:'mostvaluableplayer',
    mostvaluableplayer: function (target, room, user) {
    if (!room ||  !user.hasBotRank('+') || !room) return false;
    let winner = toId(target);
    this.room.send(null,`/wall MVP points awarded to ${Users.get(winner).name}!`);
    officiallog(`MVP points awarded to ${Users.get(winner).name}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
    },
    hostpoints: function (target, room, user) {
        if (!user.hasBotRank('+') || !target || !room) return false;
        this.room.send(null,`/wall Host points were awarded to ${Users.get(target).name}.`);
        Leaderboard.onWin('t', this.room, toId(target), 6).write();
        officiallog('The host was ' + Users.get(target).name + '.');
    },
    next: function (target, user, room) {
		this.can('debate');
		let d = new Date();
		let n = d.getHours();
		let m = d.getMinutes();
		let time = 60 * 1000 * 60;
		let millis = (60 - m) * 60 * 1000;
		if (n < 6) {
			millis += (5 - n) * time;
		} else if (n < 17) {
			millis += (16 - n) * time;
		} else if (n < 23) {
			millis += (22 - n) * time;
		} else {
			millis += (30 - n) * time;
		}
		this.send("The next official is in " + millisToTime(millis) + ".");
	},
	hostlogs: function (target, room, user) {
		if (!user.hasBotRank('%')) return false;
		if (room) return user.sendTo('Please use this command in my PMs only.');
		if (!fs.existsSync('./config/hostlogs.txt')) return user.sendTo('The host logs are empty.');
		fs.readFile("./config/hostlogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Host logs\n\n" + data, link => user.sendTo("Host logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
    },
    officiallogs: function (target, room, user) {
        if (!user.hasBotRank('%')) return false;
        if (room) return user.sendTo('Please use this command in my PMs only.');
        if (!fs.existsSync('./config/officiallogs.txt')) return user.sendTo('The official logs are empty.');
        fs.readFile("./config/officiallogs.txt", "utf-8", (err, data) => { 
			if (!err) {
				Tools.uploadToHastebin("Official logs\n\n" + data, link => user.sendTo("Official logs: " + link));
			}
			else {
				user.sendTo('Error getting logs.');
				console.log(err);
			}
		});
    }
};
/*globals Leaderboard*/
/*globals Users*/ 
/*globals toId*/
/*globals officiallog*/
/*globals Rooms*/
/*globals hostlog*/
/*globals Tools*/
/*globals fs*/
/*globals queue*/