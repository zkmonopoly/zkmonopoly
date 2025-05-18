import { PropertyInfo } from "@/models/property";
import { MonopolyCard } from "./shared/monopoly-card";
import { Color3 } from "@babylonjs/core";
import { MonopolyHouseIcon } from "../icons/monopoly-house-icon";

interface PropertyCardProps {
    propertyInfo: PropertyInfo;
    color: Color3;
}

export function PropertyCard(props: PropertyCardProps) {
  return (
    <MonopolyCard>
      <div className="p-[7.5px]">
        <div 
          className="h-[72px] border border-black flex flex-col justify-center items-center gap-2"
          style={{
            backgroundColor: props.color.toHexString()
          }}
        >
          <div className="text-monopoly-s">TITLE DEED</div>
          <span className="text-monopoly-m font-bold break-word text-center">{props.propertyInfo.name}</span>
        </div>
        <div className="text-black space-y-[2px] my-[7.5px]">
          <div className="flex justify-between">
            <div>Rent</div>
            <div>${props.propertyInfo.rent}</div>
          </div>
          <div className="flex justify-between">
            <div>Rent with color set</div>
            <div>${props.propertyInfo.rentWithColorSet}</div>
          </div>
          <div className="flex justify-between">
            <div>{"Rent with "}
              <MonopolyHouseIcon
                text="1"
                hexColor="#00c951"
              />
            </div>
            <div>${props.propertyInfo.multipliedRents[0]}</div>
          </div>
          <div className="flex justify-between">
            <div>{"Rent with "}
              <MonopolyHouseIcon
                text="2"
                hexColor="#00c951"
              />
            </div>
            <div>${props.propertyInfo.multipliedRents[1]}</div>
          </div>
          <div className="flex justify-between">
            <div>{"Rent with "}
              <MonopolyHouseIcon
                text="3"
                hexColor="#00c951"
              />
            </div>
            <div>${props.propertyInfo.multipliedRents[2]}</div>
          </div>
          <div className="flex justify-between">
            <div>{"Rent with "}
              <MonopolyHouseIcon
                text="4"
                hexColor="#00c951"
              />
            </div>
            <div>${props.propertyInfo.multipliedRents[3]}</div>
          </div>
          <div className="flex justify-between">
            <div>{"Rent with "}
              <MonopolyHouseIcon
                hexColor="#fb2c36"
              />
            </div>
            <div>${props.propertyInfo.multipliedRents[4]}</div>
          </div>
          <div className="h-[2px] bg-black"></div>
          <div className="flex justify-between">
            <div>Houses cost</div>
            <div>${props.propertyInfo.houseCost} each</div>
          </div>
          <div className="flex justify-between">
            <div>Hotels cost</div>
            <div>${props.propertyInfo.hotelCost} each</div>
          </div>
          <div className="float-end text-xs">(plus 4 houses)</div>
        </div>
      </div>
    </MonopolyCard>
  );
}