import React from 'react';
import AttractionForm from "main/components/Attractions/AttractionForm"
import { attractionFixtures } from 'fixtures/attractionFixtures';

export default {
    title: 'components/Attractions/AttractionForm',
    component: AttractionForm
};

const Template = (args) => {
    return (
        <AttractionForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Attraction: attractionFixtures.oneAttraction,
    submitText: "",
    submitAction: () => { }
};