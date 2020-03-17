const fileSystem = require('fs');
class TFTheOne{
private value;
constructor(v){
    this.value = v;
}
bind(func:Function){
  this.value = func(this.value);
  return this;
}
printme():void{
    console.log(this.value);
}
readFile(pathToFile:string) {
    let read = fileSystem.readFileSync(pathToFile, 'utf8');
    return read;
}
filterChars(strData) {
    let pattern = strData;
    pattern = pattern.split('[\W_]+');
    strData = pattern.toString();
    strData = strData.split(' ').join(',');
    return strData;
}
normalize(strData:string){
    return strData.toLowerCase();
}
scan(strData:string[]) {
    let a = strData.toString().split(/\r?\n/);
    return a;
}
removeStopWords(word_lis:string[]) {
    let read = fileSystem.readFileSync('stop_words.txt', 'utf8');
    let stopWords = read.split(',')
    let newArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for (let j = 0; j < newArray.length; j++) {
        stopWords.push(newArray[j]);
    }
    let list = [];
    for (let w of word_lis) {
        if (!(stopWords.indexOf(w) > -1)) {
            list.push(w);
        }
    }
    list = list.toString().split(',')
    return list;
}
frequencies(wordList:string[]) {
    let wordFreq :object = {};
    for (let w of wordList) {
        if (w in wordFreq) {
            wordFreq[w] += 1;
        }
        else {
            wordFreq[w] = 1;
        }
    }
    return wordFreq;
}
sort(wordFreq:object){
    let sorTable=[];
	for(let key in wordFreq)
		if(wordFreq.hasOwnProperty(key))
			sorTable.push([key, wordFreq[key]]);
	sorTable.sort(function(a, b)
	{
	  return b[1]-a[1]; 
	});
	return sorTable;
}
printAll(wordFreq:string[]) {
    let top = "";
    if (wordFreq.length > 0) {
        for(let w in wordFreq){
           top = top + wordFreq[w] + "\n";
        }
    }
    return top;
}
}
let a:TFTheOne= new TFTheOne('a.txt');
a.bind(a.readFile).bind(a.filterChars).bind(a.normalize).bind(a.scan).bind(a.removeStopWords).bind(a.frequencies).bind(a.sort).bind(a.printAll).printme();
