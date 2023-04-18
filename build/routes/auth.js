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
exports.isAuth = exports.saltRounds = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator"); // middleware per validare i dati della richiesta
const User_1 = require("../models/User"); // modello di dati dell'utente
const bcrypt_1 = __importDefault(require("bcrypt")); // libreria per l'hashing delle password
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // libreria per la gestione dei JSON Web Token
exports.saltRounds = 10; // numero di salti per l'hashing delle password
const jwtToken = "shhhhhhh"; // chiave segreta per la firma del JSON Web Token
const router = express_1.default.Router(); // router per gestire le rotte dell'applicazione
const uuid_1 = require("uuid"); // libreria per la generazione di UUID
const utils_1 = require("./utils"); // middleware per la gestione degli errori di validazione
// Middleware per verificare l'autenticazione dell'utente
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization; // estrae il JSON Web Token dall'header Authorization
    const user = jsonwebtoken_1.default.verify(auth, jwtToken); // decodifica il JSON Web Token e ne estrae l'id dell'utente
    res.locals.userFinded = yield User_1.User.findById(user.id); // cerca l'utente nel database tramite l'id
    if (res.locals.userFinded) { // se l'utente è presente nel database
        return next(); // passa il controllo al middleware successivo
    }
    else {
        return res.status(400).json({ message: "token not valid" }); // altrimenti restituisce un errore 400
    }
});
exports.isAuth = isAuth;
// Rotte per la registrazione di un nuovo utente
router.post("/signup", (0, express_validator_1.body)("email").isEmail(), // validazione dell'email
(0, express_validator_1.body)("name").notEmpty(), // validazione del nome
(0, express_validator_1.body)("surname").notEmpty(), // validazione del cognome
(0, express_validator_1.body)("password").isLength({ min: 8 }).notEmpty(), // validazione della password
utils_1.checkErrors, // middleware per gestire gli errori di validazione
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, password } = req.body; // estrae i dati dall'oggetto req.body
        const user = new User_1.User({
            name,
            surname,
            email,
            password: yield bcrypt_1.default.hash(password, exports.saltRounds),
            verify: (0, uuid_1.v4)(), // genera un UUID per la verifica dell'account
        });
        const response = yield user.save(); // salva l'utente nel database
        res.status(201).json({
            name: user.name,
            id: response._id,
            surname: user.surname,
            email: user.email,
        });
    }
    catch (err) {
        return res.status(409).json({ message: "Email is just present" }); // se l'email è già presente nel database, restituisce un errore 409
    }
}));
// Rotte per la validazione di un utente tramite token
router.get("/validate/:tokenVerify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Cerca un utente con il token di verifica specificato
    const user = yield User_1.User.findOne({ verify: req.params.tokenVerify });
    if (user) {
        // Se l'utente viene trovato, rimuovi il token di verifica e salva le modifiche
        user.verify = undefined;
        yield user.save();
        res.json({ message: "User enabled" });
    }
    else {
        // Altrimenti, restituisci un errore di token non valido
        res.status(400).json({ message: "token not valid" });
    }
}));
// Rotte per il login di un utente
router.post("/login", 
// Valida il formato della mail e della password usando express-validator
(0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 8 }).notEmpty(), 
// Gestisce eventuali errori di validazione
utils_1.checkErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Cerca un utente con l'email specificata
    const user = yield User_1.User.findOne({ email: req.body.email });
    if (
    // Se l'utente viene trovato, non ha bisogno di verifica e la password corrisponde, genera un token JWT
    user &&
        !user.verify &&
        (yield bcrypt_1.default.compare(req.body.password, user.password))) {
        const token = jsonwebtoken_1.default.sign({
            // Includi alcune informazioni dell'utente nel token
            id: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
        }, 
        // Usa una chiave segreta per firmare il token
        jwtToken);
        return res.json({ token });
    }
    else {
        // Altrimenti, restituisci un errore di credenziali non valide
        res.status(401).json({ message: "Invalid credentials" });
    }
}));
// Rotta per ottenere i dettagli dell'utente autenticato
router.get("/me", 
// Verifica che il token JWT sia presente nell'header dell'autorizzazione
(0, express_validator_1.header)("authorization").isJWT(), 
// Gestisce eventuali errori di validazione
utils_1.checkErrors, 
// Verifica che il token JWT sia valido e decodifica le informazioni dell'utente
exports.isAuth, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Prende le informazioni dell'utente decodificate dal middleware isAuth
    const userFinded = res.locals.userFinded;
    // Restituisce solo alcune informazioni dell'utente
    res.json({
        id: userFinded._id,
        name: userFinded.name,
        surname: userFinded.surname,
        email: userFinded.email,
    });
}));
// Esporta il router
exports.default = router;
