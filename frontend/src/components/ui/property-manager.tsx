import { useState } from "react";
import { Button } from "react-aria-components";
import { LuChevronLeft, LuChevronRight, LuHouse, LuPlus, LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { buttonStyles } from "./core/styles/button";
import { modalStyles } from "./core/styles/modal";
import { ModalWrapper } from "./core/wrappers/modal-wrapper";
import { PropertiesMap } from "@/models/property";
import Property from "./property";

export default function PropertyManager() {
  const [open, setOpen] = useState(false);
  // const propertyConfigs = useStore(array of PropertyConfig)
  // interface PropertyConfig {
  //   position: number;
  //   houses: number;
  // }
  // const properties = useMemo(() => propertyConfigs.map(...), [propertyConfigs])
  const sampleProperties = [PropertiesMap.get(1), PropertiesMap.get(5)]
  const [currentProperty, setCurrentProperty] = useState(0);
  return (
    <>
      <Button className={twMerge(buttonStyles, "bg-yellow-500 pressed:bg-yellow-400")} onPress={() => setOpen(true)}>
        <LuHouse className="inline-block mb-1"/> Property
      </Button>
      <ModalWrapper className={twMerge(modalStyles, "[&_.react-aria-Dialog]:max-w-[unset]")} isDismissable isOpen={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center relative min-w-[280px] min-h-[430px] gap-2.5">
          <Button className="absolute right-0 -top-1 hover:bg-white/20 p-2 rounded-full" onPress={() => setOpen(false)}>
            <LuX />
          </Button>
          <div>PROPERTY MANAGER</div>
            {sampleProperties.length > 0 ?
            <>
              <div className="w-full flex items-center gap-2">
                <Button 
                  className="hover:bg-white/20 p-2 rounded-full disabled:text-gray-400 disabled:pointer-events-none" 
                  onPress={() => setCurrentProperty(prev => prev - 1)}
                  isDisabled={currentProperty === 0}
                >
                  <LuChevronLeft />
                </Button>
                <div className="w-full">
                  <Property propertyInfo={sampleProperties[currentProperty]!}/>
                </div>
                <Button 
                  className="hover:bg-white/20 p-2 rounded-full disabled:text-gray-400 disabled:pointer-events-none" 
                  onPress={() => setCurrentProperty(prev => prev + 1)}
                  isDisabled={currentProperty === sampleProperties.length - 1}
                >
                  <LuChevronRight />
                </Button>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex gap-2 items-center">
                  <LuHouse className="inline-block mb-1" color="#00c951" fill="#00c951"/>
                  <div>999</div>
                </div>
                <Button className={buttonStyles}>
                  <LuPlus className="inline-block mb-1"/> Buy a House
                </Button>
              </div>
            </> :
            <div className="absolute top-1/2 -translate-y-1/2">
              You have no properties.
            </div>
          }
        </div>
      </ModalWrapper>
    </>
  );
}