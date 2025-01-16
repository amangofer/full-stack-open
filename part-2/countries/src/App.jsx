import axios from "axios";
import { useEffect, useState } from "react";
import CountrisList from "./components/CountrisList";
import CountryDetails from "./components/CountryDetails";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data.map((c) => c.name.common));
      });
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
    setShowCountry(null);
  };

  const handleShow = (country) => {
    setShowCountry(country);
  };

  const filteredCountries = filter
    ? countries.filter((c) => c.toLowerCase().includes(filter))
    : countries;

  return (
    <>
      <div>
        find countries <input onChange={handleFilter} />
      </div>
      {showCountry ? (
        <CountryDetails selected={showCountry} />
      ) : filteredCountries.length === 0 ? (
        "No such country on the list! try again."
      ) : filteredCountries.length === 1 ? (
        <CountryDetails selected={filteredCountries[0]} />
      ) : filteredCountries.length > 10 ? (
        "Too many matches, spacify another filter"
      ) : (
        <CountrisList list={filteredCountries} handleShow={handleShow} />
      )}
    </>
  );
}

export default App;
