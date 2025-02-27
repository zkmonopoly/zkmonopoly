import { useForm, Controller } from 'react-hook-form';
import { Tabs, TabList, Tab, TabPanel, Form, Button, FieldError, Input, Label, TextField } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { tabStyles, tabListStyles, tabPanelStyles, tabsStyles } from '@/components/ui/styles/tabs';
import { buttonStyles } from '@/components/ui/styles/button';
import { textFieldsStyles } from '@/components/ui/styles/text-field';
import { formStyles } from '@/components/ui/styles/form';


const tabPanelStylesExtended = twJoin(tabPanelStyles, "md:w-[330px] w-[264px]");

export default function Home() {
    const { control } = useForm({
        defaultValues: {
            name: "",
            code: "",
        }
    });

    return (
        <Tabs orientation="vertical" className={tabsStyles}>
            <TabList aria-label="Menu" className={tabListStyles}>
                <Tab className={tabStyles} id="tabJoin">Join</Tab>
                <Tab className={tabStyles} id="tabCreate">Create</Tab>
            </TabList>
            <TabPanel id="tabJoin" className={tabPanelStylesExtended}>
                <Form className={formStyles}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'Name is required.' }}
                        render={({
                            field: { name, value, onChange, onBlur, ref },
                            fieldState: { invalid, error }
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
                    <Button type="submit" className={buttonStyles}>Submit</Button>
                </Form>
            </TabPanel>
            <TabPanel id="tabCreate" className={tabPanelStylesExtended}>
                Arma virumque cano, Troiae qui primus ab oris.
            </TabPanel>
        </Tabs>
    );
}