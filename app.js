//Core Modules
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

//Error handling middleware
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
//Dev create Modules
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express(); //Express function passess methods to app variable

//Middleware Stack
//Middleware functions modify the request data between req and response
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

//Define port that's to be used, using listen method when server is running app.js
// const port = 5000;
//  app.listen(port, () => {
//      console.log(`App.js running on ${port}!`)
//  });

//Routing is to determine how application responds to client request and http method
//Read tours from json file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

/////////////////////////----> Messy Code but functional<----- /////////////////////////////////////

// ** //Specifiying root URL and http method GET request
// app.get('/api/v1/tours', (req, res) => {
//     res.status(200).json({
//         status: 'Success',
//         results: tours.length,
//         data: {
//             tours
//         }
//     })
// })
// .post('/api/v1/tours', (req, res) => {

//     //Creating new tour and new tour ID based on current tour length
//     const newId = tours[tours.length - 1 ].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body); //Creates a new object by merging two or more objects together

//     //Array of current tours and pushing newTour to the new tour
//     tours.push(newTour);

//     //Async write file method, overriding the file and re-writing new data to the file
//     //Convert javascript object to json by stringify
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: 'Success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// });
// //Specify and individual object to retrieved from the http get request via object id
// app.get('/api/v1/tours/:id', (req, res) => {
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
// })
// //Update tour in the tours array
// .patch('/api/v1/tours/:id', (req, res) => {
//     if(req.params.id * 1 > tours.length - 1) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Invalid id'
//         })
//     }
//     res.status(200).json({
//         status: 'Success',
//         data: {
//             tour: '<Tour Updated>'
//         }
//     })
// })
// //Delete tour from object array
// .delete('/api/v1/tours/:id', (req, res) => {
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
// }); ** //

//***********--------> Refactoring routes first iteration <------------*********//

// //Create variable for each HTTP request then pass them to each route
// //Route Handlers
// const getTours = (req, res) => {
//         res.status(200).json({
//             status: 'Success',
//             results: tours.length,
//             data: {
//                 tours
//             }
//         })
//     };
// const createTour = (req, res) => {
//         const newId = tours[tours.length - 1 ].id + 1;
//         const newTour = Object.assign({ id: newId }, req.body); //Creates a new object by merging two or more objects together
//         //Array of current tours and pushing newTour to the new tour
//         tours.push(newTour);
//         //Async write file method, overriding the file and re-writing new data to the file
//         //Convert javascript object to json by stringify
//         fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//             res.status(201).json({
//                 status: 'Success',
//                 data: {
//                     tour: newTour
//                 }
//             });
//         });
//     };
// const getTour = (req, res) => {
//         console.log(req.params);
//         //Convert id string to a number by multiplying it by one (type coercion)
//         const id = req.params.id * 1;
//         //Validating if the id entered is valid
//         if(id > tours.length - 1) {
//             return res.status(400).json({
//                 status: 'Fail',
//                 message: 'Invalid Id'
//             });
//         }
//         //Loop through the array in ascending order until it returns true and returns that element value
//         const tour = tours.find(element => element.id === id)
//         res.status(200).json({
//             status: 'Success',
//             data: {
//                 tour
//             }
//         });
//     };
// const updateTour = (req, res) => {
//     //validate tour id
//         if(req.params.id * 1 > tours.length - 1) {
//             return res.status(400).json({
//                 status: 'fail',
//                 message: 'Invalid id'
//             })
//         }
//         //confirm successful update of tour
//         res.status(200).json({
//             status: 'Success',
//             data: {
//                 tour: '<Tour Updated>'
//             }
//         })
//     };
// const deleteTour = (req, res) => {
//         if(req.params.id * 1 > tours.length - 1) {
//             return res.status(400).json({
//                 status: 'fail',
//                 message: 'Invalid id'
//             })
//         }
//         res.status(204).json({
//             status: 'Success',
//             data: null
//         })
//         console.log('Deleted!')
//     };

// const getUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };
// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Route not yet implemented!'
//     });
// };

//Define routes and HTTP request together

//Seperate and create - declare a modular route for each resource
// //Mounting a new router on a route
// const tourRouter = express.Router();
// const userRouter = express.Router();

//Router middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Unhandle Routes
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server..`,
  //   });
  //   const err = new Error(`Can't find ${req.originalUrl} on this server..`);
  //   err.status = 'fail';
  //   err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server..`, 404));
});

//Refactored error handler/controller
app.use(globalErrorHandler);

//Unrefactorted error handler
// app.use((err, req, res, next) => {
//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.statusCode || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

// tourRouter.route('/')
// .get(getTours)
// .post(createTour);
// tourRouter.route('/:id')
// .get(getTour)
// .patch(updateTour)
// .delete(deleteTour);
// userRouter.route('/')
// .get(getUsers)
// .post(createUser);
// userRouter.route('/:id')
// .get(getUser)
// .patch(updateUser)
// .delete(deleteUser);

////////////////////////////////////////////////////////////////////////////////

//Export app file
module.exports = app;
