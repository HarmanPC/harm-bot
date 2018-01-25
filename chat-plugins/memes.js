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
};
