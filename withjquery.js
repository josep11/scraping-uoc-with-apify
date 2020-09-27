let text = $('html').innerText;

let subj = {};
subj.evMode = [];

if (text.includes('AC: AC')) {
    subj.evMode.push('AC');
}

if (text.includes('EX: EX + AC')) {
    subj.evMode.push('EX+AC');
}

if (text.includes('AC + PS')) {
    subj.evMode.push('AC+PS');
}

subj.name = $('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td.subTAULA > font').innerText;

console.log(subj);


