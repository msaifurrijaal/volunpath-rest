import express, { Request, Response } from "express";
import rootRouter from "./routes";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Working guys");
});

app.use("/", rootRouter);

app.listen(7000, () => {
  console.log(`App running on port ${7000}`);
});

export default app;
