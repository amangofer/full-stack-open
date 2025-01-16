import axios from "axios";
import { useEffect, useState } from "react";

const api_key = import.meta.env.VITE_WEATHER_KEY;

function KelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

const CountryDetails = ({ selected }) => {
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${selected}`
        )
        .then(async (res) => {
          setCountry(res.data);
          const capital = res.data.capital[0];
          try {
            const res_1 = await axios.get(
              `http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=5&appid=${api_key}`
            );
            const lat = res_1.data[0].lat;
            const lon = res_1.data[0].lon;
            const res_2 = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
            );
            setWeather(res_2.data);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, [selected]);

  if (country) {
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>capital {...country.capital || ""}</p>
        <p>area {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.keys(country.languages).map((key) => (
            <li key={key}>{country.languages[key]}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <h2>Weather in {country?.capital}</h2>
        <p>
          temperature {KelvinToCelsius(weather?.main.temp).toFixed(2)} Celcius
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
          alt={weather?.weather[0].description}
        />
        <p>wind {weather?.wind.speed} m/s</p>
      </>
    );
  }
};

export default CountryDetails;
