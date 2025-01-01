const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const info = `<p>Phonebook has info for ${
    persons.length
  } people </br> ${Date()}</p>`;
  res.send(info);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  const id =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  person.id = String(id + 1);

  const duplcated = persons.filter((p) => p.name === person.name);

  if (!person.name || !person.number) {
    res.status(400).json({ error: "data is missing eg: name or number" });
  } else if (duplcated.length > 0) {
    res.status(403).json({ error: "name alrady taken, name must be unique" });
  } else {
    persons = persons.concat(person);
    res.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
