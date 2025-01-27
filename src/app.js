const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const groupRouter = require("./routes/group");
const expenseRouter = require("./routes/expense");

app.use("/", authRouter);
app.use("/", groupRouter);
app.use("/", expenseRouter);

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
