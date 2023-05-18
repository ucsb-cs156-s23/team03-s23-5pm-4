import React from 'react';
import TransportForm from 'main/components/Transports/TransportForm';
import { transportFixtures } from 'fixtures/transportFixtures';

export default {
    title: 'components/Transports/TransportForm',
    component: TransportForm
};

const Template = (args) => {
    return (
        <TransportForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Transport: transportFixtures.oneTransport,
    submitText: "",
    submitAction: () => { }
};