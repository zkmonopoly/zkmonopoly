// THIS IS NOT TYPESCRIPT !!!
function isGreater(a: number, b: number): boolean {
  return a > b;
}

export default (io: Summon.IO) => {
  let a = io.input('alice', 'a', summon.number());
  let b = io.input('bob', 'b', summon.number());
  let c = io.input('charlie', 'c', summon.number());
  let d = io.input('david', 'd', summon.number());
  const m = $1;

  if (isGreater(m, a)) {
    a = 0;
  }
  if (isGreater(m, b)) {
    b = 0;
  }
  if (isGreater(m, c)) {
    c = 0;
  }
  if (isGreater(m, d)) {
    d = 0;
  }

  let winner;
  if (isGreater(a, b) && isGreater(a, c) && isGreater(a, d)) {
    winner = 1;
  } else if (isGreater(b, a) && isGreater(b, c)&& isGreater(b, d)) {
    winner = 2;
  } else if (isGreater(c, a) && isGreater(c, b)&& isGreater(c, d)) {
    winner = 3;
  } else if (isGreater(d, a) && isGreater(d, b)&& isGreater(d, c)) {
    winner = 4;
  } else {
    winner = 0;
  }

  io.outputPublic('winner', winner);
}