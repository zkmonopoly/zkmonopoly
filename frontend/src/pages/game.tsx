import { Suspense } from "react";
import { Engine, Scene } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import { PropertyNode } from "@/components/game/property-node";
import { JailNode } from "@/components/game/jail-node";
import { MonopolyColors } from "@/components/game/constants/colors";
import { CommunityChestNode } from "@/components/game/community-chest-node";
import { SpecialPropertyNode } from "@/components/game/special-property-node";
import { ChanceNode } from "@/components/game/chance";
import { GoNode } from "@/components/game/go-node";
import { RailroadMaterial } from "@/components/game/materials/railroad-material";
import { ElectricCompanyMaterial } from "@/components/game/materials/electric-company-material";
import { RectangleDimensions } from "@/components/game/constants/dimensions";
import { FreeParkingNode } from "@/components/game/free-parking-node";
import { GoToJailNode } from "@/components/game/go-to-jail-node";
import { WaterCompanyMaterial } from "@/components/game/materials/water-company-material";
import { LuxuryTaxMaterial } from "@/components/game/materials/luxury-tax-material";

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
                    position={new Vector3(34.5, 10, -30.25)}
                    setTarget={[new Vector3(34.5, 0.5, -30.25)]}
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
                            <SpecialPropertyNode
                                name="incomeTax"
                                position={new Vector3(14, 0.5, 0)}
                                width={RectangleDimensions[0].width}
                                height={RectangleDimensions[0].height}
                                propertyName={["INCOME", "TAX"]}
                                propertyValue="PAY $ 200"
                            />
                            <SpecialPropertyNode
                                name="readingRailroad"
                                position={new Vector3(17.25, 0.5, 0)}
                                width={RectangleDimensions[1].width}
                                height={RectangleDimensions[1].height}
                                propertyName={["READING", "RAILROAD"]}
                                propertyValue="$ 200"
                            >
                                <RailroadMaterial />
                            </SpecialPropertyNode>
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
                            <SpecialPropertyNode
                                name="electricCompany"
                                position={new Vector3(34.5, 0.5, -7.5)}
                                width={RectangleDimensions[2].width}
                                height={RectangleDimensions[2].height}
                                rotationIndex={1}
                                propertyName={["ELECTRIC", "COMPANY"]}
                                propertyValue="$ 150"
                            >
                                <ElectricCompanyMaterial />
                            </SpecialPropertyNode>
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
                            <SpecialPropertyNode
                                name="pennsylvaniaRailroad"
                                position={new Vector3(34.5, 0.5, -17.25)}
                                width={RectangleDimensions[1].width}
                                height={RectangleDimensions[1].height}
                                rotationIndex={1}
                                propertyName={["PENNSYLVANIA", "RAILROAD"]}
                                propertyValue="$ 200"
                                >
                                <RailroadMaterial />
                            </SpecialPropertyNode>
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
                            <FreeParkingNode
                                name="freeParking"
                                position={new Vector3(34.5, 0.5, -34.5)}
                            />
                            <PropertyNode
                                name="kentuckyAvenue"
                                position={new Vector3(30.25, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Red}
                                propertyName={["KENTUCKY", "AVENUE"]}
                                propertyValue="$ 220"
                            />
                            <ChanceNode
                                name="chance2"
                                position={new Vector3(27, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.CommunityChest} />
                            <PropertyNode
                                name="indianaAvenue"
                                position={new Vector3(23.75, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Red}
                                propertyName={["INDIANA", "AVENUE"]}
                                propertyValue="$ 220" />
                            <PropertyNode
                                name="illinoisAvenue"
                                position={new Vector3(20.5, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Red}
                                propertyName={["ILLINOIS", "AVENUE"]}
                                propertyValue="$ 240" />
                            <SpecialPropertyNode
                                name="bAndORailroad"
                                position={new Vector3(17.25, 0.5, -34.5)}
                                width={RectangleDimensions[1].width}
                                height={RectangleDimensions[1].height}
                                rotationIndex={2}
                                propertyName={["B. & O.", "RAILROAD"]}
                                propertyValue="$ 200"
                            >
                                <RailroadMaterial />
                            </SpecialPropertyNode>
                            <PropertyNode
                                name="atlanticAvenue"
                                position={new Vector3(14, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Yellow}
                                propertyName={["ATLANTIC", "AVENUE"]}
                                propertyValue="$ 260" />
                            <PropertyNode
                                name="ventnorAvenue"
                                position={new Vector3(10.75, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Yellow}
                                propertyName={["VENTNOR", "AVENUE"]}
                                propertyValue="$ 260" />
                            <SpecialPropertyNode
                                name="waterCompany"
                                position={new Vector3(7.5, 0.5, -34.5)}
                                width={RectangleDimensions[0].width}
                                height={RectangleDimensions[0].height}
                                rotationIndex={2}
                                propertyName={["WATER", "COMPANY"]}
                                propertyValue="$ 150"
                            >
                                <WaterCompanyMaterial />
                            </SpecialPropertyNode>
                            <PropertyNode
                                name="marvinGardens"
                                position={new Vector3(4.25, 0.5, -34.5)}
                                rotationIndex={2}
                                color={MonopolyColors.Yellow}
                                propertyName={["MARVIN", "GARDENS"]}
                                propertyValue="$ 280"
                            />
                            <PropertyNode
                                name="pacificAvenue"
                                position={new Vector3(0, 0.5, -30.25)}
                                rotationIndex={3}
                                color={MonopolyColors.Green}
                                propertyName={["PACIFIC", "AVENUE"]}
                                propertyValue="$ 300"
                            />
                            <GoToJailNode
                                name="goToJail"
                                position={new Vector3(0, 0.5, -34.5)}
                            />
                            <PropertyNode
                                name="northCarolinaAvenue"
                                position={new Vector3(0, 0.5, -27)}
                                rotationIndex={3}
                                color={MonopolyColors.Green}
                                propertyName={["NORTH", "CAROLINA", "AVENUE"]}
                                propertyValue="$ 300"
                            />
                            <CommunityChestNode
                                name="communityChest3"
                                position={new Vector3(0, 0.5, -23.75)}
                                rotationIndex={3}
                            />
                            <PropertyNode
                                name="pennsylvaniaAvenue"
                                position={new Vector3(0, 0.5, -20.5)}
                                rotationIndex={3}
                                color={MonopolyColors.Green}
                                propertyName={["PENNSYLVANIA", "AVENUE"]}
                                propertyValue="$ 320"
                            />
                            <SpecialPropertyNode
                                name="shortLine"
                                position={new Vector3(0, 0.5, -17.25)}
                                width={RectangleDimensions[1].width}
                                height={RectangleDimensions[1].height}
                                rotationIndex={3}
                                propertyName={["SHORT", "LINE"]}
                                propertyValue="$ 200"
                            >
                                <RailroadMaterial />
                            </SpecialPropertyNode>
                            <ChanceNode
                                name="chance3"
                                position={new Vector3(0, 0.5, -14)}
                                rotationIndex={3}
                                color={MonopolyColors.Orange}
                            />
                            <PropertyNode
                                name="parkPlace"
                                position={new Vector3(0, 0.5, -10.75)}
                                rotationIndex={3}
                                color={MonopolyColors.Blue}
                                propertyName={["PARK", "PLACE"]}
                                propertyValue="$ 350"
                            />
                            <SpecialPropertyNode
                                name="luxuryTax"
                                position={new Vector3(0, 0.5, -7.5)}
                                width={RectangleDimensions[0].width}
                                height={RectangleDimensions[0].height}
                                rotationIndex={3}
                                propertyName={["LUXURY", "TAX"]}
                                propertyValue="PAY $ 100"
                            >
                                <LuxuryTaxMaterial />
                            </SpecialPropertyNode>
                            <PropertyNode
                                name="boardwalk"
                                position={new Vector3(0, 0.5, -4.25)}
                                rotationIndex={3}
                                color={MonopolyColors.Blue}
                                propertyName={["BOARDWALK"]}
                                propertyValue="$ 400"
                            />
                        </Suspense>
                    </shadowGenerator>
                </directionalLight>
            </Scene>
        </Engine>
    );
}