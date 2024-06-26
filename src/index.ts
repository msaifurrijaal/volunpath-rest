import express, { Request, Response } from "express";
import rootRouter from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Working guys");
});

app.use("/", rootRouter);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;
