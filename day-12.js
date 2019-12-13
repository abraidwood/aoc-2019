
// const original = [
//     { x:  -1, y: 0, z: 2, vx: 0, vy: 0, vz: 0 },
//     { x: 2, y: -10, z: -7, vx: 0, vy: 0, vz: 0 },
//     { x: 4, y: -8, z:  8, vx: 0, vy: 0, vz: 0 },
//     { x:3, y: 5, z: -1, vx: 0, vy: 0, vz: 0 }
// ];


// const moons = [
//     { x:   4, y: 12, z: 13, vx: 0, vy: 0, vz: 0 },
//     { x:  -9, y: 14, z: -3, vx: 0, vy: 0, vz: 0 },
//     { x:  -7, y: -1, z:  2, vx: 0, vy: 0, vz: 0 },
//     { x: -11, y: 17, z: -1, vx: 0, vy: 0, vz: 0 }
// ];


(() => {
    const pe = m => Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z);
    const ke = m => Math.abs(m.vx) + Math.abs(m.vy) + Math.abs(m.vz);

    const original = [
        { x:  4, y: 12, z: 13, vx: 0, vy: 0, vz: 0 },
        { x: -9, y: 14, z: -3, vx: 0, vy: 0, vz: 0 },
        { x: -7, y: -1, z:  2, vx: 0, vy: 0, vz: 0 },
        { x:-11, y: 17, z: -1, vx: 0, vy: 0, vz: 0 }
    ];

    const moons = [
        { x:  4, y: 12, z: 13, vx: 0, vy: 0, vz: 0 },
        { x: -9, y: 14, z: -3, vx: 0, vy: 0, vz: 0 },
        { x: -7, y: -1, z:  2, vx: 0, vy: 0, vz: 0 },
        { x:-11, y: 17, z: -1, vx: 0, vy: 0, vz: 0 }
    ]
    // .map(m => ({
    //     ...m,
    //     pe: pe(m),
    //     ke: ke(m)
    // }));

    const pairs = [
        [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]
    ];

    function gravity() {
        pairs.forEach(([a, b]) => {
            const m1 = moons[a];
            const m2 = moons[b]
            if (m1.x < m2.x) { m1.vx++; m2.vx--; } else if (m1.x > m2.x) { m1.vx--; m2.vx++; }
            // if (m1.y < m2.y) { m1.vy++; m2.vy--; } else if (m1.y > m2.y) { m1.vy--; m2.vy++; }
            // if (m1.z < m2.z) { m1.vz++; m2.vz--; } else if (m1.z > m2.z) { m1.vz--; m2.vz++; }
        });
    }

    function velocity() {
        moons.forEach(m1 => {
            m1.x += m1.vx;
            // m1.y += m1.vy;
            // m1.z += m1.vz;
        });
    }

    const energy = () => moons.reduce((p, m) => (
        p + pe(m) * ke(m)
    ), 0);

    const totalPE = () => moons.reduce((p, m) => (
        p + pe(m)
    ), 0);

    function output() {
        const [m1, m2, m3, m4] = moons;

        console.log(`
        After ${t} steps:
        pos=<x=${String(m1.x).padStart(6, ' ')}, y=${String(m1.y).padStart(6, ' ')}, z=${String(m1.z).padStart(6, ' ')}>, vel=<x=${String(m1.vx).padStart(6, ' ')}, y=${String(m1.vy).padStart(6, ' ')}, z=${String(m1.vz).padStart(6, ' ')}>
        pos=<x=${String(m2.x).padStart(6, ' ')}, y=${String(m2.y).padStart(6, ' ')}, z=${String(m2.z).padStart(6, ' ')}>, vel=<x=${String(m2.vx).padStart(6, ' ')}, y=${String(m2.vy).padStart(6, ' ')}, z=${String(m2.vz).padStart(6, ' ')}>
        pos=<x=${String(m3.x).padStart(6, ' ')}, y=${String(m3.y).padStart(6, ' ')}, z=${String(m3.z).padStart(6, ' ')}>, vel=<x=${String(m3.vx).padStart(6, ' ')}, y=${String(m3.vy).padStart(6, ' ')}, z=${String(m3.vz).padStart(6, ' ')}>
        pos=<x=${String(m4.x).padStart(6, ' ')}, y=${String(m4.y).padStart(6, ' ')}, z=${String(m4.z).padStart(6, ' ')}>, vel=<x=${String(m4.vx).padStart(6, ' ')}, y=${String(m4.vy).padStart(6, ' ')}, z=${String(m4.vz).padStart(6, ' ')}>
        tot=${String(energy()).padStart(6, ' ')}
    `)
    }

    let t = 0;
    function timeStep() {
        gravity();
        velocity();
        t++;
    }


    const maxT = 1000000000;
    const initialPE = totalPE();
    let matches = 0;

    const originalString = JSON.stringify(original);

    const t1 = performance.now();
    while (true) {
        timeStep();
        if (initialPE === totalPE()) {
            matches++;
            if (JSON.stringify(moons) === originalString) {
                break;
            }
        }
        if (t % 100000000 === 0) {
            console.log(t, performance.now() - t1);
        }
    }
    console.log(t, matches, performance.now() - t1);
    output()
})();
