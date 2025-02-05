require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Persons = require("./models/phonebook");

morgan.token("body", function getId(req) {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, respons, next) => {
  if (error.name === "CastError") {
    return respons.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.get("/info", (req, res) => {
  Persons.find({}).then((result) => {
    const info = `<p>Phonebook has info for ${
      result.length
    } people </br> ${Date()}</p>`;
    res.send(info);
  });
});

app.get("/api/persons", (req, res) => {
  Persons.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).end(error.message);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Persons.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(400).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  Persons.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(400).send({ message: "Person not found!" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    res.status(400).send({ error: "data is missing eg: name or number" });
  } else {
    Persons.create(person);
    res.json(person);
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const person = req.body;

  Persons.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(400).send({ message: "Person not found!" });
      }
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
