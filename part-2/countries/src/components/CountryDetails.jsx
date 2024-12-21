import axios from "axios";
import { useEffect, useState } from "react";

const CountryDetails = ({ selected }) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${selected}`)
      .then((res) => {
        setCountry(res.data);
      });
  }, []);

  if (country) {
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>capital {...country.capital}</p>
        <p>area {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.keys(country.languages).map((key) => (
            <li key={key}>{country.languages[key]}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
      </>
    );
  }
};

export default CountryDetails;
