import cors from "cors";
import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { connectDb } from "./config/db.config";
import myUserRoute from "./routes/user.route";
import { connectCloudinary } from "./controllers/cloudinary.config";

// express api
const app: Application = express(); // app initialized

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api/my/user", myUserRoute);

app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({ message: "OK!" });
});

// db & cloudinary connection
connectDb();
connectCloudinary();

const port = process.env.PORT || 8080;

// listen app
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
