const fs = require('fs');
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
read_file(path_to_file:string) {
    let readFile = fs.readFileSync(path_to_file, 'utf8');
    return readFile;
}
filter_chars(str_data) {
    let pattern = str_data;
    pattern = pattern.split('[\W_]+');
    str_data = pattern.toString();
    str_data = str_data.split(' ').join(',');
    return str_data;
}
normalize(str_data:string){
    return str_data.toLowerCase();
}
scan(str_data:string[]) {
    let a = str_data.toString().split(/\r?\n/);
    return a;
}
remove_stop_words(word_lis:string[]) {
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
frequencies(word_list:string[]) {
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
sort(word_freq:object){
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
print_all(word_freq:string[]) {
    let top = "";
    if (word_freq.length > 0) {
        for(let w in word_freq){
           top = top + word_freq[w] + "\n";
        }
    }
    return top;
}
}
let a= new TFTheOne('a.txt');
a.bind(a.read_file).bind(a.filter_chars).bind(a.normalize).bind(a.scan).bind(a.remove_stop_words).bind(a.frequencies).bind(a.sort).bind(a.print_all).printme();
