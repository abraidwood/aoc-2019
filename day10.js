
const inputString = `
#..#.#.###.#...##.##....
.#.#####.#.#.##.....##.#
##..#.###..###..#####..#
####.#.#..#....#..##.##.
.#######.#####...#.###..
.##...#.#.###..###.#.#.#
.######.....#.###..#....
.##..##.#..#####...###.#
#######.#..#####..#.#.#.
.###.###...##.##....##.#
##.###.##.#.#..####.....
#.#..##..#..#.#..#####.#
#####.##.#.#.#.#.#.#..##
#...##.##.###.##.#.###..
####.##.#.#.####.#####.#
.#..##...##..##..#.#.##.
###...####.###.#.###.#.#
..####.#####..#####.#.##
..###..###..#..##...#.#.
##.####...##....####.##.
####..#..##.#.#....#..#.
.#..........#..#.#.####.
###..###.###.#.#.#....##
########.#######.#.##.##
`.trim();



const input = inputString.split('\n')
    .map(
        (line, y) => line.split('')
            .map((char, x) => char === '#' ? [x, y] : null)
            .filter(Boolean)
    )
    .flat();


const part1 = input.map((_, i) => {
    const sets = {};
    sets['ne'] = new Set();
    sets['se'] = new Set();
    sets['sw'] = new Set();
    sets['nw'] = new Set();

    for(j=0;j<input.length;j++) {
        if(j === i) {continue;}

        const dx = input[j][0] - input[i][0];
        const dy = input[j][1] - input[i][1];

        sets[
            (dy < 0 ? 's' : 'n') + (dx < 0 ? 'w' : 'e')
        ].add(dy / dx);
    }

    return {
        coords: input[i],
        count: Object.values(sets).reduce((a, s) => a += s.size, 0)
    };
}).reduce((acc, ast) => ast.count > acc.count ? ast : acc, {count: 0});

console.log(`part1: ${JSON.stringify(part1)}`)

const part2 = input.map(target => {
    if (target[0] === part1.coords[0] && target[1] === part1.coords[1]) {return;}

    const dx = target[0] - part1.coords[0];
    const dy = target[1] - part1.coords[1];

    const angle = (dx === 0 ? (dy < 0 ? -Math.PI * 0.5 : Math.PI * 0.5) : dy === 0 ? (dx < 0 ? Math.PI : 0) : dx<0 ? Math.atan(dy/dx) + Math.PI : Math.atan(dy/dx)) + Math.PI/2;

    const distance = dx * dx + dy * dy;

    return {
        angle,
        distance,
        target
    };
}).filter(Boolean).sort((a, b) => a.angle - b.angle || a.distance - b.distance);

let lastAngle = Math.NaN;

let m=0;
let n=1;

while(n<210) {
    const angle = part2[m].angle;
    if (angle !== lastAngle) {
        if(n === 200) {
            console.log(`part2: ${JSON.stringify(part2.splice(m, 1))}`);
        }
        lastAngle = angle;
        n++;
    } else {
        m++;
    }
}