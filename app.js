const currentTime = new Date;
const API_KEY = '3d40cb2735d747fda42113037241007';

// function to return current time of the day
const getTime = (hour) => {
    if(hour < 5 || hour >= 21){
        return 'Night'
    }else if(hour >= 5 && hour < 12 ){
        return 'Morning'
    }else if(hour >= 12 && hour <= 17){
        return 'Day'
    }else if(hour > 17 && hour < 21){
        return 'Evening'
    }
}

// function to assign text and background according to time
const assignBg = (time) => {
    const text = document.querySelector('.loading-text')
    text.textContent = `Good ${time}!`;

    document.querySelector('body').style.backgroundImage = `url(/src/${time}.jpg)`;
    document.querySelector('.loading-screen').style.backgroundImage = `url(/src/${time}.jpg)`;
}

// assigning text and bg according to time
assignBg(getTime(currentTime.getHours()))

// loading screen fade out after 2 secs
setInterval(() => {
    document.querySelector('.loading-screen').classList.add('animate-white')
    document.querySelector('.loading-screen').style.backgroundImage = 'none';
    document.querySelector('.container').classList.add('fade-in-container')
}, 2000);


// Opening-closing search component
const toggleSearchDesktop = (button, element) => {
    button.addEventListener('click', () => {
        if (element.classList.contains('show-desktop-search')) {
            element.classList.remove('show-desktop-search');
            element.classList.add('hide-desktop-search')
        }else{
            element.classList.remove('hide-desktop-search')
            element.classList.add('show-desktop-search')
        }

    })
}
toggleSearchDesktop(document.querySelector('.loc-desktop'), document.querySelector('.desktop-search'));
toggleSearchDesktop(document.querySelector('.loc-mobile'), document.querySelector('.desktop-search'))

// constructor to create object from api response
class weatherDataConstructor{
    constructor(city, country, localtime, current, forecast, astronomy){
        this.city = city;
        this.country = country;
        this.localtime = localtime;
        this.current = current;
        this.forecast = forecast;
        this.astronomy = astronomy;
    }
}

// function to change text content of elements
const textChange = (element, content) => {
    document.querySelector(`${element}`).textContent = content;
}

// Setting the data from api to html elements
const setData = (data) => {
    // date and time
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December']
    document.querySelector('.date-m').textContent = `${data.localtime.slice(8, 10)} ${months[Number(data.localtime.slice(5, 7))]} ${data.localtime.slice(0, 4)}`
    document.querySelector('.date-mobile').textContent = `${data.localtime.slice(8, 10)} ${months[Number(data.localtime.slice(5, 7))]} ${data.localtime.slice(0, 4)}`
    document.querySelector('.time').textContent = data.localtime.slice(11)
    document.querySelector('.time-mobile').textContent = data.localtime.slice(11)
     
    // update time every 30 secs
    setInterval(() => {
        document.querySelector('.time').textContent = data.localtime.slice(11)
        document.querySelector('.time-mobile').textContent = data.localtime.slice(11)
    }, 30000);


    // city and country name
    textChange('.country-name', data.country)
    textChange('.location-name', data.city)
    textChange('.loc-name-desktop', data.city)

    // current weather
    textChange('.current-degree', `${data.current.temp_c}°C`)
    textChange('.current-text', data.current.condition.text)
    textChange('.current-last-updated', `Last updated: ${data.current.last_updated}`)
    document.querySelector('.current-img').setAttribute('src', `https:${data.current.condition.icon}`)

    // wind
    textChange('.wind-speed', `${data.current.wind_kph}km/h`)
    textChange('.wind-direction', `${data.current.wind_degree}° ${data.current.wind_dir}`)

    // set
    textChange('.sunrise', data.astronomy.sunrise)
    textChange('.sunset', data.astronomy.sunset)
    textChange('.moonrise', data.astronomy.moonrise)
    textChange('.moonset', data.astronomy.moonset)

    // forecast
    let i = 1
    document.querySelectorAll('.forecast-date').forEach(el => {
        el.textContent = `${data.forecast[i].date.slice(5, 7)}/${data.forecast[i].date.slice(8, 10)}`;
        i++
    })
    let j = 1
    document.querySelectorAll('.fday-img').forEach(el => {
        el.setAttribute('src', `https:${data.forecast[j].day.condition.icon}`)
        j++
    })
    let k = 1
    document.querySelectorAll('.fday-degree').forEach(el => {
        el.textContent = `${data.forecast[k].day.maxtemp_c}°C`
        k++
    })
    let l = 1
    document.querySelectorAll('.fday-text').forEach(el => {
        el.textContent = data.forecast[l].day.condition.text
        l++
    })
}

// fetching data from api
const fetchData = async (query) => {
    const weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=6`)
    const astronomyResponse = await fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${query}`)

    if(!weatherResponse.ok && !astronomyResponse.ok){window.alert('Critical Error Occured. Cannot fetch the data from the api. Placeholders will be loaded.')}

    const weatherData = await weatherResponse.json();
    const astronomyData = await astronomyResponse.json();

    const allData = new weatherDataConstructor(weatherData.location.name, 
        weatherData.location.country, 
        weatherData.location.localtime, 
        weatherData.current, 
        weatherData.forecast.forecastday,
        astronomyData.astronomy.astro);

    // console.log(allData)

    await setData(allData);
}

// Function to set search results to html
const setSearchResults = (city, country) => {
    const container = document.querySelector('.search-results-container')

    const result = document.createElement('div')
    result.classList.add('search-result')

    const resultImage = document.createElement('img')
    resultImage.setAttribute('src', 'src/location-icon.png')
    result.appendChild(resultImage)
    
    const resultText = document.createElement('div')

    const cityName = document.createElement('h2')
    cityName.textContent = city
    const countryName = document.createElement('p')
    countryName.textContent = country

    resultText.appendChild(cityName)
    resultText.appendChild(countryName)
    result.appendChild(resultText)
    container.appendChild(result)

    // event listener to update data when the search result is clicked
    result.addEventListener('click', () => {
        fetchData(city)

        document.querySelector('.desktop-search').classList.remove('show-desktop-search')
        document.querySelector('.desktop-search').classList.add('hide-desktop-search')
    })

}

// Function to search
const search = async (query) => {
    const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`)
    const data = await response.json()

    document.querySelector('.search-results-container').innerHTML = ''

    for (let i = 0; i < data.length; i++) {
        setSearchResults(data[i].name, data[i].country)
    }
}

// event listener for input to update search container in every input
const searchInput = document.querySelector('.search-input')
searchInput.addEventListener('input', (event) => {
    setTimeout(() => {
        search(event.target.value)
    }, 500);
})

// fetching data for baku
fetchData('Baku')