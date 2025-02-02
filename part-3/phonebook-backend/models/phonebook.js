require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

console.log("connectiong to ", uri);

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

mongoose
  .connect(uri)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
