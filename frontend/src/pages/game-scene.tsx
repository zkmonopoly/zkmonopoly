import { Suspense, useEffect, useRef, useState } from "react";
import { Scene, Skybox } from "react-babylonjs";
import { Color3, HavokPlugin, Material, PhysicsShapeType, UniversalCamera, Vector3 } from "@babylonjs/core";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import PropertyNode from "@/components/game/map/property-node";
import JailNode from "@/components/game/map/jail-node";
import { MonopolyColors } from "@/components/game/core/constants/colors";
import CommunityChestNode from "@/components/game/map/community-chest-node";
import SpecialPropertyNode from "@/components/game/map/special-property-node";
import ChanceNode from "@/components/game/map/chance-node";
import GoNode from "@/components/game/map/go-node";
import RailroadMaterial from "@/components/game/core/materials/railroad-material";
import ElectricCompanyMaterial from "@/components/game/core/materials/electric-company-material";
import { RectangleDimensions } from "@/components/game/core/constants/dimensions";
import FreeParkingNode from "@/components/game/map/free-parking-node";
import GoToJailNode from "@/components/game/map/go-to-jail-node";
import WaterCompanyMaterial from "@/components/game/core/materials/water-company-material";
import LuxuryTaxMaterial from "@/components/game/core/materials/luxury-tax-material";
import { NodePositions } from "@/components/game/core/constants/common";
import Dice, { $dices } from "@/components/game/dice";
import TaxSymbolMaterial from "@/components/game/core/materials/tax-symbol-material";
import { useGameController } from "@/contexts/game-context";
import Players from "./players";
import { $propertyInfo, PropertiesMap } from "@/models/property";
import JsText from "@/components/game/core/texts/js-text";


const cameraSpecs = {
  birdview: new Vector3(17.25, 37, -17.25),
  position: new Vector3(17.25, 30, 20),
  target: new Vector3(17.25, 0, -17.25),
}

