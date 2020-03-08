const fileSystem = require('fs');
const lineByLine = require('n-readlines');
let wordFreq = [];
const readFile = fileSystem.readFileSync('stopWord.txt', 'utf8');
let stopWords= readFile.split(',');
let newArray=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
for(let j = 0 ;j<newArray.length;j++)
{
    stopWords.push(newArray[j]);
}
const liner = new lineByLine('example.txt');
let line;
while (line = liner.next()) {
    line=line.toString();
    let starChar = null;
    let i = 0;
    for (let c of line) {
        if (starChar == null) {
            if ("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1) {
                starChar = i;
            }
        }
        else {
            if (!("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1)) {
                let found = false;
                let word = line.slice(starChar, i).toLowerCase();
                if (!(stopWords.indexOf(word)>-1)) {
                    let pairIndex = 0;
                    for (let pair of wordFreq) {
                        if (word == pair[0]) {
                            pair[1] += 1;
                            found = true;
                            break;
                        }
                        pairIndex += 1;
                    }
                    if (!found) {
                        wordFreq.push([word, 1]);
                       
                    }
                    else if (wordFreq.length > 1) {
                        for (let n = pairIndex; n>0; n--) {
                            if (wordFreq[pairIndex][1] > wordFreq[n][1]) {
                                wordFreq[n], wordFreq[pairIndex] = wordFreq[pairIndex], wordFreq[n];
                                pairIndex = n;

                            }
                        }
                    }
                }
                starChar = null;
            }
        }
        i+=1;
    }
}
console.log("The Frequency Of Words:");
for (let t = 0 ; t<wordFreq.length ;t++){
    console.log(wordFreq[t]);
    
}
