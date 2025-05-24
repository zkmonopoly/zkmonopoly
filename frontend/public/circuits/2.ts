// THIS IS NOT TYPESCRIPT !!!
function isEqual(a: number, b: number): boolean {
  return a === b;
}

function isGreater(a: number, b: number): boolean {
  return a > b;
}

export default (io: Summon.IO) => {
  const a = io.input('alice', 'a', summon.number());
  const b = io.input('bob', 'b', summon.number());

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