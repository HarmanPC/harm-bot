// this is where all the standard game commands are put
'use strict';
/*this.unotimer = setInterval(() => {
                    this.send('!uno players');
                    this.send('/uno start');
                    clearTimeout(this.timer);
                },  1 * 1000 * 120);*/
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
    apl: "addplayer",
    addplayer: function(target, room, user) {
        if (!room || !room.game || !user.hasBotRank('%')) return false;
        if (room.game.onLeave) room.game.onJoin(Users.get(target));
        this.send(`${target} is added in game.`);
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
    game: function (target, room, user){
        this.can("games");
        if (!room.game) return this.send(`No game is going on right now.`);
        if (room.game.gameId == 'host') return this.send(room.game.userHost + " is hosting.");
        else 
        this.send(`A game of ${room.game.gameName} is going on.`);
        
    },
    autostart: function (target, room, user) {
        if (!room || !user.can('broadcast') || !room.game) return false;
        if (room.game.runAutoStart) room.game.runAutoStart(target);
    },
    end: function(target, room, user) {
        if (!room || !user.can('games') || !room.game) return false;
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
       // if (!target) this.parse("/help signups");
        if (toId(target) == 'dd' || toId(target) == 'diddlydice') return false;
        let arg;
        [target, arg] = target.split(",").map(p => p.trim());
        
        let gameId = Monitor.games[toId(target)];
        if (!gameId) return this.send("Invalid game.");
        
        this.parse("/" + gameId + (arg ? " " + arg : ""));
    },
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
        if (!user.can('games')) return false;
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
     // UNO
    uno: function (target, room, user){
        this.can("broadcast");
        this.send(`/uno create ${target} `);
        this.send(`/uno timer 69`);
        this.send(`/wall Harmgame! A new game of UNO is starting in 2 minutes. Do \`\`/uno join\`\` to join.`);
       // this.unotimer;
    },
    unostart:  function(target,room,user) {
        this.can("broadcast");
        this.send(`/uno start`);
        this.send("/wall Good luck to everyone who joined the game of UNO!");
        //clearTimeout(this.unotimer);
    },
    /*globals Tools*/
    /*globals Monitor*/
    /*globals toId*/
    /*globals Users*/
};