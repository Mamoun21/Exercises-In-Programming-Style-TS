const fs = require('fs');
const assert = require('assert');
function extract_words(path_to_file: string) {
    assert(typeof path_to_file === "string", 'I need a string!');
    assert(path_to_file, 'I need a non-empty string!');
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
    assert(typeof word_list === "object", 'I need a list!');

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
    assert(typeof word_list === "object", 'I need a list!');
    assert(word_list != [], "I need a non-empty list!");
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
    assert(typeof word_freqs === 'object', "I need a object!");
    assert(word_freqs != {}, "I need a non-empty object!");
    let sortable = [];
    try {
        for (let key in word_freqs)
            if (word_freqs.hasOwnProperty(key))
                sortable.push([key, word_freqs[key]]);
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        return sortable;
    }
    catch (err) {
        console.log(err);
    }
}
try {
    assert('a.txt'.length > 1, 'You idiot! I need an input file!');
    let word_freqs = sort(frequencies(remove_stop_words(extract_words('a.txt'))));
    assert(typeof word_freqs === 'object', "OMG! This is not a list!");
    assert(word_freqs.length > 0, "Empty List");
    for (let w in word_freqs) {
        console.log(word_freqs[w]);
    }
} catch (error) {
    console.log(error)
}