const fileSystem = require('fs');
function extractWord(pathToFile: string) {
    if (typeof pathToFile != 'string' && !pathToFile) {
        return [];
    }
    let strData;
    try {
        strData = fileSystem.readFileSync(pathToFile, 'utf8');
    }
    catch (err) {
        throw err;
    }
    let pattern = strData;
    pattern = pattern.split('[\W_]+').toString().toLowerCase();
    strData = pattern.split(' ').join(',').toString().split(/\r?\n/);
    return strData;
}
function removeStopWords(wordList) {
    if (typeof wordList != "object") {
        return [];
    }
    let stopWords: string[] = [];

    try {
        let read = fileSystem.readFileSync('stop_words.txt', 'utf8');
        stopWords = read.split(',');
    }
    catch (err) {
        throw err;
    }
    let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let j = 0; j < newArray.length; j++) {
        stopWords.push(newArray[j]);
    }
    let list = [];
    for (let w of wordList) {
        if (!(stopWords.indexOf(w) > -1)) {
            list.push(w);
        }
    }
    return list.toString().split(',');
}
function frequencies(wordList) {
    if (typeof wordList != "object" || wordList == []) {
        return {}
    }
    let wordFreqs: object = {};
    for (let w of wordList) {
        if (w in wordFreqs) {
            wordFreqs[w] += 1;
        }
        else {
            wordFreqs[w] = 1;
        }
    }
    return wordFreqs;
}
function sort(wordFreqs) {
    if (typeof wordFreqs != "object" || wordFreqs == {}) {
        return [];
    }
    let sorTable = [];
    for (let key in wordFreqs)
        if (wordFreqs.hasOwnProperty(key))
            sorTable.push([key, wordFreqs[key]]);
    sorTable.sort(function (a, b) {
        return b[1] - a[1];
    });
    return sorTable;
}
let fileName = 'a.txt';
let wordFreqs = sort(frequencies(removeStopWords(extractWord(fileName))));
for (let w in wordFreqs) {
    console.log(wordFreqs[w]);
}