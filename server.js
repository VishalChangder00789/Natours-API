const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
// console.log(process.env);

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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// TEST
