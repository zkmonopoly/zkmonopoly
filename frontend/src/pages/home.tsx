import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
} from "react-aria-components";
import { twJoin } from "tailwind-merge";
import { LuDoorOpen, LuPlus } from "react-icons/lu";
import {
    tabListStyles,
    tabPanelStyles,
    tabsStyles,
} from "@/components/ui/core/styles/tabs";
import { buttonStyles } from "@/components/ui/core/styles/button";
import { textFieldsStyles } from "@/components/ui/core/styles/text-field";
import { formStyles } from "@/components/ui/core/styles/form";
import { TooltipTriggerTab } from "@/components/ui/tooltip-trigger-tab";
import { useNavigate } from "react-router";
import { GameController } from "@/controllers/game-controller";

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
}

export default function Home() {
    const navigate = useNavigate();

    const gameController = GameController.getInstance();

    let onSubmitNewGame = (formData: CreateFormData) => {
        gameController.joinGame(formData.name, () => {
            gameController.onInitialGameMessage((payload: any) => {
                console.log("Initial game message received:", payload);
                navigate("/game/" + gameController.network.getRoom()?.roomId);
            });
        });
    };

    const [selectedKey, onSelectionChange] = useState<Key>("tabJoin");
    const joinForm = useForm<JoinFormData>({
        defaultValues: {
            name: "",
            code: ""
        }
    });
    const createForm = useForm<CreateFormData>({
        defaultValues: {
            name: "",
            // TODO: add bot option
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
                    <Form className={formStyles}>
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
                        <Button type="submit" className={buttonStyles}>
                            Submit
                        </Button>
                    </Form>
                </TabPanel>
                <TabPanel id="tabCreate" className={tabPanelStylesExtended}>
                    <Form className={formStyles} onSubmit={createForm.handleSubmit(onSubmitNewGame)}>
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
                        <Button type="submit" className={buttonStyles}>
                            Submit
                        </Button>
                    </Form>
                </TabPanel>
            </Tabs>
        </TabsContext.Provider>
    );
}
