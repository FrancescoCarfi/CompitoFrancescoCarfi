import request from 'supertest';
import app from '../app';
import { assert } from 'chai';
import { City } from '../models/User';
require("chai").should();

describe("GET /cities", () => {
    it("restituire un array di città con lo stato 200", async () => {
      const response = await request(app).get("/cities");
      response.status.should.equal(200);
      response.body.should.be.an("array");
    });
    it("ritorna le città quando non viene applicato nessun filtro sulla popolazione", async () => {
        const response = await request(app).get("/cities");
        response.status.should.equal(200);
        response.body.should.be.an("array");
        const allCities = await City.find();
        response.body.should.have.lengthOf(allCities.length);
    });  
});

describe("GET /cities/:id", () => {
    it("città con l'id specificato con lo status 200", async () => {
      
      const newCity = await City.create({ name: "TestCity", population: 10000 });
      
      
      const response = await request(app).get(`/cities/${newCity._id}`);
      
      
      response.status.should.equal(200);
      response.body.should.have.property("name", "TestCity");
      response.body.should.have.property("population", 10000);
    });

});

describe('PUT /cities/:id', () => {
  let cityId: string;
  
  before(async () => {
    
    const city = new City({ name: 'Roma', population: 2900000 });
    await city.save();
    cityId = city._id.toString();
  });
  

  it('modificare correttamente i dati di una città esistente', async () => {
    const res = await request(app)
      .put(`/cities/${cityId}`)
      .send({ population: 3000000 });

    assert.equal(res.status, 200);
    assert.equal(res.body.population, 3000000);
  });

  it('errore 404 per una città inesistente', async () => {
    const res = await request(app)
      .put('/cities/123456789012345678901234')
      .send({ population: 3000000 });

    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Città non trovata');
  });

  after(async () => {
    
    await City.findByIdAndDelete(cityId);
  });
});

describe('DELETE /cities/:id', () => {
  let cityId: string;

  before(async () => {
    
    const city = new City({ name: 'Roma', population: 2900000 });
    await city.save();
    cityId = city._id.toString();
  });

  it(' eliminare correttamente una città esistente', async () => {
    const res = await request(app)
      .delete(`/cities/${cityId}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Roma');
    assert.equal(res.body.population, 2900000);

    
    const deletedCity = await City.findById(cityId);
    assert.isNull(deletedCity);
  });

  it('errore 404 per una città inesistente', async () => {
    const res = await request(app)
      .delete('/cities/123456789012345678901234');

    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Città non trovata');
  });

  after(async () => {
    
    await City.findByIdAndDelete(cityId);
  });
});

describe('POST /cities', () => {
    it(' inserire correttamente una nuova città', async () => {
      const res = await request(app)
        .post('/cities')
        .send({ name: 'Milano', population: 1400000 });
  
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'Milano');
      assert.equal(res.body.population, 1400000);
    });
  });

  
  