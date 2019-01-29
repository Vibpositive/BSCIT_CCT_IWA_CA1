const request = require("supertest");

import { expect } from 'chai';
import { it, describe } from "mocha";
import { createApp } from "../src/app";

let app: any;
let token: string;

before(async () => {
    app = await createApp();
})

describe('Create a link', function () {
    it('respond with a token', function (done) {
        request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .send({ email: 'random@email.com', password: 'secret' })
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token')
                token = res.body.token;
            })
            .expect(200, done);
    });

    it('respond with a json', function (done) {
        request(app)
            .post('/api/v1/links')
            .set('x-auth-token', token)
            .set('Accept', 'application/json')
            .send({ title: 'some random title', url: 'soome random url' })
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('user')
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('url')
                expect(res.body).to.have.property('id')
            })
            .expect(200, done);
    });
});