const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
//MongoDB database
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.le9oj.mongodb.net/movieApp?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

//Routes Middleware
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

app.use("/movie", movieRoutes);
app.use("/users", userRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${process.env.PORT || 4000}`);
  });
}

module.exports = { app, mongoose };
