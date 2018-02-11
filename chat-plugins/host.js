"use strict";
exports.game = 'host';
exports.aliases = ['host'];

class hostGame extends Rooms.botGame {
    constructor(room, target) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        
        this.scorecap = [];
        this.userHost = target;
        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        
        this.sendRoom(`Debateinfo! ${this.userHost} is hosting. Do \`\`.join\`\` to join.`);
        
    }
    onStart(user) {
    //    if (!user.hasBotRank('+') || (!user.id == this.userHost)) return false;
        if (this.state !== "signups") return false;
        this.state = 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
    }
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
     onEnd(winner) {
        this.state = "ended";
        if (winner) {
            Leaderboard.onWin("host", this.room, winner, this.startingPlayers).write();
        }
        
        this.destroy();
    }
}
exports.commands = {
    host: function (target, room, user) {
        if (!room || !target|| !this.can("games")) return false;
        if (room.game) return this.send("There is already a game going on in this room! (" + room.game.gameName + ")");
        room.game = new hostGame(room, target);
    },
    subhost: function (target, room, user) {
        this.send(target + ' has been subhosted.');
        room.game.userHost = toId(target);
    },
    win: function (target, room, user) {
    if (!room || !room.game || !user.hasBotRank('%') || user.userid != toId(room.game.userHost)) return false;
    let winner = toId(target);
    this.send('The winner is ' + target + '! Thanks for hosting.');
    room.game.onEnd(winner);
    },
    scorecap: function (target, room, user) {
        if ( !room || !room.game || !user.hasRank('+') || user.userid != toId(room.game.userHost)) return false;
        if (!target){
            this.send(`**Scorecap:** ${room.game.scorecap}`);
        }
        else {
            this.send(`**Scorecap has been set to:** ${target}`);
            room.game.scorecap = target;
        }
    },
};  

/* globals Leaderboard*/
/* globals Tools*/ 
/* globals toId*/
