import React from 'react'
import { mount } from 'cypress/react'
import CDList from "../../src/components/CDList.jsx";

describe('CDList Component', () => {
    it('should render the list of CDs', () => {
        mount(<CDList />);
        cy.get("h2").contains("Liste des CD 🎵").should('exist');
        cy.get("ul").should('exist');
        cy.get("li").should('exist');
    });
});