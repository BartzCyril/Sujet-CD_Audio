process.env.PORT = 5007;
const { GenericContainer } = require('testcontainers');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const app = require('../server');
const { setPool } = require("../Controllers/cdController");

let container;
let pool;

jest.setTimeout(30000);

describe('PostgreSQL Test Container', () => {
    beforeAll(async () => {
        container = await new GenericContainer('postgres')
            .withExposedPorts(5432)
            .withEnvironment({
                'POSTGRES_USER': 'testuser',
                'POSTGRES_PASSWORD': 'testpassword',
                'POSTGRES_DB': 'testdb'
            })
            .start();

        const port = container.getMappedPort(5432);
        const host = container.getHost();

        pool = new Pool({
            user: 'testuser',
            host: host,
            database: 'testdb',
            password: 'testpassword',
            port: port,
        });

        setPool(pool);

        console.log('PostgreSQL running on', host, port);

        const sqlPath = path.join(__dirname, '../configs/import.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf-8');
            await pool.query(sql);
            await pool.query("INSERT INTO cds (title, artist, year) VALUES ('CD', 'Artist', 2025)");
        }
    });

    afterAll(async () => {
        if (pool) {
            await pool.end().catch(err => console.error('Error closing pool', err));
        }
        if (container) {
            await container.stop();
        }
    });

    describe('GET /cds', () => {
        it('should return all CDs', async () => {
            const response = await request(app).get('/api/cds');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
    });

    describe('POST /cds', () => {
        it('should add a new CD', async () => {
            const newCD = { title: 'New CD', artist: 'New Artist', year: 2025 };
            const response = await request(app).post('/api/cds').send(newCD);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New CD');
        });
    });

    describe('POST /cds => Get status 500', () => {
        it('should return status 500', async () => {
            const response = await request(app).post('/api/cds').send({ title: 'CD', arqzdzqtist: 'Artist' });
            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /cds/:id', () => {
        it('should delete a CD', async () => {
            const result = await pool.query("INSERT INTO cds (title, artist, year) VALUES ('CD', 'Artist', 2025) RETURNING id");
            const id = result.rows[0].id;

            const response = await request(app).delete(`/api/cds/${id}`);
            expect(response.status).toBe(204);
        });
    });

    describe('DELETE /cds/:id => Get status 500', () => {
        it('should return status 500', async () => {
            const response = await request(app).delete('/api/cds/qzdqzd');
            expect(response.status).toBe(500);
        });
    })
});