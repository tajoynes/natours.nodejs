//Core Module
const express = require('express');
const tourController = require('../controller/tourController');
// const fs = require('fs');
const router = express.Router();

////----> Moved to it's seperate controller file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// //Route handlers/controller

// const getTours = (req, res) => {
//     res.status(200).json({
//         status: 'Success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     })
// };
// const createTour = (req, res) => {
//     const newId = tours[tours.length - 1 ].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body); //Creates a new object by merging two or more objects together
//     //Array of current tours and pushing newTour to the new tour
//     tours.push(newTour);
//     //Async write file method, overriding the file and re-writing new data to the file
//     //Convert javascript object to json by stringify
//     fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'Success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// };
// const getTour = (req, res) => {
//     console.log(req.params);
//     //Convert id string to a number by multiplying it by one (type coercion)
//     const id = req.params.id * 1;
//     //Validating if the id entered is valid
//     if(id > tours.length - 1) {
//         return res.status(400).json({
//             status: 'Fail',
//             message: 'Invalid Id'
//         });
//     }
//     //Loop through the array in ascending order until it returns true and returns that element value
//     const tour = tours.find(element => element.id === id)
//     res.status(200).json({
//         status: 'Success',
//         data: {
//             tour
//         }
//     });
// };
// const updateTour = (req, res) => {
// //validate tour id
//     if(req.params.id * 1 > tours.length - 1) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Invalid id'
//         })
//     }
//     //confirm successful update of tour
//     res.status(200).json({
//         status: 'Success',
//         data: {
//             tour: '<Tour Updated>'
//         }
//     })
// };
// const deleteTour = (req, res) => {
//     if(req.params.id * 1 > tours.length - 1) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Invalid id'
//         })
//     }
//     res.status(204).json({
//         status: 'Success',
//         data: null
//     })
//     console.log('Deleted!')
// };
//-*************************************

//Param middleware--Parameter mapping is used to provide
//pre-conditions to routes which use normalized placeholders.
//For example a :user_id parameter could automatically load a user's
//information from the database without any additional code
// router.param('id', tourController.checkID)

//Defining routes and http request

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;
