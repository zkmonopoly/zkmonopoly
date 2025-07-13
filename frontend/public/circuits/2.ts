// THIS IS NOT TYPESCRIPT !!!
function isEqual(a: number, b: number): boolean {
  return a === b;
}

function isGreater(a: number, b: number): boolean {
  return a > b;
}

export default (io: Summon.IO) => {
  let a = io.input('alice', 'a', summon.number());
  let b = io.input('bob', 'b', summon.number());
  const m = $1;

  if (isGreater(m, a)) {
    a = 0;
  }
  if (isGreater(m, b)) {
    b = 0;
  }

  let winner;

  if (isEqual(a, b)) {
    winner = 0;
  } else if (isGreater(a, b)) {
    winner = 1;
  } else {
    winner = 2;
  }

  io.outputPublic('winner', winner);
}