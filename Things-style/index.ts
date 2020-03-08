const fileSytem = require('fs');
class DataStorageManager {
    private data;
    constructor(pathToFile) {
        this.data = [];
        let strData = fileSytem.readFileSync(pathToFile, 'utf8');
        let pattern = strData;
        pattern = pattern.split('[\W_]+');
        strData = pattern.toString().toLowerCase();
        strData = strData.split(' ').join(',');
        this.data = strData;
    }
    words() {
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
        return this.data;
    }
}
class StopWordManager {
    private stopWords;
    constructor() {
        let readFile = fileSytem.readFileSync('stop_words.txt', 'utf8');
        this.stopWords = readFile.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stopWords.push(newArray[j]);
        }
    }
    isStopWord(word) {
        if (this.stopWords.indexOf(word) > -1) {
            return word;
        }
    }
}
class WordFrequencyManager {
    private wordFreqs: Object;
    constructor() {
        this.wordFreqs = {};
    }
    incrementCount(word) {
        if (word in this.wordFreqs) {
            this.wordFreqs[word] += 1;
        }
        else {
            this.wordFreqs[word] = 1;
        }
    }
    sorted() {
        let sorTable = [];
        for (let key in this.wordFreqs)
            if (this.wordFreqs.hasOwnProperty(key))
                sorTable.push([key, this.wordFreqs[key]]);
        sorTable.sort(function (a, b) {
            return b[1] - a[1];
        });
        this.wordFreqs = sorTable;
        return this.wordFreqs;
    }
}
class WordFrequencyController {
    private storageManager;
    private stopWordManager;
    private wordFreqManager;
    private wordFreqs;
    constructor(pathToFile) {
        this.storageManager = new DataStorageManager(pathToFile);
        this.stopWordManager = new StopWordManager();
        this.wordFreqManager = new WordFrequencyManager();
    }
    run() {
        for (let w of this.storageManager.words()) {
            if (!this.stopWordManager.isStopWord(w)) {
                this.wordFreqManager.incrementCount(w);
            }
        }
        this.wordFreqs = this.wordFreqManager.sorted();
        for (let w in this.wordFreqs) {
            console.log(this.wordFreqs[w])
        }

    }
}
new WordFrequencyController('a.txt').run();