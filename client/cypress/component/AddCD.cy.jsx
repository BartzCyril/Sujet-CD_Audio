import React from 'react'
import { mount } from 'cypress/react'
import AddCD from "../../src/components/AddCD.jsx";

describe('AddCd Component', () => {
  it('should render the form', () => {
    mount(<AddCD />);
    cy.get('input[name="title"]').should('exist');
    cy.get('input[name="artist"]').should('exist');
    cy.get('input[name="year"]').should('exist');
    cy.get('button').contains('Ajouter').should('exist');
  });

  it('should submit the form', () => {
    const onAdd = cy.stub().as('onAdd');
    mount(<AddCD onAdd={onAdd}/>);
    cy.get('input[name="title"]').type('New CD');
    cy.get('input[name="artist"]').type('New Artist');
    cy.get('input[name="year"]').type('2021');
    cy.get('button').contains('Ajouter').click();
    cy.get('@onAdd').should('have.been.calledOnce');
  });
});