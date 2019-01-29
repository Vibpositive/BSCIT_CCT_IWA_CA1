const request = require("supertest");

import { expect } from 'chai';
import { it, describe } from "mocha";
import { createApp } from "../src/app";

describe("Logs in", () =>{
    it("Should return a JWT token", async () => {
        const app = await createApp();
        return request(app).post("/api/v1/auth/login")
        .set("Accespt", "application/json")
        .send({ email: 'random@email.com', password: "secret" })
        .expect(200)
        .expect((res) => {
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('token')
        })
    });
});