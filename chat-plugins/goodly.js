'use strict';
this.timer = {};
exports.commands = {
 // to invite all users when chat die 
    inviteall: function(target, room, user) {
        if (!user.hasRank(room,'+')) return false;
        var text = '/invite ';
        this.send('Preparing to invite...');
        this.send(text + 'jrniceguy');
        this.send(text + 'sirjakrispy');
        this.send(text + 'funfun11');
        this.send(text + 'powerhitter0418');
        this.send(text + 'chaospirex');
        this.send(text + 'deltastatics');
        this.send(text + 'myruglaceon');
        this.send(text + 'WantedDark');
        this.send(text + 'umbraaura'); 
        this.send(text + 'iranianblood'); // 10
        this.send(text + 'melagon');
        this.send(text + 'aurom');
        this.send(text + 'cyanize');
        this.send(text + 'wintergames');
        this.send(text + 'friskyprism');
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
        this.send(text + 'torterraman456');
        this.send(text + 'galaxywolf200');
        this.send(text + 'devin29');
        this.send(text + 'z qrow');
        this.send(text + 'bigted');
        this.send(text + 'xxhelenaxx');
        this.send(text + 'spiderz');
        this.send(text + 'heroictobias');
        this.send(text + 'skyfigueroa');
        this.send(text + 'ahelpfulrayquaza');
        this.send(text + 'ironcrusher');
        this.send(text + 'adison1');
        this.send(text + 'daderia');
        this.send(text + 'xxcowface');
        this.send(text + 'umi345');
        this.send(text + 'darkraiswrath');
        this.send(text + '');
        this.send('Invitation sent to some users!');
    },
    // host
    roll: function(target,room, user){
        if (!user.hasBotRank('+')) return false;
        let num=Math.floor(Math.random() * target) + 1;
        // took 2 vars because it adds target and msg
        let msg=`Random Roll (1 -  ${target}): `;
        this.send(`${msg} ${num}`);
    },
    // UNO
    uno: function (target, room, user){
        this.can("broadcast");
        this.send(`/uno create ${target} `);
        this.send(`/uno timer 69`);
        this.send(`/wall Harmgame! A new game of UNO is starting in 2:30 minutes. Do \`\`/uno join\`\` to join.`);
        this.timer = setInterval(() => {
                    this.send('!uno players');
                    this.send('/uno start');
                    clearTimeout(this.timer);
                },  1 * 1000 * 150);
        
    },
    unostart:  function(target,room,user) {
        this.can("broadcast");
        this.send(`/uno start`);
        this.send("/wall Good luck to everyone who joined the game of UNO!");
        clearTimeout(this.timer);
    },
};