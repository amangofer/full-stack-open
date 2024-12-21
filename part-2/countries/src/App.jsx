import axios from "axios";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data.map((c) => c.name.common));
      });
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = filter
    ? countries.filter((c) => c.toLowerCase().includes(filter))
    : countries;

  return (
    <>
      <div>
        find countries <input onChange={handleFilter} />
      </div>
      <CountryList list={filteredCountries} />
    </>
  );
}

export default App;
