import express from "express";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/test", (req, res) => {
  res.json("Hello, World!");
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 