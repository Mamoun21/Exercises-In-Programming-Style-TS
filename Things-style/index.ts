const fs = require('fs');
class DataStorageManager {
    private data;
    constructor(path_to_file) {
        this.data = [];
        let str_data = fs.readFileSync(path_to_file, 'utf8');
        let pattern = str_data;
        pattern = pattern.split('[\W_]+');
        str_data = pattern.toString().toLowerCase();
        str_data = str_data.split(' ').join(',');
        this.data = str_data;
    }
    words() {
        let w = this.data.toString().split(/\r?\n/);
        this.data = w.toString().split(',');
        return this.data;
    }
}
class StopWordManager {
    private stop_words;
    constructor() {
        let read_file = fs.readFileSync('stop_words.txt', 'utf8');
        this.stop_words = read_file.split(',')
        let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        for (let j = 0; j < newArray.length; j++) {
            this.stop_words.push(newArray[j]);
        }
    }
    is_stop_word(word) {
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
    increment_count(word) {
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
    constructor(path_to_file) {
        this.storage_manager = new DataStorageManager(path_to_file);
        this.stop_word_manager = new StopWordManager();
        this.word_freq_manager = new WordFrequencyManager();
    }
    run() {
        for (let w of this.storage_manager.words()) {
            if (!this.stop_word_manager.is_stop_word(w)) {
                this.word_freq_manager.increment_count(w);
            }
        }
        this.word_freqs = this.word_freq_manager.sorted();
        for (let w in this.word_freqs) {
            console.log(this.word_freqs[w])
        }

    }
}
new WordFrequencyController('a.txt').run();