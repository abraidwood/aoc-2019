
const inputStr = `
9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL
`.trim();

const path = {};

const input = inputStr.split('\n');
input.forEach(reaction => {
    const [reagentsStr, result] = reaction.split(' => ');
    const reagents = reagentsStr.split(', ');

    const [resultQty, resultName] = result.split(' ');

    path[resultName] = reagents.reduce((acc, ingredient) => {
        const [a, b] = ingredient.split(' ');
        acc[b] = parseInt(a,10) / parseInt(resultQty,10);
        acc._min = parseInt(a)

        if(reagents.length === 1 && b === 'ORE') {
            acc._stop = true;
        }
        return acc;
    }, {});
})

console.log(path)

function getSum(key, mul = 1, acc = {}) {
    const plan = path[key];

    Object.keys(plan).filter(s => !s.startsWith('_')).forEach(k => {
        if(k === 'ORE') {
            acc[key] = (acc[key] || 0) + mul * plan[k];
        } else {
            getSum(k, mul * plan[k], acc);
        }
    })

    return acc;
}

const amounts = {};
function getAmounts(key, mul = 1) {
    const plan = path[key];

    Object.keys(plan).filter(s => !s.startsWith('_')).forEach(k => {
        if (k !== 'ORE') {
            amounts[k] += plan[k] * mul;
            getAmounts(k, mul);
        }
    });
}

const parts = getAmounts('FUEL');
console.log(amounts);
// Object.keys(parts).map(key => path[key]._min * Math.ceil(parts[key]/path[key]._min)).reduce((a, x) => a+x)
