let latitude = null;
let longitude = null;
const apiKey = '022654306ede70ed6b2ec578408bca68';
let openWeatherUrl = '';
let iconType = '';
let weatherIconUrl = ''
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let currentDate = new Date().toLocaleString(undefined, options);
let displayDate =  document.querySelector('#currentDate');
let currentDateDescription = document.querySelector('article#current-forecast > p');
let currentImage = document.querySelector('article > img#currentImage');

async function getWeatherData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    redirect: 'follow', // manual, *follow, error
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

(function (){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            getWeatherData(openWeatherUrl).then(data => {
                let weatherData = JSON.parse(data);
                displayDate.innerHTML = currentDate;
                currentDateDescription.innerHTML = weatherData.current.weather[0].description;
                iconType = weatherData.current.weather[0].icon;
                weatherIconUrl = `http://openweathermap.org/img/wn/${iconType}@2x.png`
                currentImage.setAttribute('src', weatherIconUrl);
                console.log(currentDate, weatherIconUrl, openWeatherUrl, 'from weather data');
            }).catch( error =>{
                console.log(error);
            });
        });
    }

})();




