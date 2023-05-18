import React from 'react';
import TransportTable from 'main/components/Transports/TransportTable';
import { transportFixtures } from 'fixtures/transportFixtures';

export default {
    title: 'components/Transports/TransportTable',
    component: TransportTable
};

const Template = (args) => {
    return (
        <TransportTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    transports: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    transports: transportFixtures.threeTransports,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    transports: transportFixtures.threeTransports,
    showButtons: true
};