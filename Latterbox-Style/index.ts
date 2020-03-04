const fs = require('fs');
class DataStorageManager {
    private data: string[];
    constructor() {
        this.data = [];
    }
    dispatch(message) {
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
    init(path_to_file): void {
        let str_data = fs.readFileSync(path_to_file, 'utf8');
        let pattern = str_data;
        pattern = pattern.split('[\W_]+');
        str_data = pattern.toString().toLowerCase();
        str_data = str_data.split(' ').join(',');
        this.data = str_data;
    }
    words(): string[] {
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
        return this.data;
    }
}
class StopWordManager {
    private stop_words: string[];
    constructor() {
        this.stop_words = [];
    }
    dispatch(message) {
        if (message[0] == 'init') {
            return this.init();
        }
        else if (message[0] == 'is_stop_word') {
            return this.is_stop_word(message[1]);
        }
        else {
            throw ("Message not understood " + message[0]);
        }
    }
    init(): void {
        let read_file = fs.readFileSync('stop_words.txt', 'utf8');
        this.stop_words = read_file.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stop_words.push(newArray[j]);
        }
    }
    is_stop_word(word): string {
        if (this.stop_words.indexOf(word) > -1) {
            return word;
        }
    }
}
class WordFrequencyManager {
    private word_freqs: Object;
    constructor() {
        this.word_freqs = {};
    }
    dispatch(message) {
        if (message[0] == 'increment_count') {
            return this.increment_count(message[1]);
        }
        else if (message[0] == 'sorted') {
            return this.sorted();
        }
        else {
            throw ("Message not understood " + message[0]);
        }
    }
    increment_count(word): void {
        if (word in this.word_freqs) {
            this.word_freqs[word] += 1;
        }
        else {
            this.word_freqs[word] = 1;
        }
    }
    sorted() {
        let sortable = [];
        for (let key in this.word_freqs)
            if (this.word_freqs.hasOwnProperty(key))
                sortable.push([key, this.word_freqs[key]]);
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        this.word_freqs = sortable;
        return this.word_freqs;
    }
}
class WordFrequencyController {
    private storage_manager;
    private stop_word_manager;
    private word_freq_manager;
    private word_freqs;
    constructor() {

    }
    dispatch(message) {
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
    init(path_to_file): void {
        this.storage_manager = new DataStorageManager();
        this.stop_word_manager = new StopWordManager();
        this.word_freq_manager = new WordFrequencyManager();
        this.storage_manager.dispatch(['init', path_to_file]);
        this.stop_word_manager.dispatch(['init']);
    }
    run(): void {
        for (let w of this.storage_manager.dispatch(['words'])) {
            if (!this.stop_word_manager.dispatch(['is_stop_word', w])) {
                this.word_freq_manager.dispatch(['increment_count', w]);
            }
        }
        this.word_freqs = this.word_freq_manager.dispatch(['sorted']);
        for (let w in this.word_freqs) {
            console.log(this.word_freqs[w])
        }

    }
}
let wfcontroller:WordFrequencyController= new WordFrequencyController();
wfcontroller.dispatch(['init', 'a.txt']);
wfcontroller.dispatch(['run'])