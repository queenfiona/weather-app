let latitude = null;
let longitude = null;
const apiKey = '022654306ede70ed6b2ec578408bca68';
let openWeatherUrl = '';
let iconType = '';
let weatherIconUrl = '';
let forecastUrl = '';
let dailyWeather = [];
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let currentDate = new Date().toLocaleString(undefined, options);
let displayDate =  document.querySelector('#currentDate');
let currentDateDescription = document.querySelector('article#current-forecast > p');
let currentImage = document.querySelector('article > img#currentImage');
let forecastContainer = document.querySelector('section#forecast > article');

async function getWeatherData(url = '') {
  // Default options are marked with *
  let response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    redirect: 'follow', // manual, *follow, error
  });
  return response.text(); // parses JSON response into native JavaScript objects
}

function createDailyForecast(dailyDate, description, imageUrl){
    let articleView = document.createElement('article');
    let h2View = document.createElement('h6');
    let paragraphView = document.createElement('p')
    let imageView = document.createElement('img')

    h2View.innerHTML = dailyDate;
    paragraphView.innerHTML = description;
    imageView.setAttribute('src', imageUrl)
    articleView.setAttribute('class', 'day-forecast');

    articleView.appendChild(h2View);
    articleView.appendChild(paragraphView);
    articleView.appendChild(imageView);

    forecastContainer.appendChild(articleView);
}

function displayDailyWeather(dailyWeatherUrl){
    console.log(dailyWeatherUrl);
    getWeatherData(dailyWeatherUrl).then(dailyData=> {
        dailyWeather = JSON.parse(dailyData);
        dailyWeather.list.forEach((data, index )=> {
            if (index%8 === 1) {
                let description = data.weather[0].description;
                let dailyIconType = data.weather[0].icon;
                let dailyDate = new Date(data.dt_txt).toLocaleString(undefined, options);
                let iconUrl = `http://openweathermap.org/img/wn/${dailyIconType}@2x.png`
                createDailyForecast(dailyDate,description,iconUrl);
            }
        })
    });


}

(function (){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            displayDailyWeather(forecastUrl);
            getWeatherData(openWeatherUrl).then(data => {
                let weatherData = JSON.parse(data);
                iconType = weatherData.current.weather[0].icon;
                weatherIconUrl = `http://openweathermap.org/img/wn/${iconType}@2x.png`
                dailyWeather = weatherData.daily;

                displayDate.innerHTML = currentDate;
                currentDateDescription.innerHTML = weatherData.current.weather[0].description;
                currentImage.setAttribute('src', weatherIconUrl);
            }).catch( error =>{
                console.log(error);
            });
        });
    }

})();




