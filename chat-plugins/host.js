"use strict";
exports.game = 'host';
exports.aliases = ['host'];

class hostGame extends Rooms.botGame {
    constructor(room, target, target2) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        
        this.scorecap = [];
        this.official = false;
        this.userHost = target;
        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        
        this.sendRoom(`Debateinfo! ${this.userHost} is hosting. Do \`\`.join\`\` to join.`);
        
    }
    onStart(user) {
        if (this.state !== "signups") return false;
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
        this.postPlayerList();
    }
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
     onEnd() {
        this.state = "ended";
        this.destroy();
    }
}
function getRank(room, message){
    Users.get(Monitor.username).hasRank(room, "%") ? "wall " : "" + message;
}
exports.commands = {
    host: function (target, room, user) {
        if (!room || !target[0] || !this.can("games")) return false;
        target = target.split(',');
        if (target[1] == 'official') return room.game.official = true;
        if (room.game) return this.send("There is already a debate going on in this room! (By " + room.game.userHost + ")");
        room.game = new hostGame(room, target[0], target[1]);
    },
    subhost: function (target, room, user) {
        this.send(target + ' has been subhosted.');
        room.game.userHost = toId(target);
    },
    parts: function (target, room, user) {
        if (!user.can('debate')) return false;
        this.send('Participation points were awarded to ' + target);
        Leaderboard.onWin('t', this.room, target, 4).write();
    },
    win: function (target, room, user) {
        if (!user.can('debate')) return false;
        target = target.split(',');
        if (room.game.official == false) return false;
        if (target.length < 2) {
            this.send(`The winner is ${target[0]}! Thanks for hosting.`);
            Leaderboard.onWin('t', this.room, target[0], 10).write();
        }
        else if (target.length > 1) {
            for (let i=0; i<=target.length - 1; i++) {
                Leaderboard.onWin('t', this.room, toId(target[i]), 10).write();
            }
            this.send(`The winners are ${target.join(', ')}! Thanks for hosting.`);
        }
        else {
            this.send('The winner is ' + target[0] + '! Thanks for hosting.');
        }
        room.game.onEnd();
    },
    mvp: function (target, room, user) {
    if (!room || !user.can('debate')) return false;
    let winner = toId(target);
    this.send(`${Users.get(Monitor.username).hasRank(this.room, "%") ? "/wall " : ""} MVP points awarded to ${winner}!`);
    Leaderboard.onWin('t', this.room, winner, 4).write();
    },
};  

/* globals Leaderboard*/
/* globals Users*/ 
/* globals toId*/
/* globals Monitor*/
/* globals Rooms*/
