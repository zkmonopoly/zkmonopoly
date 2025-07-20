import { GameTurn, sleep, ZKShuffle } from "@/libs/zkshuffle/jssdk";
import { Signer } from "ethers";

export async function playerRun(shuffleManagerContract: string, owner: Signer, gameId: number) {
  const address = await owner.getAddress();
  console.log("Player ", address, "init shuffle context!");

  const player = await ZKShuffle.create(
    shuffleManagerContract,
    owner,
    await ZKShuffle.generateShuffleSecret(),
    "/zk/wasm/decrypt.wasm",
    "/zk/zkey/decrypt.zkey",
    "/zk/wasm/encrypt.wasm",
    "/zk/zkey/encrypt.zkey"
  );
  
  let playerIdx = await player.joinGame(gameId);
  console.log(
    "Player ",
    address,
    "Join Game ",
    gameId,
    " asigned playerId ",
    playerIdx,
  );
  
  // play game
  let turn: GameTurn = GameTurn.NOP;
  let revealedCard: number | null = null;
  
  while (turn !== GameTurn.Complete) {
    turn = await player.checkTurn(gameId);

    if (turn != GameTurn.NOP) {
      switch (turn) {
        case GameTurn.Shuffle:
          console.log("Player ", playerIdx, " 's Shuffle turn!");
          await player.shuffle(gameId);
          break;
        case GameTurn.Deal:
          console.log("Player ", playerIdx, " 's Deal Decrypt turn!");
          await player.draw(gameId);
          break;
        case GameTurn.Open:
          console.log("Player ", playerIdx, " 's Open Decrypt turn!");
          let cards = await player.openOffchain(gameId, [playerIdx]);
          console.log("Player ", playerIdx, " open offchain hand card ", cards[0]);
          cards = await player.open(gameId, [playerIdx]);
          console.log("Player ", playerIdx, " open onchain hand card ", cards[0]);
          revealedCard = cards[0];
          break;
        case GameTurn.Complete:
          console.log("Player ", playerIdx, " 's Game End!");
          break;
        default:
          console.log("err turn ", turn);
      }
    } 
    await sleep(1000);
  }  
  return revealedCard;
}