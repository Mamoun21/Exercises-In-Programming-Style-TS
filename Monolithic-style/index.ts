const fs = require('fs');
const lineByLine = require('n-readlines');
let word_freq = [];
const readFile = fs.readFileSync('stopWord.txt', 'utf8');
let stop_words= readFile.split(',');
let newArray=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
for(let j = 0 ;j<newArray.length;j++)
{
    stop_words.push(newArray[j]);
}
const liner = new lineByLine('example.txt');
let line;
while (line = liner.next()) {
    line=line.toString();
    let star_char = null;
    let i = 0;
    for (let c of line) {
        if (star_char == null) {
            if ("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1) {
                star_char = i;
            }
        }
        else {
            if (!("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1)) {
                let found = false;
                let word = line.slice(star_char, i).toLowerCase();
                if (!(stop_words.indexOf(word)>-1)) {
                    let pair_index = 0;
                    for (let pair of word_freq) {
                        if (word == pair[0]) {
                            pair[1] += 1;
                            found = true;
                            break;
                        }
                        pair_index += 1;
                    }
                    if (!found) {
                        word_freq.push([word, 1]);
                       
                    }
                    else if (word_freq.length > 1) {
                        for (let n = pair_index; n>0; n--) {
                            if (word_freq[pair_index][1] > word_freq[n][1]) {
                                word_freq[n], word_freq[pair_index] = word_freq[pair_index], word_freq[n];
                                pair_index = n;

                            }
                        }
                    }
                }
                star_char = null;
            }
        }
        i+=1;
    }
}
console.log("The frequency of words:");
for (let tf = 0 ; tf<word_freq.length ;tf++){
    console.log(word_freq[tf]);
    
}
