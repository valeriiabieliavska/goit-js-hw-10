import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const countryName = event.target.value.trim();
  if (!countryName) {
    return;
  }

  fetchCountries(countryName)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (response.length >= 2 && response.length <= 10) {
        listCountry(response);
      }
      if (response.length === 1) {
        itemCountry(response);
      }
    })
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name'),
    );
  clearSearchCountry();
}

function listCountry(countries) {
  const markup = countries
    .map(element => {
      return `<li class="countries-item">
            <img class="country-img" src="${element.flags.svg}" width=60px alt="flag">
                </img>
                <p class="country-name">${element.name.official}</p>
                </li >`;
    })
    .join('');
  list.innerHTML = markup;
}

function itemCountry(countries) {
  const markup = countries
    .map(element => {
      return `<div class="country-item"><img class="country-img" src="${
        element.flags.svg
      }" width=80 alt="flag">
    <h1 class ="country-title">${element.name.official}</h1></div>
    <p class="country-desc"><b>Capital:</b> ${element.capital}</p>
    <p class="country-desc"><b>Population:</b> ${element.population}</p>
    <p class="country-desc"><b>Languages:</b> ${Object.values(
      element.languages
    )}</p>
    `;
    })
    .join('');
  info.innerHTML = markup;
}

function clearSearchCountry() {
  list.innerHTML = '';
  info.innerHTML = '';
}

// метод trim() позволяет удалить пробелы с обоих концов строки.
