import CountryDetails from "./CountryDetails";

const CountrisList = ({ list, handleShow }) => {
  const filteredCountries = [...list];
  return (
    <>
      <ul className="country-list">
        {filteredCountries.map((country) => (
          <li key={country}>
            {country} <button onClick={() => handleShow(country)}>Show</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CountrisList;
