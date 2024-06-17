const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./Models/userSchema");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
async function connectDb() {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log("connect to DB..");
  } catch (error) {
    console.log(error);
  }
}
connectDb();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/getUsers", async (req, res) => {
  try {
    const result = await userModel.find();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post("/createUser", async (req, res) => {
  const { name, age, username } = req.body;
  try {
    const newUser = new userModel({
      name,
      age,
      username,
    });
    const result = await newUser.save();
    console.log(result);
    res.sendStatus(200);
  } catch (error) {
    if (error) console.error("Error creating user:", error);

    res.status(400).json({ message: "Error creating user", error });
  }
});
app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});
