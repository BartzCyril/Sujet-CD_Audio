process.env.PORT = 5006;
const request = require('supertest');
const app = require('../server');
const pool = require('../configs/db');

describe('CD Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /cds', () => {
        it('should return all CDs', async () => {
            const mockCDs = [{ id: 1, title: 'CD1', artist: 'Artist1', year: 2025 }];
            pool.query = jest.fn().mockResolvedValue({ rows: mockCDs });

            const response = await request(app).get('/api/cds');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCDs);
        });

        it('should handle errors', async () => {
            pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/cds');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('POST /cds', () => {
        it('should add a new CD', async () => {
            const newCD = { title: 'New CD', artist: 'New Artist', year: 2025 };
            const mockCD = { id: 1, ...newCD };
            pool.query = jest.fn().mockResolvedValue({ rows: [mockCD] });

            const response = await request(app).post('/api/cds').send(newCD);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockCD);
        });

        it('should handle errors', async () => {
            pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/api/cds').send({ title: 'CD', artist: 'Artist', year: 2025 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('DELETE /cds/:id', () => {
        it('should delete a CD', async () => {
            pool.query = jest.fn().mockResolvedValue({});

            const response = await request(app).delete('/api/cds/1');

            expect(response.status).toBe(204);
        });

        it('should handle errors', async () => {
            pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/api/cds/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});