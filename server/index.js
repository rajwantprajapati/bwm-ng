const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config");
const FakeDb = require("./fake-db");
const path = require('path');

const rentalRoutes = require("./routes/rentals"),
      userRoutes = require("./routes/users"),
      bookingRoutes = require("./routes/booking");

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log("Connected To Db");
}).then(function() {
    if(process.env.NODE_ENV !== 'production'){
        const fakeDb = new FakeDb();
        /* fakeDb.seeDb(); */
    }    
});

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

if(process.env.NODE_ENV === 'production'){
    const appPath = path.join(__dirname, '..', 'dist/bwm-project');
    app.use(express.static(appPath));

    app.get('*', function(req, res) {
        res.sendFile(path.resolve(appPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, ()=>{
    console.log("Server is listening at port "+ PORT + '...');
});