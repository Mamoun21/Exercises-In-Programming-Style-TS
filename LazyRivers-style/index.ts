const fs = require('fs');
const lineByLine = require('n-readlines');
function* characters(filename: string): IterableIterator<any> {
    const liner = new lineByLine(filename);
    let line;
    while (line = liner.next()) {
        line = line.toString();
        for (let c of line) {
            yield c;
        }
    }
}
function* all_words(filename:string): IterableIterator<any>{
    let start_char:boolean = true;
    for(let c of (characters(filename).next().value)){
        let word:string = '';
        if(start_char==true){
            
            if("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1){
                word = c.toLowerCase();
                start_char=false;
            }
        }
        else{
            if("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) > -1){
                word+=c.toLowerCase();
            }
            else{
                start_char = true
                yield word;
            }
        }
    }
}
function* non_stop_words(filename:string): IterableIterator<any>{
    const readFile = fs.readFileSync('stop_Words.txt', 'utf8');
    let stop_words= readFile.split(',');
    let newArray=['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    for(let j in newArray)
    {
        stop_words.push(newArray[j]);
    }
    for(let w of (all_words(filename).next().value)){
        if(!(stop_words.indexOf(w)>-1)){
            yield w;
        }
    }
}
function* count_and_sort(filename:string): IterableIterator<any>{
    let freqs:any={};
    let i = 1;
    for(let w of (non_stop_words(filename).next().value)){
        if (w in freqs) {
            freqs[w] += 1;
        }
        else {
            freqs[w] = 1;
        }
        if(i%5000==0){
            yield sorted(freqs);
        }
        i+=1;
    }
    yield sorted(freqs);
}
function sorted(freqs:any) {
    let sortable = [];
    for (let key in freqs)
        if (freqs.hasOwnProperty(key))
            sortable.push([key,freqs[key]]);
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    freqs = sortable;
    return freqs;
}

for (let word_freqs of (count_and_sort('a.txt').next().value)){
    console.log("-----------------------------");
    for(let w in word_freqs){
        console.log(word_freqs[w]);
    }

}