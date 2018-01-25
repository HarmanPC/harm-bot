// this is where all the standard game commands are put
'use strict';

exports.commands = {
    'j': 'join',
    'y': 'join',
    join: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onJoin) room.game.onJoin(user);
    },
    "guess": "g",
    g: function(target, room, user) {
        if (!room || !room.game || room.game.answerCommand !== "standard") return false;
        if (room.game.onGuess) room.game.onGuess(user, target);
    },
    rpl: function(target, room, user) {
        if (!room || !room.game || !user.hasBotRank('%')) return false;
        if (room.game.onLeave) room.game.onLeave(target);
        this.send(`${target} is kicked from game.`);
    },
    leave: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onLeave) room.game.onLeave(user);
    },
    players: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.postPlayerList) room.game.postPlayerList();
    },
    score: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.getScoreBoard) this.send(room.game.getScoreBoard());
    },
    start: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.onStart) room.game.onStart();
        else {
            this.send(`/uno start`);
        }
    },
    game: function (target, room, user){
        this.can("broadcast");
        if (!room.game) return this.send(`No game is going on right now.`);
        else 
        this.send(`A Game of ${room.game.gameName} is going on.`);
        
    },
    autostart: function (target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.runAutoStart) room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        room.game.destroy();
        this.send("The game has been ended.");
    },
    skip: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        let gameId = room.game.gameId;
        this.parse("/" + gameId + "skip");
    },
    repost: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        let gameId = room.game.gameId;
        this.parse("/" + gameId + "repost");
    },
    signups: function(target, room, user) {
        if (!room || !user.can('broadcast')) return false;
        if (!target) this.parse("/help signups");
        if (target == 'passthebomb' || target=='ptb' || target=='chainfishing' || target=='cf' || target=='fishing') return false;
        let arg;
        [target, arg] = target.split(",").map(p => p.trim());
        
        let gameId = Monitor.games[toId(target)];
        if (!gameId) return this.send("Invalid game.");
        
        this.parse("/" + gameId + (arg ? " " + arg : ""));
    },
};