import React, { createContext, useContext, useState } from "react";
import { GameController } from "../controllers/game-controller";

interface GameContextValue {
  controller: GameController;
}

const GameContext = createContext<GameContextValue | null>(null);


export function GameProvider({ children }: { children: React.ReactNode }) {
  const [controller] = useState(() => new GameController());

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
