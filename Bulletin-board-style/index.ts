const fileSystem = require('fs');
class EventManager{
    private subScriptions:Object;
    constructor(){
        this.subScriptions = {};
    }
    subScribe(eventType,handler){
        if(eventType in this.subScriptions){
            this.subScriptions[eventType].push(handler);
        }
        else{
            this.subScriptions[eventType]=[handler];
        }
    }
    publish(event){
        let eventType = event[0];
        if(eventType in this.subScriptions){
            for(let h of this.subScriptions[eventType]){
                h(event);
            }
        }
    }  
}
class DataStorage{
    private eventManager:EventManager = new EventManager();
    private data;
    constructor(eventManager:EventManager){
        this.eventManager = eventManager;
        this.eventManager.subScribe('load',this.load);
        this.eventManager.subScribe('start',this.produceWords);
    }
    load(event){
        let pathToFile = event[1];
        let strData = fileSystem.readFileSync(pathToFile, 'utf8');
        let pattern = strData;
        pattern = pattern.split('[\W_]+');
        strData = pattern.toString().toLowerCase();
        strData = strData.split(' ').join(',');
        this.data = strData;
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
    }
    produceWords(event){
        for (let w of this.data) {
            this.eventManager.publish(['word',w]);
        }
        this.eventManager.publish(['eof',null]);
    }
}
class StopWordFilter{
    private stopWords = [];
    private eventManager:EventManager= new EventManager();
    constructor(eventManager:EventManager){
        this.eventManager = eventManager;
        this.eventManager.subScribe('load', this.load)
        this.eventManager.subScribe('word', this.isStopWord)
    }
    load(event){
        let readFile = fileSystem.readFileSync('stop_words.txt', 'utf8');
        this.stopWords = readFile.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stopWords.push(newArray[j]);
        }
    }
    isStopWord(event){
        let word = event[1];
        if (!(this.stopWords.indexOf(word) > -1)) {
            this.eventManager.publish(['valid_word',word]);
        }
    }
}
class WordFrequencyCounter{
    private wordFreqs: Object;
    private eventManager:EventManager= new EventManager();
    constructor(eventManager:EventManager){
        this.eventManager = eventManager;
        this.eventManager.subScribe('valid_word',this.incrementCount);
        this.eventManager.subScribe('print',this.printFreqs);
    }
    incrementCount(event){
        let word = event[1];
        if (word in this.wordFreqs) {
            this.wordFreqs[word] += 1;
        }
        else {
            this.wordFreqs[word] = 1;
        }

    }
    printFreqs(event){
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
class WordFrequencyApplication{
    private eventManager:EventManager;
    constructor(event_manager:EventManager){
        this.eventManager = event_manager;
        this.eventManager.subScribe('run',this.run);
        this.eventManager.subScribe('start',this.stop);
}
run(event){
let pathToFile = event[1];
this.eventManager.publish(['load',pathToFile]);
this.eventManager.publish(['start',this.stop]);
}
stop(){
    this.eventManager.publish(['print',null]);
}
}
let eventManager:EventManager = new EventManager();
let dataStorage:DataStorage= new DataStorage(eventManager);
let stopWordFilter :StopWordFilter= new StopWordFilter(eventManager);
let wordFrequencyCounter:WordFrequencyCounter = new WordFrequencyCounter(eventManager);
let wordFrequencyApplication :WordFrequencyApplication= new WordFrequencyApplication(eventManager);
console.log(eventManager.publish(['run','a.txt']))

