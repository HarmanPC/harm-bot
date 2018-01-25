'use strict';
exports.commands = {
    
 // to invite all users when chat die 
    inviteall: function(target, room, user) {
        if (!user.hasRank(room,'+')) return false;
        var text = '/invite ';
        this.send('Preparing to invite...');
        this.send(text + 'jrniceguy');
        this.send(text + 'sirjakrispy');
        this.send(text + 'funfun11');
        this.send(text + 'thimblebony');
        this.send(text + 'chaospirex');
        this.send(text + 'deltastatics');
        this.send(text + 'myruglaceon');
        this.send(text + 'WantedDark');
        this.send(text + 'yveltal321');
        this.send(text + 'jennisa'); //10
        this.send(text + 'iranianblood');
        this.send(text + 'melagon');
        this.send(text + 'aurom');
        this.send(text + 'cyanize');
        this.send(text + 'wintergames');
        this.send(text + 'hopes and dreams');
        this.send(text + 'eeveelutionarmy');
        this.send(text + 'kceeee');
        this.send(text + 'ithi');
        this.send(text + 'harmanpc'); //20
        this.send(text + 'carbinkdiancie');
        this.send(text + 'friskyy');
        this.send(text + 'ayush20');
        this.send(text + 'gsgsgsgs');
        this.send(text + 'zgx');
        this.send(text + 'wintergames');
        this.send(text + 'blazewalker');
        this.send(text + 'gw8'); //30
        this.send(text + 'nellatheprincess');
        this.send(text + 'smolzilla');
        this.send(text + 'dreams on a cloud');
        this.send(text + 'raichuoflugnica');
        this.send(text + 'thimblebony');
        this.send(text + 'ithi');
        this.send(text + 'demonlordeliza');
        this.send(text + 'mehlord');
        this.send(text + 'tsar dragon');
     //   this.send(text + 'the writing squib');
        this.send(text + 'torterraman456');
        this.send(text + 'galaxywolf200');
        this.send(text + 'devin29');
        this.send('Invitation sent to some users!');
    },
    // host
    roll: function(target,room, user){
        if (!user.hasBotRank('+')) return false;
        let num=Math.floor(Math.random() * target) + 1;
        let msg=`Random Roll (1 -  ${target}): `;
        this.send(`${msg} ${num}`);
    },
    host: function(target, room, user){
        this.host = [];
        if (!user.hasRank('%'))  return false;
        if (room.game == true) {
            this.send(`There is a game going in this room. (${room.game})`);
            return false;
        }
        if (target == user.name) {
            this.send(`/wall Harmgame! ${user.name} is hosting a game. Do \`\`/me in\`\` to join!`);
            this.host.push(user.name);
        }
        else if (target != user.name){
            this.send(`/wall Harmgame! ${target} is hosting a game. Do \`\`/me in\`\` to join.`);
            this.parse(`/promote ${target} , + `);
            this.host.push(target);
        }
        else {
            this.send(`Format is \`\`.host [user]\`\``);
        }
    },
    win: function(target, room, user){
        if (!user.hasBotRank('+'))return false;
        target = target.split(',');
        let  winner = target[0];
        let count = target[1];
        
        if (!winner || !count){
            this.send(`The format is \`\`.win [winner], [playercount]\`\``);
        }
        else if (user.hasBotRank('%')){
        this.send(`/wall The winner is ${winner} ! Thanks for hosting.`);
        this.send(`/w harmanpc, ${winner} wins with ${count}`);
        }
        else {
            this.send(`/wall The winner is ${winner}! Thanks for hosting.`);
            this.parse(`/promote ${user.id} , deauth`);
            this.send(`/w harmanpc, (${room.name}) **${winner}** wins with ${count}.`);
        }
    },
    // UNO
    uno: function (target, room, user){
        this.can("broadcast");
        this.send(`/uno create ${target} `);
        this.send(`/uno timer 69`);
        this.send(`/wall Harmgame! A new game of UNO is starting. Do \`\`/uno join\`\` to join.`);
        this.parse(`/timer 00:01:30`);
        
    },
    unostart:  function(target,room,user) {
        this.can("broadcast");
        this.send(`/uno start`);
        this.send("/wall Good luck to everyone who joined the game of UNO!");
    },
};