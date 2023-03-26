import { Weather, Ip } from './js/fetchCityWeather.js';
import weatherTemplate from './templates/all-day.hbs';
import cityListTemplate from './templates/city-list.hbs';
import getRsfs from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const Handlebars = require('handlebars');

const refs = getRsfs();

window.addEventListener('DOMContentLoaded', handleLocation);

refs.form.addEventListener('submit', handleSubmitForm);
refs.cityList.addEventListener('click', handleButtonClickCityList);
refs.temprBtn.addEventListener('click', handleClickTempButton);

const weatherForecast = new Weather();
const getCityFromIp = new Ip();

Notify.init({
  width: '300px',
  position: 'right-top',
  closeButton: false,
  timeout: 3000,
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade',
  warning: {
    background: '#eebf31',
    textColor: '#fff',
    childClassName: 'notiflix-notify-warning',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-exclamation-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(238,191,49,0.2)',
  },
});

function handleLocation() {
  const cityFromLocalStorage = localStorage.getItem('weathercity');
  if (!getTempUnit()) {
    setTempUnit('metric');
  }

  renderTempButton();

  if (!cityFromLocalStorage) {
    getCityFromIp
      .fetchIp()
      .then(response => {
        const cityArray = [];
        cityArray.push(changeFirstLetterToUpperCase(response.city));
        localStorage.setItem('weathercity', JSON.stringify(cityArray));
        return response.city;
      })
      .then(city => {
        getCityWeather(city);
      })
      .catch(error => {
        console.log(error);
      });
    return;
  }

  getCityWeather(JSON.parse(cityFromLocalStorage)[0]);
  renderCityList();
}

function handleSubmitForm(e) {
  e.preventDefault();
  const { value } = e.target.elements.query;

  const cityName = value.trim();
  getCityWeather(cityName);
  e.target.elements.query.value = '';
}

function getCityWeather(city) {
  weatherForecast
    .fetchCityWeather(city, (unit = getTempUnit()))
    .then(weather => {
      console.log(weather);
      renderWeathertemplate(weather);
      setCityToLocalStorage(changeFirstLetterToUpperCase(city));
      sessionStorage.setItem('citynow', city);
    })
    .catch(() => {
      Notify.failure(
        "We don't have weather from other planets. Try another city :)"
      );
    });
}

function handleClickTempButton() {
  toggleTempUnit();
  renderTempButton();
  getCityWeather(sessionStorage.getItem('citynow'));
}

function getTempUnit() {
  return localStorage.getItem('weatherunit');
}

function setTempUnit(unit) {
  localStorage.setItem('weatherunit', unit);
}

function toggleTempUnit() {
  const tempUnit = getTempUnit();
  const unit = tempUnit === 'metric' ? 'imperial' : 'metric';
  localStorage.setItem('weatherunit', unit);
}

function renderTempButton() {
  const textBtn = getTempUnit();
  refs.temprBtn.textContent = textBtn === 'metric' ? '\u2109' : '\u2103';
  // F - '\u2109'
  // C - '\u2103'
}

Handlebars.registerHelper('mintemp', function (min) {
  let value = min.toFixed();
  const unit = getTempUnit();
  // console.log((value += unit === 'metric' ? '\u2109' : '\u2103'));
  return (value += unit === 'metric' ? '\u2103' : '\u2109');
});

Handlebars.registerHelper('maxtemp', function (max) {
  let value = max.toFixed();
  const unit = getTempUnit();
  return (value += unit === 'metric' ? '\u2103' : '\u2109');
});

Handlebars.registerHelper('temp', function (temp) {
  let value = temp.toFixed();
  const unit = getTempUnit();
  return (value += unit === 'metric' ? '\u2103' : '\u2109');
});

// Handlebars.registerHelper('unit', function (unit) {
//   return unit = unit;
// });

function renderWeathertemplate(weather) {
  refs.page.innerHTML = weatherTemplate(weather);
}

function setCityToLocalStorage(city) {
  const listOFCity = JSON.parse(localStorage.getItem('weathercity'));

  if (listOFCity.some(el => el === city)) {
    return;
  }

  if (listOFCity.length === 3) {
    listOFCity.pop();
  }

  listOFCity.unshift(city);
  localStorage.setItem('weathercity', JSON.stringify(listOFCity));
}

function handleButtonClickCityList(e) {
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  getCityWeather(e.target.textContent);
}

function renderCityList() {
  const cities = localStorage.getItem('weathercity');
  refs.cityList.innerHTML = cityListTemplate(JSON.parse(cities));
}

function changeFirstLetterToUpperCase(word) {
  return word[0].toUpperCase() + word.slice(1);
}
