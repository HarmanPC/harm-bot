"use strict";
exports.game = 'host';
exports.aliases = ['host'];

class hostGame extends Rooms.botGame {
    constructor(room) {
        super(room);
        
        this.gameId = "host";
        this.gameName = 'Host';
        
        this.userHost = [];
        this.answerCommand = "special";
        this.state = "signups";
        this.allowJoins = true;
        
        this.sendRoom(`Harmgame! ${this.userHost} is hosting. Do \`\`.join\`\` to join.`);
        
    }
    onStart(user) {
       // if (!user.hasBotRank('+') || (!user.id == this.userHost)) return false;
        if (this.userList.length < 2 || this.state !== "signups") return false;
        this.state === 'started';
        this.sendRoom(`Signups are now closed.`);
        this.startingPlayers = this.userList.length;
    }
    postPlayerList() {
        let pl = this.userList.sort().map(u => this.users[u].name);
        
        this.sendRoom(`Players (${this.userList.length}): ${pl.join(", ")}`);
    }
    hosting(ok) {
        this.userHost = ok;
    }
     onEnd(winner) {
        this.state = "ended";
        if (winner) {
         //   let winner = this.users[this.userList[0]];
        //    this.sendRoom(`Congratulations to ${winner.name} for winning the game of ambush!`);
            Leaderboard.onWin("host", this.room, winner, this.startingPlayers).write();
        }
        
        this.destroy();
    }
}
exports.commands = {
    host: function (target, room, user) {
        if (!room || !target|| !this.can("games")) return false;
        if (room.game) return this.send("There is already a game going on in this room! (" + room.game.gameName + ")");
        room.game = new hostGame(room);
        room.game.hosting(toId(target));
    },
    win: function (target, room, user) {
    if (!user.hasBotRank('%') || !user.id == room.game.userHost) return false;
    //target = target.split(',');
    let winner = toId(target);
    this.send('The winner is ' + target + '! Thanks for hosting.');
    room.game.onEnd(winner);
    },
    scorecap: function (target, room, user) {
        let score=[];
        if (target)
        this.send(`Scorecap has been set to: ${target}`);
        score = target;
        
        if (!target) 
            this.send(`Scorecap: ${score}`);
        
    }
};

/* globals Leaderboard*/
/* globals Tools*/ 
/* globals toId*/
