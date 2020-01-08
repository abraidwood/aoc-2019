
const inputStr = `
####.
.##..
##.#.
###..
##..#
`.trim();

const input = inputStr.split('\n').map(line => line.split('').map(char => char === '#' ? 1 : 0));


const states = [
    [...input.flat()],
    [...input.flat()]
];

const neighbours = [];

const width = input[0].length;
const height = input.length;

for(let j=0;j<height;j++) {
    for(let i=0;i<width;i++) {
        const n = j*width + i;
        const cellNeighbours = [];

        if(j !== 0) { cellNeighbours.push(n-width); }
        if(j !== height-1) { cellNeighbours.push(n+width); }
        if(i !== 0) { cellNeighbours.push(n-1); }
        if(i !== width-1) { cellNeighbours.push(n+1); }

        neighbours[n] = cellNeighbours;
    }
}

const p2 = [];
for(let j=0;j<height;j++) {
    for(let i=0;i<width;i++) {
        const n = j*width+i;
        p2[n] = 2**n;
    }
}

let step = 1;
const seen = new Set();

function run() {
    while(true) {
        step++;
        const last = states[step%2];
        const next = states[(step+1)%2];
        let bio = 0;

        for(let i=0;i<last.length;i++) {
            const current = last[i];
            const count = neighbours[i].reduce((acc, index) => acc + last[index], 0);
            let val;
            if(current && count !== 1) {
                val = 0;
            } else if (!current && (count === 1 || count === 2)) {
                val = 1;
            } else {
                val = current;
            }
            next[i] = val;
            bio += p2[i] * val;
        }

        if (seen.has(bio)) {
            console.log(`Step: ${step}, Bio: ${bio}`);
            break;
        } else {
            seen.add(bio);
        }
    }
}

function print(line) {
    const out = [];

    for(let j=0;j<height;j++) {
        const row = [];
        for(let i=0;i<width;i++) {
            row.push(line[j*width+i] ? '#' : '.');
        }
        out.push(row.join(''));
    }

    console.log(out.join('\n'))
}

run();