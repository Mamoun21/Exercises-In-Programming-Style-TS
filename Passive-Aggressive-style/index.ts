const fileSystem = require('fs');
const assert = require('assert');
function extractWords(pathToFile: string) {
    assert(typeof pathToFile === "string", 'I need a string! I quit!');
    assert(pathToFile, 'I need a non-empty string! I quit!');
    let strData = fileSystem.readFileSync(pathToFile, 'utf8');
    let pattern = strData;
    pattern = pattern.split('[\W_]+').toString().toLowerCase();
    strData = pattern.split(' ').join(',').toString().split(/\r?\n/);
    return strData;
}
function removeStopWords(wordList) {
    assert(typeof wordList === "object", 'I need a list! I quit!');
    let read = fileSystem.readFileSync('stop_words.txt', 'utf8');
    let stopWords:string[] = read.split(',');
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
    assert(typeof wordList === "object", 'I need a list! I quit!');
    assert(wordList != [], "I need a non-empty list! I quit!");
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
    assert(typeof wordFreqs === 'object', "I need a object! I quit!");
    assert(wordFreqs != {}, "I need a non-empty object! I quit!");
    let sortAble = [];
        for (let key in wordFreqs)
            if (wordFreqs.hasOwnProperty(key))
                sortAble.push([key, wordFreqs[key]]);
        sortAble.sort(function (a, b) {
            return b[1] - a[1];
        });
        return sortAble;
}
try {
    assert('a.txt'.length > 1, 'You idiot! I need an input file! I quit!');
    let wordFreqs = sort(frequencies(removeStopWords(extractWords('a.txt'))));
    assert(wordFreqs.length > 0, "Empty List");
    for (let w in wordFreqs) {
        console.log(wordFreqs[w]);
    }
} catch (error) {
    throw error;
}