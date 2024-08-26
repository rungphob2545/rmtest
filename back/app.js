const express = require("express");
const connectDB = require("./config/dbconfig");
const cors = require("cors");
const app = express();
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
