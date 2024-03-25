import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { connectDb } from "./config/db.config";
import myUserRoute from "./routes/user.route";

// express api
const app: Application = express(); // app initialized

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api/my/user", myUserRoute);

// db connection
connectDb();

const port = process.env.PORT || 8080;

// listen app
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
