"use strict";
exports.commands = {
    memes: "meme",
    meme: function (target, room, user, cmd) {
        // declaring seperate facial features will enable the bot to create 194750 unique memes.
        let noses = ["ᴥ","ᗝ","Ѡ","ᗜ","Ꮂ","ᨓ","ᨎ","ヮ","╭͜ʖ╮","͟ل͜","͜ʖ","͟ʖ","ʖ̯","ω","³","ε","﹏","□","ل͜","‿","╭╮","‿‿","▾","‸","Д","∀","!","人",".","ロ","_","෴","ꔢ","ѽ","ഌ","⏠","⏏","⍊","⍘","ツ","益"];
        let eyes = ["⌐■","■","■","͠°","°","⇀","↼","´•","•`","´","`","´","`","`","´","`","ó","ò","ó","ò","ò","ó","⸌","⸍","Ƹ̵̡","Ʒ","ᗒ","ᗕ","⟃","⟄","⪧","⪦","⪧","⪦","⪦","⪧","⪩","⪨","⪩","⪨","⪨","⪩","⪰","⪯","⫑","⫒","⨴","⨵","⩿","⪀","⩾","⩽","⩺","⩹","⩺","⩹","⩹","⩺","◥▶","◀◤","≋","≋","૦ઁ","૦ઁ","ͯ","ͯ","̿","̿","͌","͌","ꗞ","ꗞ","ꔸ","ꔸ","꘠","꘠","ꖘ","ꖘ","܍","܍","ළ","ළ","◉","◉","☉","☉","・","・","▰","▰","ᵔ","ᵔ","ﾟ","ﾟ","ﾟ","□","□","☼","☼","*","*","`","`","⚆","⚆","⊜","⊜","❍","❍","￣","￣","─","─","✿","✿","•","•","T","T","^","^","ⱺ","ⱺ","@","@","ȍ","ȍ","","","","","$","$","Ȍ","Ȍ","ʘ","ʘ","Ꝋ","Ꝋ","","","","","⸟","⸟","๏","๏","ⴲ","ⴲ","■","■","■","ﾟ","ﾟ","◕","◕","◔","◔","✧","✧","■","■","♥","♥","͡°","͡°","¬","¬","º","º","⨶","⨶","⨱","⨱","⏓","⏓","⏒","⏒","⍜","⍜","⍤","⍤","ᚖ","ᚖ","ᴗ","ᴗ","ಠ","ಠ","σ","σ"];
        let sides = [["ʢ", "ʡ"],["⸮", "?"],["ʕ", "ʔ"],["ᖗ", "ᖘ"],["ᕦ", "ᕥ"],["ᕦ(", ")ᕥ"],["ᕙ(", ")ᕗ"],["ᘳ", "ᘰ"],["ᕮ", "ᕭ"],["ᕳ", "ᕲ"],["(", ")"],["_", "¯"],["୧", "୨"],["୧", "୨"],["୨", "୧"],["⤜(", ")⤏"],["☞", "☞"],["ᑫ", "ᑷ"],["ᑷ", "ᑴ"],["ヽ(", ")ﾉ"],["乁(", ")ㄏ"],["└", "┘"],["(づ", ")づ"],["(ง", ")ง"],["|", "|"]];

        let output = [];
        let reiterations = target && parseInt(target) && parseInt(target) <= 40 ? parseInt(target) : (cmd === "memes" ? 5 : 1);
        for (let i = 0; i < reiterations; i++) {
            // allow multiple memes
            // now the fun part - building the face
            // randomly determine the part to put in.
            let nose = noses[~~(Math.random() * noses.length)];
            let eye = eyes[~~(Math.random() * eyes.length)];
            let side = sides[~~(Math.random() * sides.length)];

            // create the face
            let lenny = side[0] + eye + nose + eye + side[1];
            output.push(lenny);
        }    
        this.send(output.join(" "));
    },
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
     //   this.send(text + 'hydrostatics');
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
    invitee: function(target,room,user){
        var users = ['skyfigueroa','harmanpc'];
        
    },
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
   /* invitee: function(target, room, user){
        if (!user.hasRank(room,'@')) return false;
        var users[88] = {'frostybang','harmanok'};
        var i; 
        this.send('Preparing to invite...');
        for (i=0;i<=1;i++){
            this.send('/invite ' + users[i])
        }
        this.send('Done!');
    }*/
    game: function (target, room, user){
        this.can("broadcast");
        if (!room.game) return this.send(`No game is going on right now.`);
        else 
        this.send(`A Game of ${room.game.gameName} is going on.`);
        
    },
   /* disablegames: function (target, room, user){
        if (!user.isDev()) return false;
        this.send(`Games have been temp disabled.`);
        room.game = false;
    }*/
};
