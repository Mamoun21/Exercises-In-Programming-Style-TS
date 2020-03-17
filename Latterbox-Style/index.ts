const fileSystem = require('fs');
class DataStorageManager {
    private data: string[];
    constructor() {
        this.data = [];
    }
    disPatch(message) {
        if (message[0] == 'init') {
            return this.init(message[1])
        }
        else if (message[0] == 'words') {
            return this.words();
        }
        else {
            throw ("Message not understood " + message[0]);
        }


    }
    init(pathToFile): void {
        let strData = fileSystem.readFileSync(pathToFile, 'utf8');
        let pattern = strData;
        pattern = pattern.split('[\W_]+');
        strData = pattern.toString().toLowerCase();
        strData = strData.split(' ').join(',');
        this.data = strData;
    }
    words(): string[] {
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
        return this.data;
    }
}
class StopWordManager {
    private stopWords: string[];
    constructor() {
        this.stopWords = [];
    }
    disPatch(message) {
        if (message[0] == 'init') {
            return this.init();
        }
        else if (message[0] == 'is_stop_word') {
            return this.isStopWord(message[1]);
        }
        else {
            throw ("Message not understood " + message[0]);
        }
    }
    init(): void {
        let readFile = fileSystem.readFileSync('stop_words.txt', 'utf8');
        this.stopWords = readFile.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stopWords.push(newArray[j]);
        }
    }
    isStopWord(word): string {
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
    disPatch(message) {
        if (message[0] == 'increment_count') {
            return this.incrementCount(message[1]);
        }
        else if (message[0] == 'sorted') {
            return this.sorted();
        }
        else {
            throw ("Message not understood " + message[0]);
        }
    }
    incrementCount(word): void {
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
    disPatch(message) {
        if (message[0] == 'init') {
            return this.init(message[1]);
        }
        else if (message[0] == 'run') {
            return this.run();
        }
        else {
            throw ("Message not understood " + message[0]);
        }
    }
    init(pathToFile): void {
        this.storageManager = new DataStorageManager();
        this.stopWordManager = new StopWordManager();
        this.wordFreqManager = new WordFrequencyManager();
        this.storageManager.disPatch(['init', pathToFile]);
        this.stopWordManager.disPatch(['init']);
    }
    run(): void {
        for (let w of this.storageManager.disPatch(['words'])) {
            if (!this.stopWordManager.disPatch(['is_stop_word', w])) {
                this.wordFreqManager.disPatch(['increment_count', w]);
            }
        }
        this.wordFreqs = this.wordFreqManager.disPatch(['sorted']);
        for (let w in this.wordFreqs) {
            console.log(this.wordFreqs[w])
        }

    }
}
let wordFrequencyController:WordFrequencyController= new WordFrequencyController();
wordFrequencyController.disPatch(['init', 'a.txt']);
wordFrequencyController.disPatch(['run'])