const express = require("express");
const router = express.Router();
const Rental = require("../models/rental");
const UserCtrl = require("../controllers/user");
const {normalizeErrors} = require("../helpers/mongoose");
const User = require("../models/user");

router.get('/secret', UserCtrl.authMiddleWare ,(req, res) => {
    res.json({"secret": true});
});

router.get('/manage', UserCtrl.authMiddleWare, (req, res) => {
    const user = res.locals.user;
    Rental.where({user})
          .populate('bookings')
          .exec((err, foundRental) => {
            if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }

            return res.json(foundRental); 
          });
});

router.get("/:id", (req, res) => {
    const rentalId = req.params.id;

    Rental.findById(rentalId)
          .populate('user', 'username -_id')
          .populate('bookings', 'startAt endAt -_id')
          .exec((err, foundRental) => {
            if(err){
                return res.status(422).send({errors: [{title: 'Rental Error', detail: 'Could not find rental'}]});
            }
            return res.json(foundRental);
          })
});

router.delete('/:id', UserCtrl.authMiddleWare, (req, res) => {
    const user = res.locals.user;

    Rental.findById(req.params.id)
          .populate('user', '_id')
          .populate({
              path: 'booking',
              select: 'startAt',
              match: {startAt: {$gt: new Date()}}
          })
          .exec((err, foundRental) => {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            if(user.id !== foundRental.user.id) {
                return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'Only rental owner can delete the rental!'}]}); 
            }
            if(foundRental.bookings.length > 0){
                return res.status(422).send({errors: [{title: 'Active Booking!', detail: 'Can not delete rental with active bookings!'}]}); 
            }

            foundRental.remove((err) => {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)});  
                }
                return res.json({'status': 'Rental is deleted successfully'});
            });
          });
});

router.get('', (req, res) => {
    const city =  req.query.city;
    const query = city ? {city: city.toLowerCase()} : {};
    
    Rental.find(query)
        .select('-bookings')
        .exec((err, foundRentals) => {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        if(city && foundRentals.length == 0) {
            return res.status(422).send({errors: [{title: 'No Rentals Found!', detail: `There are no rentals for city ${city}`}]}); 
        }
        return res.json(foundRentals);
        });
});

router.post('', UserCtrl.authMiddleWare, (req, res) => {
    const {title, city, street, category, image, shared, bedrooms, description, dailyRate} = req.body;
    const user = res.locals.user;
    const rental = new Rental({title, city, street, category, image, shared, bedrooms, description, dailyRate});
    rental.user = user;
    Rental.create(rental, (err, newRental) => {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }
        User.updateOne({_id: user.id}, {$push: {rentals: newRental}}, ()=>{});
        return res.json(newRental);
    });
});

module.exports = router;