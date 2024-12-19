import { useState, useEffect } from "react";
import personServices from "./services/persons";

const Filter = ({ name, onChange }) => {
  return (
    <div>
      filter shown with <input value={name} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  onSubmit,
  onNameChange,
  onNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  );
};

const Persons = ({ phonebook }) => {
  return (
    <>
      {phonebook.map((person) => {
        return <Person key={person.id} person={person} />;
      })}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setName(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const duplicate = persons.filter((person) => person.name === newName);
    if (duplicate.length > 0) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personServices.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const phonebook =
    name.length > 0
      ? persons.filter((person) => person.name.toLowerCase().includes(name))
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={name} onChange={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onSubmit={addPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons phonebook={phonebook} />
    </div>
  );
};

export default App;
