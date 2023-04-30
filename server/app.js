const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");

//imports
const doctorsRoutes = require("./Routes/doctorsRoutes");
const facultiesRoutes = require("./Routes/facultiesRoutes");
const subjectsRoutes = require("./Routes/subjectsRoutes");
const lecturesRoutes = require("./Routes/lecturesRoutes");
const usersRoutes = require("./Routes/usersRoutes");
const productsRoutes = require("./Routes/productsRoutes");

//express app
const app = express();

const { delay } = require("./middlewares/delay");
const { logRequests } = require("./middlewares/logRequests");

//middle ware
app.use(logRequests);
//app.use(delay);
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000, // Around 10MB
    },
    abortOnLimit: true,
  })
);

//routes
app.get("/api/test", (req, res) => {
  res.send("its working");
});
app.use("/api/Doctors", doctorsRoutes);
app.use("/api/Faculties", facultiesRoutes);
app.use("/api/Subjects", subjectsRoutes);
app.use("/api/lectures", lecturesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);

//listining to port and connect to db
app.listen(process.env.PORT, () => {
  console.log("lisiting to port", process.env.PORT);
});

//testroute
app.get("/test", (req, res) => {
  res.json("test get is working");
});

const { Lectures } = require("./models/Lecture");

app.post("/test", async (req, res) => {});
