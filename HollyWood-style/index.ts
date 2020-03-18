const fileSystem = require('fs');
class WordFrequencyFramework {
    private loadEventHandlers = [];
    private doworkEventHandlers = [];
    private endEventHandlers = [];
    registerForLoadEvent(handler) {
        this.loadEventHandlers.push(handler)
    }
    registerForDoworkEvent(handler) {
        this.doworkEventHandlers.push(handler);
    }
    registerForEndEvent(handler) {
        this.endEventHandlers.push(handler);
    }
    run(pathToFile) {
        for (let h of this.loadEventHandlers) {
            h(pathToFile);
        }
        for (let h of this.doworkEventHandlers) {
            h()
        }
        for (let h of this.endEventHandlers) {
            h()
        }
    }
}
class DataStorage {
    private data: string[];
    private stopWordFilter:StopWordFilter;
    private wordEventHandlers = [];
    constructor(wFApp, stopWordFilter: StopWordFilter) {
        this.stopWordFilter = stopWordFilter;
        wFApp.registerForLoadEvent(this.load);
        wFApp.registerForDoworkEvent(this.produceWords);
        this.data = [];
    }
    load(pathToFile:string):void {
        let strData = fileSystem.readFileSync(pathToFile, 'utf8');
        let pattern = strData;
        pattern = pattern.split('[\W_]+');
        strData = pattern.toString().toLowerCase();
        strData = strData.split(' ').join(',');
        this.data = strData;
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
    }
    produceWords() {
        let strData =this.data;
        for (let w of strData) {
            if (!this.stopWordFilter.isStopWord(w)) {
                for (let h of this.wordEventHandlers) {
                    h(w)
                }
            }
        }

    }
    registerForWordEvent(handler):void {
        this.wordEventHandlers.push(handler)
    }
}
class StopWordFilter {
    private stopWords :string[]= [];
    constructor(wFApp:WordFrequencyFramework) {
        wFApp.registerForLoadEvent(this.load);
    }
    load():void {
        let readFile = fileSystem.readFileSync('stop_words.txt', 'utf8');
        this.stopWords = readFile.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stopWords.push(newArray[j]);
        }
    }
    isStopWord(word:string):string{
        if (this.stopWords.indexOf(word) > -1) {
            return word;
        }
    }
}
class WordFrequencyCounter {
    private wordFreqs: Object;
    constructor(wFApp:WordFrequencyFramework, dataStorage:DataStorage) {
        dataStorage.registerForWordEvent(this.incrementCount);
        wFApp.registerForEndEvent(this.printFreqs);
    }
    incrementCount(word:string):void {
        if (word in this.wordFreqs) {
            this.wordFreqs[word] += 1;
        }
        else {
            this.wordFreqs[word] = 1;
        }
    }
    printFreqs() :void{
        let sortAble = [];
        for (let key in this.wordFreqs)
            if (this.wordFreqs.hasOwnProperty(key))
                sortAble.push([key, this.wordFreqs[key]]);
        sortAble.sort(function (a, b) {
            return b[1] - a[1];
        });
        this.wordFreqs = sortAble;
        for (let w in this.wordFreqs) {
            console.log(this.wordFreqs[w])
        }
    }
}
let wFApp: WordFrequencyFramework = new WordFrequencyFramework();
let stopWordFilter: StopWordFilter = new StopWordFilter(wFApp);
let dataStorage: DataStorage = new DataStorage(wFApp, stopWordFilter);
let wordFreqCounter:WordFrequencyCounter = new WordFrequencyCounter(wFApp,dataStorage);
wFApp.run('a.txt');

