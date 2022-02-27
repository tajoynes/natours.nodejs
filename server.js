//Server starting file...
//Set up configuration file first
const mongoose = require('mongoose'); //object data modeling library allows for simple and quick development of mongoDB database interactions
const dotenv = require('dotenv');

//Handle uncaught exceptions globally, positioned at the top of code to listen
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, closing application....');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
//Read the app file after processing the configuration file
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection succesful..'));

// // Mongoose schema defines the parameters of the documents within that collection.
// const tourSchema = new mongoose.Schema({
//   //Schema Types
//   name: {
//     type: String,
//     required: [true, 'Tour must have a name'], //Validator
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//     max: 5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'Tour must have a price'],
//   },
// });

// const Tour = mongoose.model('Tour', tourSchema);

// //Testing tour model schema
// const testTour1 = new Tour({
//   name: 'The Village Hiddin in the Leaves',
//   rating: 5,
//   price: 599,
// });

// testTour1
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(() => {
//     console.log('Error, invalid tour properties');
//   });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App.js running on ${port}!`);
});

//Handle unhandle promise rejections globally
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandle Rejection.. Closing application...');
  server.close(() => {
    process.exit(1);
  });
});
