// importiamo il modulo di Mongoose
import mongoose from "mongoose";
// definiamo lo schema per gli utenti
const citySchema = new mongoose.Schema({
  name: String,
  population: Number,
  men: Number,
  women: Number,
  isCapital: Boolean
});

export const City = mongoose.model('City', citySchema);