const apiUrl = 'http://localhost:5005/api/cds';
let deleteCDId = 0;

describe('CD API Integration', () => {
    it('should add a new CD via the API and display it on the frontend', () => {
        const newCD = {
            title: 'New CD',
            artist: 'New Artist',
            year: '2025'
        };

        cy.request('POST', apiUrl, newCD).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('title', newCD.title);
            expect(response.body).to.have.property('artist', newCD.artist);
            expect(response.body).to.have.property('year', parseInt(newCD.year, 10));
            deleteCDId = response.body.id;
        });

        cy.visit('http://localhost:5173/');
        cy.get('ul').should('contain', 'New CD');
        cy.get('ul').should('contain', 'New Artist');
    });

    it('should fetch and display the list of CDs from the API', () => {
        cy.request('GET', apiUrl).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');

            const cdList = response.body;
            cdList.forEach((cd) => {
                expect(cd).to.have.all.keys('title', 'artist', 'year', 'id');
            });
        });

        cy.visit('http://localhost:5173/');
        cy.get('ul').should('exist');
    });

    it('should delete a CD via the API and remove it from the frontend', () => {
        cy.request('DELETE', `${apiUrl}/${deleteCDId}`).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(204);

            cy.request('GET', apiUrl).then((getResponse) => {
                const remainingCds = getResponse.body;
                const deletedCD = remainingCds.find((cd) => cd.id === deleteCDId);
                expect(deletedCD).to.be.undefined;
            });
        });

        cy.visit('http://localhost:5173/');
        cy.get('ul').should('not.contain', 'CD to Delete');
    });
});
