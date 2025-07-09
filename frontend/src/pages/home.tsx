import { useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import {
  Tabs,
  TabList,
  TabPanel,
  Form,
  Button,
  FieldError,
  Input,
  Label,
  TextField,
  TabsContext,
  Key,
  Select,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";
import { LuDoorOpen, LuGlobe, LuNetwork, LuPlus } from "react-icons/lu";
import {
  tabListStyles,
  tabPanelStyles,
  tabsStyles,
} from "@/components/ui/core/styles/tabs";
import { buttonStyles } from "@/components/ui/core/styles/button";
import { textFieldsStyles } from "@/components/ui/core/styles/text-field";
import { formStyles } from "@/components/ui/core/styles/form";
import TooltipTriggerTab from "@/components/ui/tooltip-trigger-tab";
import { useNavigate, useSearchParams } from "react-router";
import { GameController } from "@/controllers/game-controller";
import SelectWrapper, { SelectItem } from "@/components/ui/core/wrappers/select-wrapper";
import { GameMode } from "@/models/game";

const tabPanelStylesExtended = twJoin(
  tabPanelStyles,
  "md:w-[370px] w-[270px] h-[210px]"
);

interface JoinFormData {
    name: string;
    code: string;
}


interface CreateFormData {
    name: string;
    mode: GameMode;
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gameController = GameController.getInstance();

  const onSubmitJoinOrCreateRoom= (formData: CreateFormData) => {
    gameController.joinOrCreateRoom(formData.name, () => {
      gameController.onInitialGameMessage((payload: any) => {
        console.log("Initial joinOrCreateRoom received:", payload);
        navigate("/game/" + gameController.getNetwork().getRoom()?.roomId);
      });
    });
  };

  const onSubmitCreateRoom = (formData: CreateFormData) => {
    gameController.createRoom(formData.name, () => {
      gameController.onInitialGameMessage((payload: any) => {
        console.log("Initial createRoom received:", payload);
        navigate("/game/" + gameController.getNetwork().getRoom()?.roomId);
      });
    });
    setIsDisabledCreateRoom(true);
    setTimeout(() => {
      setIsDisabledCreateRoom(false);
      console.log("Create room button re-enabled");
    }, 6000);
  }

  const onSubmitJoinRoomById = (formData: JoinFormData) => {
    gameController.joinRoomById(formData.code, formData.name, () => {
      gameController.onInitialGameMessage((payload: any) => {
        console.log("Initial joinRoomById received:", payload);
        navigate("/game/" + gameController.getNetwork().getRoom()?.roomId);
      });
    });
    setIsDisabledJoinRoom(true);
    setTimeout(() => {
      setIsDisabledJoinRoom(false);
    }, 6000);

  };
  const [isDisabledCreateRoom, setIsDisabledCreateRoom] = useState(false);
  const [isDisabledJoinRoom, setIsDisabledJoinRoom] = useState(false);
  const [selectedKey, onSelectionChange] = useState<Key>("tabJoin");
  const joinForm = useForm<JoinFormData>({
    defaultValues: {
      name: "",
      code: searchParams.get("code") ?? ""
    }
  });
  const createForm = useForm<CreateFormData>({
    defaultValues: {
      name: "",
      mode: "lan"
    },
  });

  return (
    <TabsContext.Provider value={{ selectedKey, onSelectionChange }}>
      <Tabs
        orientation="vertical"
        className={tabsStyles}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
      >
        <TabList aria-label="Menu" className={tabListStyles}>
          <TooltipTriggerTab id="tabJoin" text="Join a game">
            <LuDoorOpen size={16} />
          </TooltipTriggerTab>
          <TooltipTriggerTab id="tabCreate" text="New game">
            <LuPlus size={16} />
          </TooltipTriggerTab>
        </TabList>
        <TabPanel id="tabJoin" className={tabPanelStylesExtended}>
          <Form className={formStyles} onSubmit={joinForm.handleSubmit(onSubmitJoinRoomById)}>
            <Controller
              control={joinForm.control}
              name="name"
              rules={{ required: "Name is required." }}
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isRequired
                  validationBehavior="aria"
                  isInvalid={invalid}
                  className={textFieldsStyles}
                >
                  <Label>Name</Label>
                  <Input ref={ref} />
                  <FieldError>{error?.message}</FieldError>
                </TextField>
              )}
            />
            <Controller
              control={joinForm.control}
              name="code"
              rules={{ required: "Code is required." }}
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isRequired
                  validationBehavior="aria"
                  isInvalid={invalid}
                  className={textFieldsStyles}
                >
                  <Label>Code</Label>
                  <Input ref={ref} />
                  <FieldError>{error?.message}</FieldError>
                </TextField>
              )}
            />
            <Button type="submit" isDisabled={isDisabledJoinRoom} className={buttonStyles}>
                            Submit
            </Button>
          </Form>
        </TabPanel>
        <TabPanel id="tabCreate" className={tabPanelStylesExtended}>
          <Form className={formStyles} onSubmit={createForm.handleSubmit(onSubmitCreateRoom)}>
            <Controller
              control={createForm.control}
              name="name"
              rules={{ required: "Name is required." }}
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <TextField
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isRequired
                  validationBehavior="aria"
                  isInvalid={invalid}
                  className={textFieldsStyles}
                >
                  <Label>Name</Label>
                  <Input ref={ref} />
                  <FieldError>{error?.message}</FieldError>
                </TextField>
              )}
            />
            <Controller
              control={createForm.control}
              name="mode"
              rules={{ required: "Mode is required." }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <>
                  <Label>Mode</Label>
                  <SelectWrapper onSelectionChange={onChange} className="pt-1 border rounded-md w-[200px] h-[38px] border-neutral-500" selectedKey={value}>
                    <SelectItem id="lan"><LuNetwork className="mb-1"/> LAN</SelectItem>
                    <SelectItem id="online"><LuGlobe className="mb-1"/> Online</SelectItem>
                  </SelectWrapper>
                  <FieldError>{error?.message}</FieldError>
                </>
              )}
            />
            <Button type="submit" isDisabled={isDisabledCreateRoom} className={buttonStyles}>
              Submit
            </Button>
          </Form>
        </TabPanel>
      </Tabs>
    </TabsContext.Provider>
  );
}
