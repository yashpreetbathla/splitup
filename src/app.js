const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const groupRouter = require("./routes/group");
const expenseRouter = require("./routes/expense");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", groupRouter);
app.use("/", expenseRouter);
app.use("/", profileRouter);

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
