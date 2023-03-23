import { fetchCityWeather } from './js/fetchCityWeather';
import weatherTemplate from './templates/all-day.hbs';
import getRsfs from './js/refs';

const refs = getRsfs();

refs.form.addEventListener('submit', handleSubmitForm);

function handleSubmitForm(e) {
  e.preventDefault();
  const cityName = e.target.elements.query.value;

  fetchCityWeather(cityName)
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
