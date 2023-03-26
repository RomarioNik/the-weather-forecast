// const API = 'e1868383596238a03a9fcf1a7f12bf30';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
// const UNITS = localStorage.getItem('weatherunit') || 'metric';
// const COUNTRY = 'ua';
// faringate units=imperial metric
// const options = {
//     aplications: {
//         header: '',
//     }
// }

export class Weather {
  #BASE_URL = 'https://api.openweathermap.org/data/2.5/';
  #API = 'e1868383596238a03a9fcf1a7f12bf30';

  fetchCityWeather(cityName, unit) {
    return fetch(
      `${this.#BASE_URL}weather?q=${cityName}&appid=${this.#API}&units=${unit}`
    ).then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  }
}

export class Ip {
  #BASE_URL = 'https://ipinfo.io';
  #API = '8851da7fd8c9f0';

  fetchIp() {
    return fetch(`${this.#BASE_URL}/json?token=${this.#API}`).then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    });
  }
}

// export function fetchCityWeather(cityName) {
//   return fetch(
//     `${BASE_URL}weather?q=${cityName}&appid=${API}&lang=${COUNTRY}&units=${UNITS}`
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }

//     return response.json();
//   });
// }

// export function fetchIp() {
//   return fetch('https://ipinfo.io/json?token=8851da7fd8c9f0').then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
