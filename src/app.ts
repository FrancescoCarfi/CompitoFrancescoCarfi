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

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { City } from "./models/User";

mongoose.connect("mongodb://localhost/catasto", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}as any);

const app = express();
app.use(express.json());

// 1. Implementare una GET che ritorni tutte le città e le relative info associate
app.get("/cities", async (req: Request, res: Response) => {
  try {
    const overPopulation = req.query.overPopulation as string;
    const filter = overPopulation ? { population: { $gt: parseInt(overPopulation) } } : {};
    const cities = await City.find(filter);
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// 2. Implementare una GET che ritorni una singola città in base all'id
app.get("/cities/:id", async (req: Request, res: Response) => {
  try {
    const city = await City.findById(req.params.id);
    if (city) {
      res.json(city);
    } else {
      res.status(404).json({ message: "Città non trovata" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// 3. Implementare una PUT che mi permetta di modificare le info di una singola città
app.put("/cities/:id", async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (city) {
      res.json(city);
    } else {
      res.status(404).json({ message: "Città non trovata" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// 4. Implementare una DELETE che mi permetta di eliminare una città
app.delete("/cities/:id", async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (city) {
      res.json(city);
    } else {
      res.status(404).json({ message: "Città non trovata" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// 5. Implementare una POST che mi permetta di inserire una nuova città
app.post("/cities", async (req: Request, res: Response) => {
  try {
    const city = new City(req.body);
    const newCity = await city.save();
    res.json(newCity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// 6 implementare una POST che mi permetta di fondere 2 città, in un unica città
app.post('/cities/merge', async (req: Request, res: Response) => {
  try {
    const { city1, city2 } = req.body; 
    
    if (!city1 || !city2) {
      return res.status(400).json({ message: 'Missing city data' });
    }

    const mergedCity = new City({
      name: `${city1.name} - ${city2.name}`,
      population: city1.population + city2.population,
      men: city1.men + city2.men,
      women: city1.women + city2.women,
      isCapital: city1.isCapital || city2.isCapital
    });

    await mergedCity.save();

    res.status(201).json(mergedCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;