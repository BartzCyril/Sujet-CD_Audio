import React from 'react'
import { mount } from 'cypress/react'
import CDItem from "../../src/components/CDItem.jsx";

describe('CDItem Component', () => {
    it('should render the CD item', () => {
        const cd = { title: 'CD Title', artist: 'CD Artist', year: 2025 };
        mount(<CDItem cd={cd} />);
        cy.get('span').contains('CD Title').should('exist');
        cy.get('span').contains('CD Artist').should('exist');
        cy.get('span').contains('2025').should('exist');
    });

    it('should delete the CD item', () => {
        const cd = { title: 'CD Title', artist: 'CD Artist', year: 2025, id: 1 };
        const onDelete = cy.stub().as('onDelete');
        mount(<CDItem cd={cd} onDelete={onDelete} />);
        cy.get('button').contains('Supprimer').click();
        cy.get('@onDelete').should('have.been.calledOnce');
        cy.get('@onDelete').should('have.been.calledWith', cd.id);
    });
});