describe('CD Management', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });

    it('should display the list of CDs', () => {
        cy.get('h1').contains('🎶 Gestion des CD 🎶');
        cy.get('ul').should('exist');
    });

    it('should add a new CD', () => {
        cy.get('input[name="title"]').type('New CD');
        cy.get('input[name="artist"]').type('New Artist');
        cy.get('input[name="year"]').type('2025');
        cy.get('button').contains('Ajouter').click();

        cy.get('ul').contains('New CD');
        cy.get('ul').contains('New Artist');
    });

    it('should delete a CD', () => {
        cy.get('ul').contains('New CD').parent().find('button').contains('Supprimer').click();
        cy.get('ul').should('not.contain', 'New CD');
    });
});