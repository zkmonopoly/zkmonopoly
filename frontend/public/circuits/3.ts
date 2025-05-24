// THIS IS NOT TYPESCRIPT !!!
function isGreater(a: number, b: number): boolean {
  return a > b;
}

export default (io: Summon.IO) => {
  const a = io.input('alice', 'a', summon.number());
  const b = io.input('bob', 'b', summon.number());
  const c = io.input('charlie', 'c', summon.number());

  let winner;
  if (isGreater(a, b) && isGreater(a, c)) {
    winner = 1;
  } else if (isGreater(b, a) && isGreater(b, c)) {
    winner = 2;
  } else if (isGreater(c, a) && isGreater(c, b)) {
    winner = 3;
  } else {
    winner = 0;
  }
  io.outputPublic('winner', winner);
}