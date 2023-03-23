const API = 'e1868383596238a03a9fcf1a7f12bf30';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const UNITS = 'metric';
const COUNTRY = 'ua';
// faringate units=imperial
// const options = {
//     aplications: {
//         header: '',
//     }
// }
//https://api.openweathermap.org/data/2.5/weather?q=London&appid=e1868383596238a03a9fcf1a7f12bf30

export function fetchCityWeather(cityName) {
  return fetch(
    `${BASE_URL}weather?q=${cityName}&appid=${API}&lang=${COUNTRY}&units=${UNITS}`
  )
    .then()
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    });
}