export default function GameScene() {
  const ref = useRef<UniversalCamera>(null)
  const [HK, setHK] = useState<HavokPhysicsWithBindings>();

  const context = useGameController();

  useEffect(() => {
    HavokPhysics().then((havok) => {
      setHK(havok);
    });

    context.onDiceRollResultMessage((message) => {
      ref.current?.position.set(cameraSpecs.birdview.x, cameraSpecs.birdview.y, cameraSpecs.birdview.z);
      ref.current?.setTarget(cameraSpecs.target);
      setTimeout(() => {
        ref.current?.position.set(cameraSpecs.position.x, cameraSpecs.position.y, cameraSpecs.position.z);
        ref.current?.setTarget(cameraSpecs.target);
        setTimeout(() => {
          const property = PropertiesMap.get(message.position);
          if (property) {
            $propertyInfo.set(property);
          }
        }, 1000)
      }, 5500)
      $dices.set([message.first, message.second]);
    });
  }, []);

  return (
    <div>
      {HK ? (
        <Scene enablePhysics={[null, new HavokPlugin(false, HK)]}>
          <Skybox size={1000} rootUrl="/assets/game/2d/skybox.dds" />
          <universalCamera
            name="camera1"
            position={cameraSpecs.position}
            setTarget={[cameraSpecs.target]}
            keysDown={[83]}
            keysUp={[87]}
            keysLeft={[65]}
            keysRight={[68]}
            ref={ref}
          />
          <ground
            name="ground1"
            material={new Material("groundMaterial")}
            position={new Vector3(17.25, 0, -17.25)}
            width={39.5}
            height={39.5}
            subdivisions={2}
            receiveShadows
          >
            <physicsAggregate
              type={PhysicsShapeType.BOX}
              _options={{ mass: 0, restitution: 0.9 }}
            />
          </ground>
          <directionalLight
            name="dl"
            intensity={1.2}
            diffuse={new Color3(1.0, 0.95, 0.8)}
            direction={new Vector3(-Math.sin(Math.PI/4), -Math.cos(Math.PI/4), 0.0)}
            position={new Vector3(0, 4, 16)}
          >
            <shadowGenerator
              mapSize={1024}
              useBlurExponentialShadowMap
              blurKernel={64}
              shadowCastChildren
            >
              <Suspense fallback={null}>
                <JsText name="textDecor1" text={["zkMONOPOLY"]} position={new Vector3(17.25, 0, -17.25)} fontScale={10}/>
                <GoNode name="go" position={NodePositions[0]} />
                <PropertyNode
                  name="mediterraneanAvenue"
                  position={NodePositions[1]}
                  color={MonopolyColors.Brown}
                  propertyName={[
                    "MEDITER-",
                    "RANEAN",
                    "AVENUE",
                  ]}
                  propertyValue="$ 60"
                />
                <CommunityChestNode
                  name="communityChest1"
                  position={NodePositions[2]}
                />
                <PropertyNode
                  name="balticAvenue"
                  position={NodePositions[3]}
                  color={MonopolyColors.Brown}
                  propertyName={["BALTIC", "AVENUE"]}
                  propertyValue="$ 60"
                />
                <SpecialPropertyNode
                  name="incomeTax"
                  position={NodePositions[4]}
                  width={RectangleDimensions[6].width}
                  height={RectangleDimensions[6].height}
                  propertyName={["INCOME", "TAX"]}
                  propertyValue="PAY $ 200"
                >
                  <TaxSymbolMaterial />
                </SpecialPropertyNode>
                <SpecialPropertyNode
                  name="readingRailroad"
                  position={NodePositions[5]}
                  width={RectangleDimensions[1].width}
                  height={RectangleDimensions[1].height}
                  propertyName={["READING", "RAILROAD"]}
                  propertyValue="$ 200"
                >
                  <RailroadMaterial />
                </SpecialPropertyNode>
                <PropertyNode
                  name="orientalAvenue"
                  position={NodePositions[6]}
                  color={MonopolyColors.LightBlue}
                  propertyName={["ORIENTAL", "AVENUE"]}
                  propertyValue="$ 100"
                />
                <ChanceNode
                  name="chance1"
                  position={NodePositions[7]}
                  color={MonopolyColors.Magenta}
                />
                <PropertyNode
                  name="vermontAvenue"
                  position={NodePositions[8]}
                  color={MonopolyColors.LightBlue}
                  propertyName={["VERMONT", "AVENUE"]}
                  propertyValue="$ 100"
                />
                <PropertyNode
                  name="connecticutAvenue"
                  position={NodePositions[9]}
                  color={MonopolyColors.LightBlue}
                  propertyName={["CONNECTICUT", "AVENUE"]}
                  propertyValue="$ 120"
                />
                <JailNode
                  name="inJail"
                  position={NodePositions[10]}
                />
                <PropertyNode
                  name="stCharlesPlace"
                  position={NodePositions[11]}
                  rotationIndex={1}
                  color={MonopolyColors.Magenta}
                  propertyName={["ST. CHARLES", "PLACE"]}
                  propertyValue="$ 140"
                />
                <SpecialPropertyNode
                  name="electricCompany"
                  position={NodePositions[12]}
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
                  position={NodePositions[13]}
                  rotationIndex={1}
                  color={MonopolyColors.Magenta}
                  propertyName={["STATES", "AVENUE"]}
                  propertyValue="$ 140"
                />
                <PropertyNode
                  name="virginiaAvenue"
                  position={NodePositions[14]}
                  rotationIndex={1}
                  color={MonopolyColors.Magenta}
                  propertyName={["VIRGINIA", "AVENUE"]}
                  propertyValue="$ 160"
                />
                <SpecialPropertyNode
                  name="pennsylvaniaRailroad"
                  position={NodePositions[15]}
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
                  position={NodePositions[16]}
                  rotationIndex={1}
                  color={MonopolyColors.Orange}
                  propertyName={["ST. JAMES", "PLACE"]}
                  propertyValue="$ 180"
                />
                <CommunityChestNode
                  name="communityChest2"
                  position={NodePositions[17]}
                  rotationIndex={1}
                />
                <PropertyNode
                  name="tennesseeAvenue"
                  position={NodePositions[18]}
                  rotationIndex={1}
                  color={MonopolyColors.Orange}
                  propertyName={["TENNESSEE", "AVENUE"]}
                  propertyValue="$ 180"
                />
                <PropertyNode
                  name="newYorkAvenue"
                  position={NodePositions[19]}
                  rotationIndex={1}
                  color={MonopolyColors.Orange}
                  propertyName={["NEW YORK", "AVENUE"]}
                  propertyValue="$ 200"
                />
                <FreeParkingNode
                  name="freeParking"
                  position={NodePositions[20]}
                />
                <PropertyNode
                  name="kentuckyAvenue"
                  position={NodePositions[21]}
                  rotationIndex={2}
                  color={MonopolyColors.Red}
                  propertyName={["KENTUCKY", "AVENUE"]}
                  propertyValue="$ 220"
                />
                <ChanceNode
                  name="chance2"
                  position={NodePositions[22]}
                  rotationIndex={2}
                  color={MonopolyColors.CommunityChest}
                />
                <PropertyNode
                  name="indianaAvenue"
                  position={NodePositions[23]}
                  rotationIndex={2}
                  color={MonopolyColors.Red}
                  propertyName={["INDIANA", "AVENUE"]}
                  propertyValue="$ 220"
                />
                <PropertyNode
                  name="illinoisAvenue"
                  position={NodePositions[24]}
                  rotationIndex={2}
                  color={MonopolyColors.Red}
                  propertyName={["ILLINOIS", "AVENUE"]}
                  propertyValue="$ 240"
                />
                <SpecialPropertyNode
                  name="bAndORailroad"
                  position={NodePositions[25]}
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
                  position={NodePositions[26]}
                  rotationIndex={2}
                  color={MonopolyColors.Yellow}
                  propertyName={["ATLANTIC", "AVENUE"]}
                  propertyValue="$ 260"
                />
                <PropertyNode
                  name="ventnorAvenue"
                  position={NodePositions[27]}
                  rotationIndex={2}
                  color={MonopolyColors.Yellow}
                  propertyName={["VENTNOR", "AVENUE"]}
                  propertyValue="$ 260"
                />
                <SpecialPropertyNode
                  name="waterCompany"
                  position={NodePositions[28]}
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
                  position={NodePositions[29]}
                  rotationIndex={2}
                  color={MonopolyColors.Yellow}
                  propertyName={["MARVIN", "GARDENS"]}
                  propertyValue="$ 280"
                />
                <GoToJailNode
                  name="goToJail"
                  position={NodePositions[30]}
                />
                <PropertyNode
                  name="pacificAvenue"
                  position={NodePositions[31]}
                  rotationIndex={3}
                  color={MonopolyColors.Green}
                  propertyName={["PACIFIC", "AVENUE"]}
                  propertyValue="$ 300"
                />
                <PropertyNode
                  name="northCarolinaAvenue"
                  position={NodePositions[32]}
                  rotationIndex={3}
                  color={MonopolyColors.Green}
                  propertyName={[
                    "NORTH",
                    "CAROLINA",
                    "AVENUE",
                  ]}
                  propertyValue="$ 300"
                />
                <CommunityChestNode
                  name="communityChest3"
                  position={NodePositions[33]}
                  rotationIndex={3}
                />
                <PropertyNode
                  name="pennsylvaniaAvenue"
                  position={NodePositions[34]}
                  rotationIndex={3}
                  color={MonopolyColors.Green}
                  propertyName={["PENNSYLVANIA", "AVENUE"]}
                  propertyValue="$ 320"
                />
                <SpecialPropertyNode
                  name="shortLine"
                  position={NodePositions[35]}
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
                  position={NodePositions[36]}
                  rotationIndex={3}
                  color={MonopolyColors.Orange}
                />
                <PropertyNode
                  name="parkPlace"
                  position={NodePositions[37]}
                  rotationIndex={3}
                  color={MonopolyColors.Blue}
                  propertyName={["PARK", "PLACE"]}
                  propertyValue="$ 350"
                />
                <SpecialPropertyNode
                  name="luxuryTax"
                  position={NodePositions[38]}
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
                  position={NodePositions[39]}
                  rotationIndex={3}
                  color={MonopolyColors.Blue}
                  propertyName={["BOARDWALK"]}
                  propertyValue="$ 400"
                />
                <Players />
                <Dice />
              </Suspense>
            </shadowGenerator>
          </directionalLight>
        </Scene>
      ) : null}
    </div>
  );
}
