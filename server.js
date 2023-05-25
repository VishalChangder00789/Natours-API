const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); //1 is for exception   //0 for success
  });
});

dotenv.config({ path: "./config.env" });
// console.log(process.env);

//const DB = "mongodb+srv://vishal:vishal1@natoursdb.qy7cavl.mongodb.net/natours"; // with an error after vishal1 should be vishal
const DB = "mongodb+srv://vishal:vishal@natoursdb.qy7cavl.mongodb.net/natours";

// mongodb setup
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB Connection successful!");
  });

// test tour
// const testTour = new Tour({
//   name: "Fireflies",
//   rating: 5.5,
//   price: 500,
// });

// // save in databse
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);

  // Helps the server to finish all the pending request
  server.close(() => {
    process.exit(1); //1 is for exception   //0 for success
  });
});

// TEST
