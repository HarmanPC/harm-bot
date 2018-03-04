'use strict';
/*****************************************
 *       THIS IS NOT READY YET           *
 ****************************************/
// question
let q = [];
// options 
let ans1 = [];
let ans2 = [];
let ans3 = [];
let ans4 = [];
let ans5 = [];
let ans6 = [];
let ans7 = [];
let ans8 = [];
// users who voted
let users = [];
// votes 
let ans1V = 0;
let ans2V = 0;
let ans3V = 0;
let ans4V = 0;
let ans5V = 0;
let ans6V = 0;
let ans7V = 0;
let ans8V = 0;
// determines if poll is running or not
let POLL;

exports.commands = {
    poll: function (target, room, user) {
        if (!user.hasBotRank('+')) return false;
        if (!target || toId(target) == 'show') return this.parse('/pollshow');
        if (toId(target) == 'end') return this.parse('/pollend');
        let targets = target.split(',');
        q = targets[0];
        ans1 = targets[1].trim();
        ans2 = targets[2].trim();
        ans3 = targets[3].trim();
        ans4 = targets[4].trim();
        ans5 = targets[5].trim();
        ans6 = targets[6].trim();
        ans7 = targets[7].trim();
        ans8 = targets[8].trim();
        this.room.send(null, `!code             Poll: ${q}          \n\n 1) ${ans1}\n\n 2) ${ans2}\n\n 3) ${ans3}\n\n 4) ${ans4}\n\n 5) ${ans5}\n\n 6) ${ans6}\n\n 7) ${ans7}\n\n 8) ${ans8}\n\n `);
        POLL = true;
        this.room.send(null, `Use \`\`.vote\`\` to vote.`);
    },
    vote: function (target, room, user) {
        if (POLL !== true) return false;
        if (!target) return user.sendTo('Usage: ``.vote [option]``');
        let targetId = toId(target);
        if (users.includes(user.id)) return user.sendTo('You have already voted for the poll.');
        if (targetId == toId(ans1)) { ans1V+=1; user.sendTo('You have voted for "' + ans1 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans2)) { ans1V+=1; user.sendTo('You have voted for "' + ans2 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans3)) { ans1V+=1; user.sendTo('You have voted for "' + ans3 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans4)) { ans1V+=1; user.sendTo('You have voted for "' + ans4 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans5)) { ans1V+=1; user.sendTo('You have voted for "' + ans5 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans6)) { ans1V+=1; user.sendTo('You have voted for "' + ans6 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans7)) { ans1V+=1; user.sendTo('You have voted for "' + ans7 + '" for **' + q + '**'); users.push(user.id) }
        if (targetId == toId(ans8)) { ans1V+=1; user.sendTo('You have voted for "' + ans8 + '" for **' + q + '**'); users.push(user.id) }
    },
    pollend: function (target, room, user) {
        if (!user.hasBotRank('+')) return false;
        if (!POLL) return this.room.send(null, 'There is no poll running in this room.');
        this.room.send(null, `!code             Poll: ${q}          \n\n 1) ${ans1}: ${ans1V}\n\n 2) ${ans2}: ${ans2V}\n\n 3) ${ans3}: ${ans3V}\n\n 4) ${ans4}: ${ans4V}\n\n 5) ${ans5}: ${ans5V}\n\n 6) ${ans6}: ${ans6V}\n\n 7) ${ans7}: ${ans7V}\n\n 8) ${ans8}: ${ans8V}\n\n `);
        this.room.send(null, 'Poll has been ended by ' + user.name);
        POLL = false;
    },
    pollshow: function (target, room, user) {
        if (!user.hasBotRank('+')) return false;
        if (!POLL) return this.room.send(null, 'There is no poll running in this room.');
        this.room.send(null, `!code             Poll: ${q}          \n\n 1) ${ans1}: ${ans1V}\n\n 2) ${ans2}: ${ans2V}\n\n 3) ${ans3}: ${ans3V}\n\n 4) ${ans4}: ${ans4V}\n\n 5) ${ans5}: ${ans5V}\n\n 6) ${ans6}: ${ans6V}\n\n 7) ${ans7}: ${ans7V}\n\n 8) ${ans8}: ${ans8V}\n\n `);
    },
    userscheck: function (target, room, user) {
        this.send(users[0]);
    }
};
/*globals toId*/