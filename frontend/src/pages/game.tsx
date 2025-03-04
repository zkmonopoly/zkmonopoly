import { Suspense } from "react";
import { Engine, Scene } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import { PropertyNode } from "@/components/game/property-node";
import { JailNode } from "@/components/game/jail-node";
import { MonopolyColors } from "@/components/game/constants/colors";
import { CommunityChestNode } from "@/components/game/community-chest-node";
import { IncomeTaxNode } from "@/components/game/income-tax-node";
import { RailroadNode } from "@/components/game/railroad-node";
import { ElectricCompanyNode } from "@/components/game/electric-company-node";
import { ChanceNode } from "@/components/game/chance";
import { GoNode } from "@/components/game/go-node";

export default function Game() {
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
                            <GoNode
                                name="go"
                                position={new Vector3(0, 0.5, 0)}
                            />
                            <PropertyNode 
                                name="mediterraneanAvenue"
                                position={new Vector3(4.25, 0.5, 0)}
                                color={MonopolyColors.Brown}
                                propertyName={["MEDITER-", "RANEAN", "AVENUE"]}
                                propertyValue="$ 60"
                            />
                            <CommunityChestNode
                                name="communityChest1"
                                position={new Vector3(7.5, 0.5, 0)}
                            />
                            <PropertyNode
                                name="balticAvenue"
                                position={new Vector3(10.75, 0.5, 0)}
                                color={MonopolyColors.Brown}
                                propertyName={["BALTIC", "AVENUE"]}
                                propertyValue="$ 60"
                            />
                            <IncomeTaxNode
                                name="incomeTax"
                                position={new Vector3(14, 0.5, 0)}
                            />
                            <RailroadNode
                                name="readingRailroad"
                                position={new Vector3(17.25, 0.5, 0)}
                                propertyName={["READING", "RAILROAD"]}
                                propertyValue="$ 200"
                            />
                            <PropertyNode
                                name="orientalAvenue"
                                position={new Vector3(20.5, 0.5, 0)}
                                color={MonopolyColors.LightBlue}
                                propertyName={["ORIENTAL", "AVENUE"]}
                                propertyValue="$ 100"
                            />
                            <ChanceNode 
                                name="chance1"
                                position={new Vector3(23.75, 0.5, 0)}
                                color={MonopolyColors.Magenta}
                            />
                            <PropertyNode
                                name="vermontAvenue"
                                position={new Vector3(27, 0.5, 0)}
                                color={MonopolyColors.LightBlue}
                                propertyName={["VERMONT", "AVENUE"]}
                                propertyValue="$ 100"
                            />
                            <PropertyNode
                                name="connecticutAvenue"
                                position={new Vector3(30.25, 0.5, 0)}
                                color={MonopolyColors.LightBlue}
                                propertyName={["CONNECTICUT", "AVENUE"]}
                                propertyValue="$ 120"
                            />
                            <JailNode name="inJail" position={new Vector3(34.5, 0.5, 0)} />
                            <PropertyNode
                                name="stCharlesPlace"
                                position={new Vector3(34.5, 0.5, -4.25)}
                                rotationIndex={1}
                                color={MonopolyColors.Magenta}
                                propertyName={["ST. CHARLES", "PLACE"]}
                                propertyValue="$ 140"
                            />
                            <ElectricCompanyNode
                                name="electricCompany"
                                position={new Vector3(34.5, 0.5, -7.5)}
                            />
                            <PropertyNode
                                name="statesAvenue"
                                position={new Vector3(34.5, 0.5, -10.75)}
                                rotationIndex={1}
                                color={MonopolyColors.Magenta}    
                                propertyName={["STATES", "AVENUE"]}
                                propertyValue="$ 140"
                            />
                            <PropertyNode
                                name="virginiaAvenue"
                                position={new Vector3(34.5, 0.5, -14)}
                                rotationIndex={1}
                                color={MonopolyColors.Magenta}
                                propertyName={["VIRGINIA", "AVENUE"]}
                                propertyValue="$ 160"
                            />
                            <RailroadNode
                                name="pennsylvaniaRailroad"
                                position={new Vector3(34.5, 0.5, -17.25)}
                                rotationIndex={1}
                                propertyName={["PENNSYLVANIA", "RAILROAD"]}
                                propertyValue="$ 200"
                            />
                            <PropertyNode
                                name="stJamesPlace"
                                position={new Vector3(34.5, 0.5, -20.5)}
                                rotationIndex={1}
                                color={MonopolyColors.Orange}
                                propertyName={["ST. JAMES", "PLACE"]}
                                propertyValue="$ 180"
                            />
                            <CommunityChestNode
                                name="communityChest2"
                                position={new Vector3(34.5, 0.5, -23.75)}
                                rotationIndex={1}
                            />
                            <PropertyNode
                                name="tennesseeAvenue"
                                position={new Vector3(34.5, 0.5, -27)}
                                rotationIndex={1}
                                color={MonopolyColors.Orange}
                                propertyName={["TENNESSEE", "AVENUE"]}
                                propertyValue="$ 180"
                            />
                            <PropertyNode
                                name="newYorkAvenue"
                                position={new Vector3(34.5, 0.5, -30.25)}
                                rotationIndex={1}
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