const fs = require('fs');
function read_file(path_to_file) {
    let readFile = fs.readFileSync(path_to_file, 'utf8');
    return readFile;
}
function filter_chars_and_normalize(str_data) {
    let pattern = str_data;
    pattern = pattern.split('[\W_]+');
    str_data = pattern.toString().toLowerCase();
    str_data = str_data.split(' ').join(',');
    return str_data;
}
function scan(str_data) {
    let a = str_data.toString().split(/\r?\n/);
    return a;
}
function remove_stop_words(word_lis) {
    let read_file = fs.readFileSync('stop_words.txt', 'utf8');
    let stop_words = read_file.split(',')
    let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let j = 0; j < newArray.length; j++) {
        stop_words.push(newArray[j]);
    }
    let list = [];
    for (let w of word_lis) {
        if (!(stop_words.indexOf(w) > -1)) {
            list.push(w);
        }
    }
    list = list.toString().split(',')
    return list;
}
function frequencies(word_list) {
    let word_freq = {};
    for (let w of word_list) {
        if (w in word_freq) {
            word_freq[w] += 1;
        }
        else {
            word_freq[w] = 1;
        }
    }
    return word_freq;
}
function sort(word_freq){
    let sortable=[];
	for(let key in word_freq)
		if(word_freq.hasOwnProperty(key))
			sortable.push([key, word_freq[key]]);
	sortable.sort(function(a, b)
	{
	  return b[1]-a[1]; 
	});
	return sortable;
}
function print_all(word_freq) {
    if (word_freq.length > 0) {
        for(let w in word_freq){
            console.log(word_freq[w]);
        }
    }
}
print_all(sort(frequencies(remove_stop_words(scan(filter_chars_and_normalize(read_file('a.txt')))))));