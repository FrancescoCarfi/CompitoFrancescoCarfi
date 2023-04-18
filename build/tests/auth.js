"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const chai_1 = require("chai");
const User_1 = require("../models/User");
require("chai").should();
describe("GET /cities", () => {
    it("should return an array of cities with status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/cities");
        response.status.should.equal(200);
        response.body.should.be.an("array");
    }));
    it("should return all cities when no population filter is applied", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/cities");
        response.status.should.equal(200);
        response.body.should.be.an("array");
        const allCities = yield User_1.City.find();
        response.body.should.have.lengthOf(allCities.length);
    }));
});
describe("GET /cities/:id", () => {
    it("should return a city with the specified id with status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new city in the database
        const newCity = yield User_1.City.create({ name: "TestCity", population: 10000 });
        // Make a request to the endpoint using the city's id
        const response = yield (0, supertest_1.default)(app_1.default).get(`/cities/${newCity._id}`);
        // Verify that the response contains the expected city
        response.status.should.equal(200);
        response.body.should.have.property("name", "TestCity");
        response.body.should.have.property("population", 10000);
    }));
});
describe('PUT /cities/:id', () => {
    let cityId;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        // Inserisco una città di esempio nel database
        const city = new User_1.City({ name: 'Roma', population: 2900000 });
        yield city.save();
        cityId = city._id.toString();
    }));
    it('Dovrebbe modificare correttamente i dati di una città esistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/cities/${cityId}`)
            .send({ population: 3000000 });
        chai_1.assert.equal(res.status, 200);
        chai_1.assert.equal(res.body.population, 3000000);
    }));
    it('Dovrebbe restituire un errore 404 per una città inesistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put('/cities/123456789012345678901234')
            .send({ population: 3000000 });
        chai_1.assert.equal(res.status, 404);
        chai_1.assert.equal(res.body.message, 'Città non trovata');
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Rimuovo la città di esempio dal database
        yield User_1.City.findByIdAndDelete(cityId);
    }));
});
describe('DELETE /cities/:id', () => {
    let cityId;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        // Inserisco una città di esempio nel database
        const city = new User_1.City({ name: 'Roma', population: 2900000 });
        yield city.save();
        cityId = city._id.toString();
    }));
    it('Dovrebbe eliminare correttamente una città esistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/cities/${cityId}`);
        chai_1.assert.equal(res.status, 200);
        chai_1.assert.equal(res.body.name, 'Roma');
        chai_1.assert.equal(res.body.population, 2900000);
        // Verifico che la città sia stata eliminata dal database
        const deletedCity = yield User_1.City.findById(cityId);
        chai_1.assert.isNull(deletedCity);
    }));
    it('Dovrebbe restituire un errore 404 per una città inesistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete('/cities/123456789012345678901234');
        chai_1.assert.equal(res.status, 404);
        chai_1.assert.equal(res.body.message, 'Città non trovata');
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Rimuovo la città di esempio dal database, nel caso in cui il test abbia fallito
        yield User_1.City.findByIdAndDelete(cityId);
    }));
});
describe('POST /cities', () => {
    it('Dovrebbe inserire correttamente una nuova città', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/cities')
            .send({ name: 'Milano', population: 1400000 });
        chai_1.assert.equal(res.status, 200);
        chai_1.assert.equal(res.body.name, 'Milano');
        chai_1.assert.equal(res.body.population, 1400000);
    }));
});
