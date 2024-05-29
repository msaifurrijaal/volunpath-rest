import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Working guys");
});

app.listen(3000, () => {
  console.log(`App running on port ${3000}`);
});

export default app;
