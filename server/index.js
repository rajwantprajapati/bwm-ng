const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/dev");
const Rental = require("./models/rental");
const FakeDb = require("./fake-db");
const rentalRoutes = require("./routes/rentals");

mongoose.connect(config.DB_URI, { useNewUrlParser: true }, () => {
    console.log("Connected To Db");
}).then(() => {
    const fakeDb = new FakeDb();
    fakeDb.seeDb();
});

const app = express();

app.use('/api/v1/rentals', rentalRoutes);

app.get('/rentals', (req, res) => {
    res.json({'sucess': true});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log("Server is listening at port "+ PORT + '...');
});