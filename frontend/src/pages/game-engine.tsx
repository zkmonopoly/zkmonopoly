// GameEngine.tsx
import { $isPaused } from "@/models/game";
import { useStore } from "@nanostores/react";
import React from "react";
import { Engine } from "react-babylonjs";

type GameEngineProps = {
    children: React.ReactNode;
};

export default function GameEngine({ children }: GameEngineProps) {
  const isPaused = useStore($isPaused);
  return (
    <Engine
      antialias
      adaptToDeviceRatio
      canvasId="babylon-js"
      isPaused={isPaused}
      renderOptions={{
        whenVisibleOnly: true,
      }}
    >
      {children}
    </Engine>
  );
}
