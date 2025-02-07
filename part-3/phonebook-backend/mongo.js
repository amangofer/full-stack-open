const mongoose = require("mongoose");

if (process.argv.length >= 5) {
  const password = process.argv[2];
  const personName = process.argv[3];
  const number = process.argv[4];

  const url = `mongodb+srv://amanuelhaile18:${password}@cluster0.xygf3.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const person = new Person({
    name: personName,
    number: number,
  });

  person.save().then((savedPerson) => {
    console.log(
      `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
    );
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  const password = process.argv[2];

  const url = `mongodb+srv://amanuelhaile18:${password}@cluster0.xygf3.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  Person.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((people) => {
      console.log(people.name, people.number);
    });
    mongoose.connection.close();
  });
} else {
  console.log("give password as argument to see phonebook list or");
  console.log(
    "give password, name and number as argument to add person to the phonebook"
  );
  process.exit(1);
}
