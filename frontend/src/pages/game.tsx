import { Suspense } from "react";
import { Engine, Scene } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import { PropertyNode } from "@/components/game/property-node";
import { JailNode } from "@/components/game/jail-node";
import { MonopolyColors } from "@/components/game/constants/colors";

export default function SceneWithSpinningBoxes() {
    return (
        <Engine
            antialias
            adaptToDeviceRatio
            canvasId="babylon-js"
            renderOptions={{
                whenVisibleOnly: true,
            }}
        >
            <Scene>
                <universalCamera
                    name="camera1"
                    position={new Vector3(0, 10, 10)}
                    setTarget={[Vector3.Zero()]}
                    keysDown={[83]}
                    keysUp={[87]}
                    keysLeft={[65]}
                    keysRight={[68]}
                />
                <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
                <ground name="ground1" width={128} height={128} subdivisions={2} receiveShadows />
                <directionalLight
                    name="dl"
                    intensity={0.6}
                    direction={new Vector3((-5 * Math.PI) / 4, (-5 * Math.PI) / 4, -Math.PI)}
                    position={new Vector3(0, 4, 16)}
                >
                    <shadowGenerator mapSize={1024} useBlurExponentialShadowMap blurKernel={64} shadowCastChildren>
                        <Suspense fallback={null}>
                            <JailNode name="inJail" position={new Vector3(0, 0.5, 0)} />
                            <PropertyNode
                                name="stCharlesPlace"
                                position={new Vector3(4.25, 0.5, 0)}
                                color={MonopolyColors.Magenta}
                                propertyName={["ST. CHARLES", "PLACE"]}
                                propertyValue="$ 140"
                            />
                            <PropertyNode
                                name="statesAvenue"
                                position={new Vector3(10.75, 0.5, 0)}
                                color={MonopolyColors.Magenta}
                                propertyName={["STATE", "AVENUE"]}
                                propertyValue="$ 140"
                            />
                            <PropertyNode
                                name="statesAvenue"
                                position={new Vector3(14, 0.5, 0)}
                                color={MonopolyColors.Magenta}
                                propertyName={["VIRGINIA", "AVENUE"]}
                                propertyValue="$ 160"
                            />
                            <PropertyNode
                                name="virginiaAvenue"
                                position={new Vector3(20.5, 0.5, 0)}
                                color={MonopolyColors.Orange}
                                propertyName={["VIRGINIA", "AVENUE"]}
                                propertyValue="$ 160"
                            />
                            <PropertyNode
                                name="tennesseeAvenue"
                                position={new Vector3(27, 0.5, 0)}
                                color={MonopolyColors.Orange}
                                propertyName={["TENNESSEE", "AVENUE"]}
                                propertyValue="$ 180"
                            />
                            <PropertyNode
                                name="newYorkAvenue"
                                position={new Vector3(30.25, 0.5, 0)}
                                color={MonopolyColors.Orange}
                                propertyName={["NEW YORK", "AVENUE"]}
                                propertyValue="$ 200"
                            />
                        </Suspense>
                    </shadowGenerator>
                </directionalLight>
            </Scene>
        </Engine>
    );
}