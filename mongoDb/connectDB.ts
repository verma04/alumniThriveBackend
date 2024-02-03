const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      `mongodb+srv://test:test@cluster0.tlofayb.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
