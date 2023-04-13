const express = require("express");
const fs = require("fs");
const app = express();

//Todo : variables
const port = 3000;
const filePath = `${__dirname}/dev-data/data/tours-simple.json`;

//Todo: Read Data
//?? This statement will take all the data from tours-simple.json file in a json format
//?? Then convert it to Javascript object and store in tours variable.

const tours = JSON.parse(fs.readFileSync(filePath));

//! Middlewares
//#region --------- Middleware (Recognize incoming req object has JSON object) ---------
app.use(express.json());

//#endregion --------- Middleware (Recognize incoming req object has JSON object) ---------

/*



///////////////////////// SEPERATION  /////////////////////////


*/

//! Basic routing

//#region --------- BASIC ROUTING ---------
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "recieving from server",
//     app: "Natours :  Bishal Changder",
//   });
// });
//#endregion --------- BASIC ROUTING ---------

//#region ---------- GET ALL TOURS ----------
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});
//#endregion ---------- GET ALL TOURS ----------

/*



///////////////////////// SEPERATION  /////////////////////////


*/
//! Posting Data
//#region --------- POST A TOUR ---------
app.post(`/api/v1/tours`, (req, res) => {
  console.log(req);
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
});

//#endregion --------- POST A TOUR ---------

//#region --------- BASIC POSTING ---------

app.post("/", (req, res) => {
  res.send("Endpoint active");
});
//#endregion --------- BASIC POSTING ---------

/*



///////////////////////// SEPERATION  /////////////////////////


*/
// ? Starting server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
