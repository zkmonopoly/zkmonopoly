import React, { createContext, useContext, useState } from "react";
import { GameController } from "../controllers/game-controller";
// import { atom } from "nanostores";

interface GameContextValue {
  controller: GameController;
}

export const GameContext = createContext<GameContextValue | null>(null);

const gameController = GameController.getInstance();

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const [controller] = useState(() => gameController);

  return (
    <GameContext.Provider value={{ controller }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameController(): GameController {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameController must be used within a GameProvider");
  }
  return context.controller;
}

// export const gameControllerStore = atom<GameController>(gameController);
