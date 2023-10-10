// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

const API_key = "2ff631bb62a4c6104b8846970d0512c1";

const current = document.querySelector('.current');
const search = document.querySelector('.search');
const grant = document.querySelector('.grant-access');
const initContainer = document.querySelector('.container-initial');
const homeContainer = document.querySelector('.container-home');
const searchContainer = document.querySelector('.container-search');
const loadingContainer = document.querySelector('.container-loader');
const errorContainer = document.querySelector('.container-error');
const searchBtn = document.querySelector('.submit');
const searchBar = document.querySelector('.searchBox');
const searchResult = document.querySelector('.result');

current.addEventListener('click', toggleToCurrent);
search.addEventListener('click', toggleToSearch);
grant.addEventListener('click', getLocation);

// if(getFromSessionStorage){
//     initContainer.classList.remove('cur');
//     getLocation();
// }

function toggleToCurrent(){
    search.classList.remove('active');
    searchContainer.classList.remove('cur');
    searchResult.classList.remove('cur');
    errorContainer.classList.remove('cur');
    current.classList.add('active');
    let location = getFromSessionStorage();
    if(location){
        getLocation();
    }
    else
        initContainer.classList.add('cur');
}

function toggleToSearch(){
    search.classList.add('active');
    searchContainer.classList.add('cur');
    errorContainer.classList.remove('cur');
    current.classList.remove('active');
    if(homeContainer.classList.contains('cur')){
        homeContainer.classList.remove('cur');
    }
    else{
        initContainer.classList.remove('cur');
    }
}

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    return localCoordinates;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('No Geolocation support available');
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    try {
        initContainer.classList.remove('cur');
        loadingContainer.classList.add('cur');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        console.log(data);
        renderWeatherData(data);
    } catch (error) {
       console.log('Error Occured');
       loadingContainer.classList.remove('cur');
       searchContainer.classList.remove('cur');
       homeContainer.classList.remove('cur');
       initContainer.classList.remove('cur');
       errorContainer.classList.add('cur');
    }
}

function renderWeatherData(data){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('.desc');
    const descImage = document.querySelector('.desc-image');
    const temperature = document.querySelector('.temperature');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.humidity-value');
    const clouds = document.querySelector('.clouds-value');

    loadingContainer.classList.remove('cur');
    homeContainer.classList.add('cur');

    cityName.textContent = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent = data?.weather[0]?.description.toUpperCase();
    descImage.src = `https:/openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
    temperature.textContent = data?.main?.temp + "°C";
    windSpeed.textContent = data?.wind?.speed;
    humidity.textContent = data?.main?.humidity;
    clouds.textContent = data?.clouds?.all;
}

searchBtn.addEventListener('click', searchCityWeather);

function searchCityWeather(){
    const cityName = searchBar.value;
    getCityWeather(cityName);
}

async function getCityWeather(cityName){
    try {
        // searchContainer.classList.remove('cur');
        loadingContainer.classList.add('cur');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);
        const data = await response.json();
        console.log(data);
        renderSearchWeatherData(data);
    } catch (error) {
       console.log('Error Occured');
       loadingContainer.classList.remove('cur');
       searchContainer.classList.remove('cur');
       homeContainer.classList.remove('cur');
       initContainer.classList.remove('cur');
       errorContainer.classList.add('cur');
    }
}

function renderSearchWeatherData(data){
    const cityName = document.querySelector('.result [data-cityName]');
    const countryIcon = document.querySelector('.result [data-countryIcon]');
    const desc = document.querySelector('.result .desc');
    const descImage = document.querySelector('.result .desc-image');
    const temperature = document.querySelector('.result .temperature');
    const windSpeed = document.querySelector('.result .wind-speed');
    const humidity = document.querySelector('.result .humidity-value');
    const clouds = document.querySelector('.result .clouds-value');

    loadingContainer.classList.remove('cur');
    homeContainer.classList.remove('cur');
    initContainer.classList.remove('cur');
    searchResult.classList.add('cur');

    cityName.textContent = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent = data?.weather[0]?.description.toUpperCase();
    descImage.src = `https://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
    temperature.textContent = data?.main?.temp + "°C";
    windSpeed.textContent = data?.wind?.speed;
    humidity.textContent = data?.main?.humidity;
    clouds.textContent = data?.clouds?.all;
}
