import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return a short description when given a valid name', async () => {
      const name = 'Tom_Holland';
      const response = await request(app.getHttpServer())
        .get('/')
        .query({ name })
        .expect(HttpStatus.OK);


      expect(response.text).toEqual(expect.any(String));
    });

    it('should return a 404 status code when given an invalid name', async () => {
      const name = 'Invalid Name';
      const response = await request(app.getHttpServer())
        .get('/')
        .query({ name })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(expect.objectContaining({
        statusCode: expect.any(Number),
        message: expect.any(String),
      }));
    });

    it('should return a 400 status code when given a name with no short description and similar names', async () => {
      const name = 'John';
      const response = await request(app.getHttpServer())
        .get('/')
        .query({ name })
        .expect(HttpStatus.BAD_REQUEST);


      expect(response.body).toEqual(expect.objectContaining({
        statusCode: expect.any(Number),
        message: expect.any(String),
      }));

    });
  });
});
