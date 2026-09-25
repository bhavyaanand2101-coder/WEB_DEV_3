const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  password: String,
});

const userModel = mongoose.model("user", userSchema);

const main = async () => {
  try {
    // 1. Establish database connection first
    await mongoose.connect("mongodb://127.0.0.1:27017/day_3");
    console.log("DB Connected");

    // 2. Insert document using Mongoose's .create() method
    const newUser = await userModel.create({
      name: "Priya",
      email: "8HtZ0@example.com",
      age: 20,
      password: "1234",
    });
    console.log("Data inserted:", newUser);

    const user = await userModel.find();

    const user2 = await userModel.updateOne({ name: "Priya" }, { age: 5555 });

    console.log(user);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
