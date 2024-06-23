import cors from "cors";
import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { connectDb } from "./config/db.config";
import myUserRoute from "./routes/user.route";
import { connectCloudinary } from "./controllers/cloudinary.config";
import myRestaurantRoute from "./routes/resstaurant.route";
import publicRestaurantRoute from "./routes/restaurant.public.route";
import orderRoutes from "./routes/order.route";

// express api
const app: Application = express(); // app initialized

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", publicRestaurantRoute);
app.use("/api/order", orderRoutes);
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

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
