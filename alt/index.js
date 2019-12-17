const fs = require('fs'),

ex1 = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0],
ex1p = [4,3,2,1,0],
//should return 43210 - good

ex2 = [3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0],
ex2p = [0,1,2,3,4],
//should return 54321 - good

ex3 = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0],
ex3p = [1,0,4,3,2],
//should return 65210 - good

ex4 = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5],
ex4p = [9,8,7,6,5],
//thrust should return 139629729 - good

ex5 = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10],
ex5p = [9,7,8,5,6],
//thrust should return 18216 - good

day5 = fs.readFileSync('day5input.txt').toString().split(',').map(a=>parseInt(a));

class Amp {
  constructor(arr, p) {
    this.commSet = Array.from(arr);
    this.i = 0;
    this.comm = null;
    this.phase = p;
    this.halt = null;
  }
  intcode(commS, input=0, pointer, phase) {
  let initial = commS,
      i = pointer,
      result;
  while (i < initial.length){
    let comp,
        comm = initial[i].toString();
    comm = "0".repeat(4-comm.length) + comm;
    let opcode = comm.length > 2 ? parseInt(comm.substr(comm.length-2)) : parseInt(comm),
        ops = {
      1: [comm.charAt(1), initial[i+1]],
      2: [comm.charAt(0), initial[i+2]],
      3: initial[i+3]
    };
    switch (opcode) {
      case 99:
        //console.log(`99: Intcode returned ${result} and will now halt`);
        result = input;
        this.commSet = initial;
        this.i = i;
        this.comm = (!result ? input : result)
        this.halt = true;
        this.phase = null;
        return {comm: this.comm, halt: this.halt};
        break;
      case 1:
        initial[ops[3]] = (ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]) + (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]);
        i += 4;
        break;
      case 2:
        initial[ops[3]] = (ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]) * (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]);
        i += 4;
        break;
      case 3:
        initial[ops[1][1]] = i == 0 ? (!phase ? input : phase) : input;
        let str = i == 0 ? (!phase ? input : 'phase') : 'input'
        //console.log(`case 3 implemented using ${str} at pointer ${i}`);
        i += 2;
        break;
      case 4:
        result = (ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]);
        i += 2;
        //console.log(`case 4 - result returned as ${result}, pointer stored at ${i}`);
        this.commSet = initial;
        this.i = i;
        this.comm = result;
        this.phase = null;
        return {comm: this.comm, halt: this.halt};
        break;
      case 5:
        comp = (ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]);
        if (comp != 0) {
          i = (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]);
        } else {
          i += 3;
        }
        break;
      case 6:
        comp = (ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]);
        if (comp == 0) {
          i = (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]);
        } else {
          i += 3;
        }
        break;
      case 7:
        initial[ops[3]]  = ((ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]) < (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]) ? 1 : 0);
        i += 4;
        break;
      case 8:
        initial[ops[3]]  = ((ops[1][0] == 0 ? initial[ops[1][1]] : ops[1][1]) == (ops[2][0] == 0 ? initial[ops[2][1]] : ops[2][1]) ? 1 : 0);
        i += 4;
        break;
      default:
        return `Opration failed`;
        break;
      }
    }
  }
}

const thrust = (arr1, arr2) => {
  let i = 0;
  let halt = null;
  let loops = 0;
  let amps = {
        a: new Amp(arr1, arr2[0]),
        b: new Amp(arr1, arr2[1]),
        c: new Amp(arr1, arr2[2]),
        d: new Amp(arr1, arr2[3]),
        e: new Amp(arr1, arr2[4]),
      };
  let l = Object.keys(amps);
  let res = {comm: null, halt: null};
  while (i < l.length) {
    let a = amps[l[i]];
    res = a.intcode(a.commSet, (res.comm || a.comm), a.i, a.phase);
    if (l[i] === 'e') {
      if (res.halt == true) {
        i = l.length;
        return res.comm;
      } else {
        i = 0;
      }
    } else {
      i++;
    }
  }
},

getAllPermutations = (str) => {  //url in randomizer.txt
  let results = [];
  if (str.length === 1) {
    results.push(str);
    return results;
  }
  for (var i = 0; i < str.length; i++) {
    var firstChar = str[i];
    var charsLeft = str.substring(0, i) + str.substring(i + 1);
    var innerPermutations = getAllPermutations(charsLeft);
    for (var j = 0; j < innerPermutations.length; j++) {
      results.push(firstChar + innerPermutations[j]);
    }
  }
  return results;
},

maxThrust = (arr, mode) => {
  let phase = !mode ? "01234" : "56789",
      tries = getAllPermutations(phase).map(a=>a.split('').map(b=>parseInt(b))),
      maxPhaseSeq,
      max = 0;

      tries.forEach(a => {
    let t = thrust(arr, a);
    console.log(a, t)
    max = t > max ? t : max;
  });
  return max;
};


//thrust(ex1, ex1p); //43210
//thrust(ex2, ex2p); //54321
//thrust(ex3, ex3p); //65210
//thrust(ex4, ex4p); //139629729 - returns 139629729
//thrust(ex5, ex5p); //18216 - returns 18216
console.log(maxThrust(day5, 1)); // returns 7818398 - good