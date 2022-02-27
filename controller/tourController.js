// const fs = require('fs'); //Only used to read file when testing
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
//Import tour data as a json file for testing
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Param middleware to check if tour ID is valid
//Will be using IDs generated by MongoDB
// exports.checkID = (req, res, next, val) => {
//   console.log(`Current tour id is ${val}!`);
//   if (req.params.id * 1 > tours.length - 1) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request',
    });
  }
  next();
};

//Route handlers/controller

//Aliasing
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//Refactored get Tours
exports.getTours = catchAsync(async (req, res) => {
  //Execute query object
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //Send response
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// exports.getTours = async (req, res) => {
//   try {
//     //Define query object with excluded fields
//     //Query Object
//     // const queryObj = { ...req.query };
//     // //Excluded fields array
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // //Advance filtering
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
//     // console.log(JSON.parse(queryStr));

//     // // const query = Tour.find(JSON.parse(queryStr));

//     // //Create query object
//     // let query = Tour.find(JSON.parse(queryStr));

//     // //Sorting* the query object
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort('-createdAt');
//     // }
//     // //Field limiting* on the query object
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select('-__v');
//     // }
//     // //Pagination
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const numbTours = await Tour.countDocuments();
//     //   if (skip >= numbTours) throw new Error('Page does not exist!');
//     // }

//     //Execute query object
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await features.query;

//     //Send response
//     res.status(200).json({
//       status: 'Success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Fail',
//       message: err,
//     });
//   }
// };

exports.createTour = catchAsync(async (req, res, next) => {
  //Directly using the tour model calling the create method
  //Passing the data from 'req.body' that we want to store as a new tour
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'Fail',
  //     message: err,
  //   });
  // }
  //   const newId = tours[tours.length - 1].id + 1;
  //   const newTour = Object.assign({ id: newId }, req.body); //Creates a new object by merging two or more objects together
  //   //Array of current tours and pushing newTour to the new tour
  //   tours.push(newTour);
  //   //Async write file method, overriding the file and re-writing new data to the file
  //   //Convert javascript object to json by stringify
  //   fs.writeFile(
  //     `${__dirname}/../dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       res.status(201).json({
  //         status: 'Success',
  //         data: {
  //           tour: newTour,
  //         },
  //       });
  //     }
  //   );
});

//Refactored getTour controller
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(' No Tour found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// //Original
// exports.getTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }

//   //console.log(req.params);
//   //Convert id string to a number by multiplying it by one (type coercion)
//   //const id = req.params.id * 1;
//   // //Validating if the id entered is valid
//   // if(id > tours.length - 1) {
//   //     return res.status(400).json({
//   //         status: 'Fail',
//   //         message: 'Invalid Id'
//   //     });
//   // }
//   //Loop through the array in ascending order until it returns true and returns that element value
//   //const tour = tours.find((element) => element.id === id);
//   //   res.status(200).json({
//   //     status: 'Success',
//   //     data: {
//   //       tour,
//   //     },
//   //   });
// };

//Refactored updateTour controller
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(' No Tour found with that Id', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

// //Original
// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
//   // //validate tour id
//   //     if(req.params.id * 1 > tours.length - 1) {
//   //         return res.status(400).json({
//   //             status: 'fail',
//   //             message: 'Invalid id'
//   //         })
//   //     }
//   //confirm successful update of tour
// };

//Refactored deleteTour controller
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(' No Tour found with that Id', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
  console.log('Deleted!');
});

// //Original
// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'Success',
//       data: null,
//     });
//     console.log('Deleted!');
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
//   // if(req.params.id * 1 > tours.length - 1) {
//   //     return res.status(400).json({
//   //         status: 'fail',
//   //         message: 'Invalid id'
//   //     })
//   // }
// };

//Refactored Aggregate Pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: 'difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: 'price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

// //Original Aggregate Pipeline
// exports.getTourStats = async (req, res) => {
//   try {
//     const stats = await Tour.aggregate([
//       {
//         $match: { ratingAverage: { $gte: 4.5 } },
//       },
//       {
//         $group: {
//           _id: { $toUpper: 'difficulty' },
//           numTours: { $sum: 1 },
//           numRatings: { $sum: '$ratingQuantity' },
//           avgRating: { $avg: '$ratingAverage' },
//           avgPrice: { $avg: '$price' },
//           minPrice: { $min: '$price' },
//           maxPrice: { $max: 'price' },
//         },
//       },
//       {
//         $sort: { avgPrice: 1 },
//       },
//     ]);
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

//Refactored Aggregate Pipeline
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});

// //Original Aggregate pipeline
// exports.getMonthlyPlan = async (req, res) => {
//   try {
//     const year = req.params.year * 1;

//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           numTourStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       {
//         $addFields: {
//           month: '$_id',
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//         },
//       },
//       {
//         $sort: {
//           numTourStarts: -1,
//         },
//       },
//       {
//         $limit: 12,
//       },
//     ]);

//     res.status(200).json({
//       status: 'Success',
//       data: {
//         plan,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };