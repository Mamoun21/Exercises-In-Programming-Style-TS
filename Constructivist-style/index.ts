const fs = require('fs');
function extract_word(path_to_file: string) {
    if (typeof path_to_file != 'string' && !path_to_file) {
        return [];
    }
    let str_data;
    try {
        str_data = fs.readFileSync(path_to_file, 'utf8');
    }
    catch (err) {
        console.log(err);
    }
    let pattern = str_data;
    pattern = pattern.split('[\W_]+').toString().toLowerCase();
    str_data = pattern.split(' ').join(',').toString().split(/\r?\n/);
    return str_data;
}
function remove_stop_words(word_list) {
    if (typeof word_list != "object") {
        return [];
    }
    let stop_words: string[] = [];

    try {
        let read_file = fs.readFileSync('stop_words.txt', 'utf8');
        stop_words = read_file.split(',');
    }
    catch (err) {
        console.log(err);
    }
    let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let j = 0; j < newArray.length; j++) {
        stop_words.push(newArray[j]);
    }
    let list = [];
    for (let w of word_list) {
        if (!(stop_words.indexOf(w) > -1)) {
            list.push(w);
        }
    }
    return list.toString().split(',');
}
function frequencies(word_list) {
    if (typeof word_list != "object" || word_list == []) {
        return {}
    }
    let word_freqs: object = {};
    for (let w of word_list) {
        if (w in word_freqs) {
            word_freqs[w] += 1;
        }
        else {
            word_freqs[w] = 1;
        }
    }
    return word_freqs;
}
function sort(word_freqs) {
    if (typeof word_freqs != "object" || word_freqs == {}) {
        return [];
    }
    let sortable = [];
    for (let key in word_freqs)
        if (word_freqs.hasOwnProperty(key))
            sortable.push([key, word_freqs[key]]);
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    return sortable;
}
let filename = 'a.txt';
let word_freqs = sort(frequencies(remove_stop_words(extract_word(filename))));
for (let w in word_freqs) {
    console.log(word_freqs[w]);
}