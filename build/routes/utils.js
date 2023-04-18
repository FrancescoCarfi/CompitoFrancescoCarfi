"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrors = void 0;
const express_validator_1 = require("express-validator");
const checkErrors = (req, res, next) => {
    // Eseguiamo la validazione e otteniamo gli eventuali errori presenti nella richiesta
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // se l'errore riguarda la mancanza di autorizzazione, restituiamo una risposta con codice di 
        if (errors.array()[0].param === "authorization") {
            return res.status(401).json({ errors: errors.array() });
        }
        // altrimenti restituiamo una risposta con codice di stato 400
        return res.status(400).json({ errors: errors.array() });
    }
    // se non ci sono errori, proseguiamo alla prossima funzione middleware
    next();
};
exports.checkErrors = checkErrors;
