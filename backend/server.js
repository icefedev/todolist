const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const todoRouter = require("./routes/todo");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/", todoRouter);

app.listen(5000, () => console.log("Server is running on port 5000"));
