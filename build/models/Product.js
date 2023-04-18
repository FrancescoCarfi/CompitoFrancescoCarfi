"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
// Questo file definisce uno schema Mongoose per la collezione "Product"
const mongoose_1 = __importDefault(require("mongoose"));
// Definiamo lo schema Mongoose per la collezione "Product"
const ProductSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true }, // campo "price" di tipo numerico e obbligatorio
});
// Creiamo un modello Mongoose per la collezione "Product" utilizzando lo schema definito
exports.Product = mongoose_1.default.model("Product", ProductSchema);
// Lo schema definisce la struttura della collezione "Product" e i tipi di dati dei campi 
// che la compongono. In questo caso, la collezione ha tre campi: "name", "brand" e "price". 
// "name" e "brand" sono di tipo stringa e obbligatori, mentre "price" è di tipo numerico e 
// obbligatorio. Successivamente, viene creato un modello Mongoose per la collezione "Product" 
// utilizzando lo schema definito. Questo modello consente di eseguire operazioni CRUD sulla 
// collezione "Product" in MongoDB.
