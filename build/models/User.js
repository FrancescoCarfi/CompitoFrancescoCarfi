"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
// importiamo il modulo di Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// definiamo lo schema per gli utenti
const citySchema = new mongoose_1.default.Schema({
    name: String,
    population: Number,
    men: Number,
    women: Number,
    isCapital: Boolean
});
exports.City = mongoose_1.default.model('City', citySchema);
