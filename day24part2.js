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
const layerCount = 403;
const zeroLayer = Math.floor(layerCount / 2);

const layer = Array(length * layerCount).fill(0);
layer.splice(length * zeroLayer, length, ...input.flat());

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

const states = [
    [...layer.flat()],
    [...layer.flat()]
];

let step=0;
function run() {
    step++;
    const last = states[step%2];
    const next = states[(step+1)%2];

    for(let i=0;i<last.length;i++) {
        const current = last[i];
        if (current === 2) {continue;}
        const count = neighbours[i].reduce((acc, index) => acc + last[index]||0, 0);
        let val;
        if(current && count !== 1) {
            val = 0;
        } else if (!current && (count === 1 || count === 2)) {
            val = 1;
        } else {
            val = current;
        }
        next[i] = val;
    }
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
console.log(`Bugs: ${bugs}`);
