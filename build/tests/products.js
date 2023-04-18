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
require("chai").should();
const app_1 = require("../app");
const Product_1 = require("../models/Product");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const auth_1 = require("../routes/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtToken = "shhhhhhh";
const basicUrl = "/v1/products";
// Definizione della suite di test per i prodotti
describe.only("products", () => {
    // Definizione di un oggetto prodotto per l'utilizzo nei test
    const product = {
        name: "iphone14",
        brand: "apple",
        price: 1200,
    };
    // Definizione di un oggetto utente per l'utilizzo nei test
    const user = {
        name: "Carlo",
        surname: "Leonardi",
        email: "carloleonard83@gmail.com",
        password: "testtest",
    };
    let token;
    // Blocco di codice eseguito una sola volta prima dell'esecuzione dei test
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        // Creazione di un nuovo utente nel database
        const userCreated = new User_1.User({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: yield bcrypt_1.default.hash(user.password, auth_1.saltRounds),
        });
        yield userCreated.save();
        // Generazione del token di autenticazione per l'utente appena creato
        token = jsonwebtoken_1.default.sign({
            id: userCreated._id,
            email: userCreated.email,
            name: userCreated.name,
            surname: userCreated.surname,
        }, jwtToken);
        console.log("token:", token);
    }));
    // Blocco di codice eseguito una sola volta dopo l'esecuzione dei test
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Rimozione dell'utente creato durante l'esecuzione dei test
        yield User_1.User.findOneAndDelete({ email: user.email });
    }));
    describe("create product", () => {
        let id;
        // Prima di ogni test, cancella il prodotto creato in questo blocco di test
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.Product.findByIdAndDelete(id);
        }));
        // Test di fallimento per codice di stato 401 (unauthorized)
        it("failed test 401", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status } = yield (0, supertest_1.default)(app_1.app).post(basicUrl).send(product);
            status.should.be.equal(401);
        }));
        // Test di successo per codice di stato 201 (created)
        it("success test 201", () => __awaiter(void 0, void 0, void 0, function* () {
            // Effettua la richiesta POST al server per creare un nuovo prodotto
            const { status, body } = yield (0, supertest_1.default)(app_1.app)
                .post(basicUrl)
                .send(product)
                .set({ authorization: token });
            // Verifica che il codice di stato della risposta sia 201
            status.should.be.equal(201);
            // Verifica che la risposta contenga i dati del prodotto appena creato
            body.should.have.property("_id");
            body.should.have.property("name").equal(product.name);
            body.should.have.property("brand").equal(product.brand);
            body.should.have.property("price").equal(product.price);
            // Salva l'ID del prodotto creato in questo test per poterlo cancellare dopo
            id = body._id;
        }));
    });
    describe("update product", () => {
        let id;
        const newBrand = "google";
        // Crea un prodotto prima di ogni test
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Product_1.Product.create(product);
            id = p._id.toString();
        }));
        // Cancella il prodotto creato dopo ogni test
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.Product.findByIdAndDelete(id);
        }));
        // Testa l'aggiornamento senza autenticazione
        it("test failed 401", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(Object.assign(Object.assign({}, product), { brand: newBrand }));
            status.should.be.equal(401);
        }));
        // Testa l'aggiornamento con successo
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(Object.assign(Object.assign({}, product), { brand: newBrand }))
                .set({ authorization: token });
            status.should.be.equal(200);
            body.should.have.property("_id");
            body.should.have.property("name").equal(product.name);
            body.should.have.property("brand").equal(newBrand);
            body.should.have.property("price").equal(product.price);
        }));
        // Testa l'aggiornamento con un id non valido
        it("test unsuccess 404 not valid mongoId", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = "a" + id.substring(1);
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${fakeId}`)
                .send(Object.assign(Object.assign({}, product), { brand: newBrand }))
                .set({ authorization: token });
            status.should.be.equal(404);
        }));
        // Testa l'aggiornamento con un campo brand mancante
        it("test unsuccess 400 missing brand", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeProduct = Object.assign({}, product);
            delete fakeProduct.brand;
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(fakeProduct)
                .set({ authorization: token });
            status.should.be.equal(400);
        }));
        // Testa l'aggiornamento con un campo price non numerico
        it("test unsuccess 400 price not number", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeProduct = Object.assign({}, product);
            fakeProduct.price = "pippo";
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .put(`${basicUrl}/${id}`)
                .send(fakeProduct)
                .set({ authorization: token });
            status.should.be.equal(400);
        }));
    });
    describe("delete product", () => {
        let id;
        // Prima di ogni test viene creato un prodotto e ne viene salvato l'id
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Product_1.Product.create(product);
            id = p._id.toString();
        }));
        // Testa il caso in cui la richiesta non ha l'autorizzazione corretta
        it("test failed 401", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status } = yield (0, supertest_1.default)(app_1.app).delete(`${basicUrl}/${id}`);
            status.should.be.equal(401);
        }));
        // Testa il caso di successo nella cancellazione di un prodotto
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status } = yield (0, supertest_1.default)(app_1.app)
                .delete(`${basicUrl}/${id}`)
                .set({ authorization: token });
            status.should.be.equal(200);
        }));
    });
    describe("get product", () => {
        let id;
        // Crea un nuovo prodotto prima di ogni test e salva il suo id
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const p = yield Product_1.Product.create(product);
            id = p._id.toString();
        }));
        // Dopo ogni test, cancella il prodotto creato in precedenza
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.Product.findByIdAndDelete(id);
        }));
        // Dopo ogni test, cancella il prodotto creato in precedenza
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app).get(`${basicUrl}/${id}`);
            status.should.be.equal(200);
            body.should.have.property("_id").equal(id);
            body.should.have.property("name").equal(product.name);
            body.should.have.property("brand").equal(product.brand);
            body.should.have.property("price").equal(product.price);
        }));
        // Testa il caso in cui l'id del prodotto non è valido e la richiesta fallisce (404 Not Found)
        it("test unsuccess 404 not valid mongoId", () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = "a" + id.substring(1);
            const { status } = yield (0, supertest_1.default)(app_1.app).get(`${basicUrl}/${fakeId}`);
            status.should.be.equal(404);
        }));
    });
    describe("get products", () => {
        let ids = [];
        const products = [
            {
                name: "iphone14",
                brand: "apple",
                price: 1200,
            },
            {
                name: "s22",
                brand: "samsung",
                price: 100,
            },
            {
                name: "s22",
                brand: "motorola",
                price: 300,
            },
        ];
        // Inserimento dei prodotti nel database prima di ogni test
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield Promise.all([
                Product_1.Product.create(products[0]),
                Product_1.Product.create(products[1]),
                Product_1.Product.create(products[2]),
            ]);
            ids = response.map((item) => item._id.toString());
        }));
        // Rimozione dei prodotti dal database dopo ogni test
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                Product_1.Product.findByIdAndDelete(ids[0]),
                Product_1.Product.findByIdAndDelete(ids[1]),
                Product_1.Product.findByIdAndDelete(ids[2]),
            ]);
        }));
        // Test per la chiamata GET alla lista di prodotti
        it("test success 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app).get(basicUrl);
            status.should.be.equal(200);
            body.should.have.property("length").equal(products.length);
        }));
        // Test per la chiamata GET alla lista di prodotti filtrati per marca
        it("test success 200 with query params", () => __awaiter(void 0, void 0, void 0, function* () {
            const { status, body } = yield (0, supertest_1.default)(app_1.app).get(`${basicUrl}?brand=apple`);
            status.should.be.equal(200);
            body.should.have.property("length").equal(1);
        }));
    });
});
