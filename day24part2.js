const t1 = performance.now();
const inputStr = `
####.
.##..
##.#.
###..
##..#
`.trim();

const input = inputStr.split('\n').map(line => line.split('').map(char => char === '#' ? 1 : char === '?' ? 2 : 0));

const width = input[0].length;
const height = input.length;
const length = width * height;
const layerCount = 203;
const zeroLayer = Math.floor(layerCount / 2);

const layer = Array(length * layerCount).fill(0);
layer.splice(length * zeroLayer, length, ...input.flat());
const layerLength = layer.length;

const tN = performance.now();

const neighbours = [];
for(let d=0;d<=layerCount;d++) {
    const pos = d * length;
    const prevD = pos - length;
    const nextD = pos + length;

    for(let j=0;j<height;j++) {
        for(let i=0;i<width;i++) {
            const n = j*width + i;
            const np = n + pos;

            if (n === 12) {
                layer[np] = 2;
                neighbours[np] = [];
            } else {
                const cellNeighbours = [];

                if(j !== 0 && n !== 17) { cellNeighbours.push(np-width); }
                if(j !== height-1 && n !== 7) { cellNeighbours.push(np+width); }
                if(i !== 0 && n !== 13) { cellNeighbours.push(np-1); }
                if(i !== width-1 && n !== 11) { cellNeighbours.push(np+1); }

                if(j === 0) { cellNeighbours.push(prevD+7); }
                if(j === height-1) { cellNeighbours.push(prevD+17); }
                if(i === 0) { cellNeighbours.push(prevD+11); }
                if(i === width-1) { cellNeighbours.push(prevD+13); }

                switch(n) {
                    case 7: cellNeighbours.push(nextD+ 0, nextD+ 1, nextD+ 2, nextD+ 3, nextD+ 4); break;
                    case 17:cellNeighbours.push(nextD+20, nextD+21, nextD+22, nextD+23, nextD+24); break;
                    case 11:cellNeighbours.push(nextD+ 0, nextD+ 5, nextD+10, nextD+15, nextD+20); break;
                    case 13:cellNeighbours.push(nextD+ 4, nextD+ 9, nextD+14, nextD+19, nextD+24); break;
                }

                neighbours[np] = cellNeighbours;
            }
        }
    }
}

const tNE = performance.now();
const states = [
    layer.slice(0),
    layer.slice(0)
];

let firstCell = length * zeroLayer - length;
let lastCell = length * zeroLayer + 2 * length;

let step=0;
function run() {
    step++;
    const last = states[step%2];
    const next = states[(step+1)%2];

    let newFirst = -1;
    let newLast = length;

    for(let i=firstCell;i<lastCell;i++) {
        if (i%25 !== 12) {
            const current = last[i];
            const list = neighbours[i];
            let count = 0;

            for(let j=0;count<3 && j<list.length;j++) {
                const k = list[j]
                count += last[k];
            }

            if(current === 0) {
                next[i] = count === 1 || count === 2 ? 1 : current;
            } else {
                next[i] = count !== 1 ? 0 : current;
            }

            if (next[i] === 1) {
                newFirst = newFirst === -1 ? i : newFirst;
                newLast = i;
            }
        }
    }
    firstCell = Math.max(0, length * (Math.floor(newFirst/length)-1));
    lastCell = Math.min(layerLength, length * (Math.ceil(newLast/length)+1));
}

function print(depth, runNo) {
    const line = states[runNo%2];
    const startIndex = (zeroLayer+depth) * length;
    const out = [];

    for(let j=0;j<height;j++) {
        const row = [];
        for(let i=0;i<width;i++) {
            const val = line[startIndex + j*width+i];
            row.push(val === 1 ? '#' : val === 2 ? '?' : '.');
        }
        out.push(row.join(''));
    }

    console.log(out.join('\n'))
}

while(step<200) {
    run();
}
const bugs = states[(step+1)%2].reduce((a, x) => a + (x === 1 ? 1 : 0), 0);
console.log(tNE - tN, performance.now() - t1)
console.log(`Bugs: ${bugs}`);
