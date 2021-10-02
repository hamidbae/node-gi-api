import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import CONSTANT from "./helper/constant.js";

import weaponRouter from "./routes/weapon.js";
import materialRouter from "./routes/material.js";
// const artifactRoute = require('./routes/artifact')
// const elementRoute = require('./routes/element')
// const characterRoute = require('./routes/character')
// const materialRoute = require('./routes/material')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/weapon", weaponRouter);
app.use("/api/material", materialRouter);
// app.use('/artifact', artifactRoute)
// app.use('/element', elementRoute)
// app.use('/character', characterRoute)
// app.use('/material', materialRoute)

app.get("/", (req, res) => {
  res.send("hello");
});

mongoose
  .connect(CONSTANT.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(CONSTANT.PORT, () => {
      console.log("This app running on http://localhost:" + CONSTANT.PORT);
    });
  });
