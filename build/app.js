"use strict";
// Creare un server API rest attraverso il framework NODEJS che rappresenti il catasto e le informazioni
// demografiche della citta come (popolazione totale, uomini, donne, divisi per città, aggiungere un
// boolean che rappresenti se la citta è anche capoluogo) Utilizzare un DB Mongo e Mongose per l'infrastruttura
// 1 Impementare una GET ritorni tutte le / cities e le info associate (associare dei query params
// per filtrare in base alla popolazione es. overPopulation=200000)
// 2
// 3 implementare una GET che ritorni una singola città in base all'id
// 4 implementare una PUT che mi permetta di modificare le info di una singola città
// 5 implementare una DELETE che mi permetta di eliminare una città 
// 6 implementare una POST che mi permetta di inserire una nuova città 
// 7 implementare una POST che mi permetta di fondere 2 città, in un unica città
// 8 Creare dei test unitari per la v erifica della correttezza delle API
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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./models/User");
mongoose_1.default.connect("mongodb://localhost/catasto", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
// 1. Implementare una GET che ritorni tutte le città e le relative info associate
app.get("/cities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const overPopulation = req.query.overPopulation;
        const filter = overPopulation ? { population: { $gt: parseInt(overPopulation) } } : {};
        const cities = yield User_1.City.find(filter);
        res.json(cities);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore interno del server" });
    }
}));
// 2. Implementare una GET che ritorni una singola città in base all'id
app.get("/cities/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield User_1.City.findById(req.params.id);
        if (city) {
            res.json(city);
        }
        else {
            res.status(404).json({ message: "Città non trovata" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore interno del server" });
    }
}));
// 3. Implementare una PUT che mi permetta di modificare le info di una singola città
app.put("/cities/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield User_1.City.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (city) {
            res.json(city);
        }
        else {
            res.status(404).json({ message: "Città non trovata" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore interno del server" });
    }
}));
// 4. Implementare una DELETE che mi permetta di eliminare una città
app.delete("/cities/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield User_1.City.findByIdAndDelete(req.params.id);
        if (city) {
            res.json(city);
        }
        else {
            res.status(404).json({ message: "Città non trovata" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore interno del server" });
    }
}));
// 5. Implementare una POST che mi permetta di inserire una nuova città
app.post("/cities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = new User_1.City(req.body);
        const newCity = yield city.save();
        res.json(newCity);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore interno del server" });
    }
}));
// 6 implementare una POST che mi permetta di fondere 2 città, in un unica città
app.post('/cities/merge', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city1, city2 } = req.body;
        if (!city1 || !city2) {
            return res.status(400).json({ message: 'Missing city data' });
        }
        const mergedCity = new User_1.City({
            name: `${city1.name} - ${city2.name}`,
            population: city1.population + city2.population,
            men: city1.men + city2.men,
            women: city1.women + city2.women,
            isCapital: city1.isCapital || city2.isCapital
        });
        yield mergedCity.save();
        res.status(201).json(mergedCity);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
exports.default = app;
