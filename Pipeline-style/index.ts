const fileSystem = require('fs');
function readFile(pathToFile) {
    let read = fileSystem.readFileSync(pathToFile, 'utf8');
    return read;
}
function filterCharsAndNormalize(strData) {
    let pattern = strData;
    pattern = pattern.split('[\W_]+');
    strData = pattern.toString().toLowerCase();
    strData = strData.split(' ').join(',');
    return strData;
}
function scan(strData) {
    let a = strData.toString().split(/\r?\n/);
    return a;
}
function removeStopWords(wordList) {
    let read = fileSystem.readFileSync('stop_words.txt', 'utf8');
    let stopWords = read.split(',')
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
    list = list.toString().split(',')
    return list;
}
function frequencies(wordList) {
    let wordFreqs = {};
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
function sort(wordFreqs){
    let sorTable=[];
	for(let key in wordFreqs)
		if(wordFreqs.hasOwnProperty(key))
			sorTable.push([key, wordFreqs[key]]);
	sorTable.sort(function(a, b)
	{
	  return b[1]-a[1]; 
	});
	return sorTable;
}
function printAll(wordFreqs) {
    if (wordFreqs.length > 0) {
        for(let w in wordFreqs){
            console.log(wordFreqs[w]);
        }
    }
}
printAll(sort(frequencies(removeStopWords(scan(filterCharsAndNormalize(readFile('a.txt')))))));