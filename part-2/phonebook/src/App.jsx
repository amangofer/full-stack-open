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

const Person = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

const Persons = ({ phonebook, handleDelete }) => {
  return (
    <>
      {phonebook.map((person) => {
        return (
          <Person
            key={person.id}
            person={person}
            handleDelete={() => handleDelete(person.id)}
          />
        );
      })}
    </>
  );
};

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return <div className={notification.type}>{notification.message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [name, setName] = useState("");
  const [notification, setNotification] = useState(null);

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

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    if (confirm(`Delete ${person.name}`)) {
      personServices.remove(id).then((returnedPerson) => {
        const newPersons = persons.filter((person) => person.id !== id);
        setPersons(newPersons);
        console.log(returnedPerson);
      });
    }
  };

  const updatePerson = (id, newObj) => {
    const person = persons.find((person) => person.id === id);
    if (
      confirm(
        `${person.name} is already added to the phonebook, replace the old number with the new one?`
      )
    ) {
      personServices.update(id, newObj).then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id == id ? returnedPerson : person))
        );
        setNewName("");
        setNewNumber("");
        setNotification({
          message: `Updated ${returnedPerson.name} `,
          type: "success",
        });

        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();
    const duplicate = persons.find((person) => person.name === newName);

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (duplicate) {
      updatePerson(duplicate.id, newPerson);
      return;
    }

    personServices.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      setNotification({
        message: `Added ${returnedPerson.name}`,
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  };

  const phonebook =
    name.length > 0
      ? persons.filter((person) => person.name.toLowerCase().includes(name))
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
      <Persons phonebook={phonebook} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
