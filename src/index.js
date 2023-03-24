import { fetchCityWeather, fetchIp } from './js/fetchCityWeather';
import weatherTemplate from './templates/all-day.hbs';
import getRsfs from './js/refs';

const refs = getRsfs();

window.addEventListener('DOMContentLoaded', handleLocation);

function handleLocation() {
  const cityInLocalStorage = localStorage.getItem('weathercity');

  if (!cityInLocalStorage) {
    fetchIp()
      .then(response => {
        setCityToLocalStorage(response.city);
      })
      .catch(error => {
        console.log(error);
      });
    return;
  }

  getCityWeather(cityInLocalStorage);
}

refs.form.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
  e.preventDefault();

  const cityName = e.target.elements.query.value.trim();
  getCityWeather(cityName);
  setCityToLocalStorage(cityName);
}

function getCityWeather(city) {
  fetchCityWeather(city)
    .then(weather => {
      console.log(weather);
      renderWeathertemplate(weather);
    })
    .catch(error => {
      console.log(error);
    });
}

function renderWeathertemplate(weather) {
  refs.page.innerHTML = weatherTemplate(weather);
}

function setCityToLocalStorage(city) {
  localStorage.setItem('weathercity', city);
}
