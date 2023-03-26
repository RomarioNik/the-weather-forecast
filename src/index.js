import { fetchCityWeather, fetchIp } from './js/fetchCityWeather';
import weatherTemplate from './templates/all-day.hbs';
import cityListTemplate from './templates/city-list.hbs';
import getRsfs from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const Handlebars = require('parcel-transformer-hbs');

const refs = getRsfs();

window.addEventListener('DOMContentLoaded', handleLocation);

refs.form.addEventListener('submit', handleSubmitForm);
refs.cityList.addEventListener('click', handleButtonClickCityList);

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

  if (!cityFromLocalStorage) {
    fetchIp()
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
  fetchCityWeather(city)
    .then(weather => {
      // console.log(weather);
      renderWeathertemplate(weather);
      setCityToLocalStorage(changeFirstLetterToUpperCase(city));
    })
    .catch(err => {
      Notify.failure(
        "We don't have weather from other planets. Try another city :)"
      );
    });
}

// Handlebars.registerHelper('loud', function (weather) {
//   weather.main.temp_min.toFixed();
// });

function renderWeathertemplate(weather) {
  // weather.main.temp_min.toFixed();
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
