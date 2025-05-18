// GameEngine.tsx
import React from "react";
import { Engine } from "react-babylonjs";

type GameEngineProps = {
    children: React.ReactNode;
};

export default function GameEngine({ children }: GameEngineProps) {
  return (
    <Engine
      antialias
      adaptToDeviceRatio
      canvasId="babylon-js"
      renderOptions={{
        whenVisibleOnly: true,
      }}
    >
      {children}
    </Engine>
  );
}
