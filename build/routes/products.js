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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const utils_1 = require("./utils");
const Product_1 = require("../models/Product");
const auth_1 = require("./auth");
// Creazione di un router per gestire le richieste relative ai prodotti
const router = express_1.default.Router();
// per creare un nuovo prodotto
router.post("/", 
// Validazione del token di autenticazione presente nell'header della richiesta
(0, express_validator_1.header)("authorization").isJWT(), 
// Validazione dei campi obbligatori del body della richiesta (name, brand, price)
(0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("brand").exists().isString(), (0, express_validator_1.body)("price").exists().isNumeric(), 
// Verifica la presenza di eventuali errori di validazione
utils_1.checkErrors, 
// Verifica l'autenticazione dell'utente che sta effettuando la richiesta
auth_1.isAuth, 
// Gestione della richiesta
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand, price } = req.body;
    // Creazione di un nuovo oggetto Product con i dati passati nella richiesta
    const product = new Product_1.Product({ name, brand, price });
    // Salvataggio del prodotto appena creato nel database
    const productSaved = yield product.save();
    // Invio della risposta con lo stato 201 (creazione avvenuta con successo) e i dati del prodotto appena salvato
    res.status(201).json(productSaved);
}));
// aggiornare un prodotto esistente
router.put("/:id", 
// Validazione del token di autenticazione presente nell'header della richiesta
(0, express_validator_1.header)("authorization").isJWT(), 
// Validazione del parametro id presente nell'URL della richiesta
(0, express_validator_1.param)("id").isMongoId(), 
// Validazione dei campi obbligatori del body della richiesta (name, brand, price)
(0, express_validator_1.body)("name").exists().isString(), (0, express_validator_1.body)("brand").exists().isString(), (0, express_validator_1.body)("price").exists().isNumeric(), 
// Verifica la presenza di eventuali errori di validazione
utils_1.checkErrors, 
// Verifica l'autenticazione dell'utente che sta effettuando la richiesta
auth_1.isAuth, 
// Gestione della richiesta
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, brand, price } = req.body;
    try {
        // Cerca il prodotto con l'id specificato nel database
        const product = yield Product_1.Product.findById(id);
        // Se il prodotto non esiste, ritorna una risposta con lo stato 404 (non trovato) e un messaggio di errore
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        // Aggiorna i campi del prodotto con i dati passati nella richiesta
        product.name = name;
        product.brand = brand;
        product.price = price;
        // Salva le modifiche apportate al prodotto nel database
        const productSaved = yield product.save();
        // Invio della risposta con i dati del prodotto aggiornato
        res.json(productSaved);
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
router.delete("/:id", (0, express_validator_1.header)("authorization").isJWT(), // verifica che l'header 'authorization' contenga un token JWT valido
(0, express_validator_1.param)("id").isMongoId(), // verifica che il parametro 'id' corrisponda a un ID valido di MongoDB
utils_1.checkErrors, // middleware per gestire gli eventuali errori di validazione
auth_1.isAuth, // middleware per gestire l'autenticazione mediante token JWT
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // recupera l'ID dal parametro della richiesta
    const product = yield Product_1.Product.findById(id); // cerca il prodotto corrispondente all'ID fornito
    if (!product) { // se il prodotto non esiste, restituisce un errore 404
        return res.status(404).json({ message: "product not found" });
    }
    yield Product_1.Product.findByIdAndDelete(id); // altrimenti, cancella il prodotto corrispondente all'ID
    res.json({ message: "product deleted" }); // e restituisce un messaggio di successo
}));
router.get("/:id", (0, express_validator_1.param)("id").isMongoId(), utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // recupera l'ID dal parametro della richiesta
    const product = yield Product_1.Product.findById(id); // cerca il prodotto corrispondente all'ID fornito
    if (!product) { // se il prodotto non esiste, restituisce un errore 404
        return res.status(404).json({ message: "product not found" });
    }
    res.json(product); // altrimenti, restituisce le informazioni del prodotto
}));
router.get("/", (0, express_validator_1.query)("name").optional().isString(), // verifica che il parametro 'name', se presente, sia una stringa
(0, express_validator_1.query)("brand").optional().isString(), // verifica che il parametro 'brand', se presente, sia una stringa
(0, express_validator_1.query)("price").optional().isNumeric(), // verifica che il parametro 'price', se presente, sia un numero
utils_1.checkErrors, // middleware per gestire gli eventuali errori di validazione
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find(Object.assign({}, req.query));
    res.json(products);
}));
exports.default = router;
