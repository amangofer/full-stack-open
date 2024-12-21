import CountryDetails from "./CountryDetails";

const CountryList = ({ list }) => {
  const filteredCountries = [...list];
  return (
    <div>
      {filteredCountries.length === 1 ? (
        <CountryDetails selected={filteredCountries[0]} />
      ) : filteredCountries.length > 10 ? (
        "Too many matches, spacify another filter"
      ) : (
        filteredCountries.map((country) => <div key={country}>{country}</div>)
      )}
    </div>
  );
};

export default CountryList;
