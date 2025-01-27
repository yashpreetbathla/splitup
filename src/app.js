const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

const connectDB = require("./config/database");

app.get("/", (req, res) => {
  res.send("Hello World");
});

const authRouter = require("./routes/auth");

app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("Database connected");

    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database: ", err);
  });
