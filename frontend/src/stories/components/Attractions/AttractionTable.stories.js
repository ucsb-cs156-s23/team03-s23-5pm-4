import React from 'react';
import AttractionTable from 'main/components/Attractions/AttractionTable';
import { attractionFixtures } from 'fixtures/attractionFixtures';

export default {
    title: 'components/Attractions/AttractionTable',
    component: AttractionTable
};

const Template = (args) => {
    return (
        <AttractionTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    attractions: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    attractions: attractionFixtures.threeAttractions,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    attractions: attractionFixtures.threeAttractions,
    showButtons: true
};
