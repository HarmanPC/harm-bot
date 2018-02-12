// this is where all the standard game commands are put
'use strict';
exports.commands = {
    'j': 'join',
    'y': 'join',
    join: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onJoin) room.game.onJoin(user);
    },
    /*"guess": "g",
    g: function(target, room, user) {
        if (!room || !room.game || room.game.answerCommand !== "standard") return false;
        if (room.game.onGuess) room.game.onGuess(user, target);
    }, */
    rpl: "removeplayer",
    removeplayer: function(target, room, user) {
        if (!room || !room.game || !user.hasBotRank('%')) return false;
        room.game.state = 'signups';
        if (room.game.onLeave) room.game.onLeave(Users.get(target));
        room.game.state = 'started';
        this.send(`${target} is removed from playerlist.`);
    },
    apl:'addplayer',
    addplayer: function(target, room, user){
        this.can('games');
        if (!room || !room.game) return false;
        room.game.state = 'signups';
        if (room.game.onJoin) room.game.onJoin(Users.get(target));
        room.game.state = 'started';
        this.send(`${target} is added in playerlist.`);
    },
    leave: function(target, room, user) {
        if (!room || !room.game) return false;
        if (room.game.onLeave) room.game.onLeave(user);
    },
    players: function(target, room, user) {
        if (!room || !user.can('games') || !room.game) return false;
        if (room.game.postPlayerList) room.game.postPlayerList();
    },
    score: function(target, room, user) {
        if (!room || !user.can('games') || !room.game) return false;
        if (room.game.getScoreBoard) this.send(room.game.getScoreBoard());
    },
    start: function(target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.onStart) room.game.onStart();
    
    },
    checkdebate: function (target, room, user){
        this.can("games");
        if (!room.game) return this.send(`No debate is going on right now.`);
        if (room.game.gameId == 'host') return this.send(room.game.userHost + " is hosting a debate.");
    },
    autostart: function (target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.runAutoStart) room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        if (!room || !user.can('games') || !room.game) return false;
        room.game.destroy();
        this.send("The debate has been ended.");
    },
    /*skip: function(target, room, user) {
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
        if (toId(target) == 'dd' || toId(target) == 'diddlydice') return false;
        let arg;
        [target, arg] = target.split(",").map(p => p.trim());
        
        let gameId = Monitor.games[toId(target)];
        if (!gameId) return this.send("Invalid game.");
        
        this.parse("/" + gameId + (arg ? " " + arg : ""));
    },*/
    roll: function(target,room, user){
        let num=Math.floor(Math.random() * target) + 1;
        let msg=`Random Roll (1 -  ${target}): `;
        if (!room.game){
        if (!user.hasBotRank('+')) return false;
        this.send(`${msg} ${num}`);
        }
        if (room.game) {
            if (user.userid != toId(room.game.userHost)) return false;
            this.send(`${msg} ${num}`);
        }
    },
    rhangman: function (target, room, user) {
        this.can('games');
        let poke = Tools.shuffle(Object.keys(Tools.Words))[0];
        this.send(`/hangman create ${poke}, ${Tools.Words[poke]}`);
        this.send('/wall Use ``/guess`` to guess.');
    },
    type: function(target, room, user) {
        if (!user.can('games')) return false;
        let types=["Water","Fire","Grass","Electric","Ground","Flying","Psychic","Dark","Fighitng","Rock","Dragon","Fairy","Poison","Steel","Bug","Ice","Ghost"];
        let rand1=types[Math.floor(Math.random() * 16)];
        let rand2=types[Math.floor(Math.random() * 16)];
        let t1=`**Types:** ${rand1}`;
        let t2=`**Types:** ${rand1} / ${rand2}`;
        let rand3=[t1,t2];
        let rand4=rand3[Math.floor(Math.random() * 2)];
        this.send(rand4);
    },
    validtype: function (target, room, user) {
        if (!user.can('games')) return false;
        function objectValues (obj) {
            return Object.keys(obj).map(k => obj[k]);
        }
        let random = Tools.shuffle(Object.keys(Tools.Pokedex))[0];
        this.send(`**Types:** ${objectValues(Tools.Pokedex[random].types)}`);
    },
    /*globals Tools*/
    /*globals toId*/
    /*globals Users*/
};