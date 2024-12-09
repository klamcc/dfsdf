let search = document.getElementById('location')
const date = new Date()
const todayInfo = document.querySelector('.today-info')
const weatherInfo = document.querySelector('.weather-info')
const suggestions = document.querySelector('.suggestions')
const bookmarksButton = document.querySelector('.bookmarks-button')
const bookmarks = document.querySelector('.bookmarks')
let timeout
let suggestionList
let bookmark = document.querySelector('.bookmark')

window.onload = () => { navigator.geolocation.getCurrentPosition(renderLocation) }
loginData = JSON.parse(localStorage.getItem(localStorage.getItem('login')))
login = localStorage.getItem(localStorage.getItem('login'))

const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '2a3a51a9d7mshd2a20289c3f33a5p178a81jsn139cb50cbabe',
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    }
};



function renderLocation(position) {
    console.log(position.coords.latitude)
    var lat = position.coords.latitude
    var long = position.coords.longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0f9a088f959d3e77e4f4d52891192557&lang=en`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            renderData(data)

        })
};



search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        fetchByName(search.value)
        suggestions.innerHTML = ''
    }

})

function fetchByName(name) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + name + '&appid=0f9a088f959d3e77e4f4d52891192557')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            renderData(data)

        })
}

function fetchByCode(code){
    
}

search.addEventListener('input', () => {
    clearTimeout(timeout)
    timeout = setTimeout(fetchCities, 500)
})

function fetchCities() {
    if (search.value) {
        fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search.value}&sort=-population`, options)
            .catch(error => Promise.reject(error))
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)

                }
                else {
                    return res.json()
                }
            })
            .then(res => {
                suggestionList = []
                suggestions.innerHTML = ''
                console.log('clear')
                res.data.map(city => {
                    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.countryCode}&appid=0f9a088f959d3e77e4f4d52891192557`).catch(error => Promise.reject(error))
                        .then(res => {
                            if (!res.ok) {
                                return Promise.reject(res)
                            }
                            else {
                                if (!suggestionList.includes(`${city.name},${city.country}`)){
                                    suggestions.classList.remove('hide')
                                    console.log(city.name)
                                    suggestions.innerHTML += `<div onclick='suggestion(this,${city.countryCode})'>${city.name},${city.country}</div>`
                                    suggestionList.push(`${city.name},${city.country}`)
                                }
                            }

                        })

                })
                if (suggestions.innerHTML==''){
                    suggestions.classList.add('hide')
                }
            }).catch(error => {
                clearTimeout()
                timeout = setTimeout(fetchCities, 500)
            })
    }
    else {
        suggestions.classList.add('hide')
    }
}

function suggestion(elem,code) {
    search.value = elem.innerHTML
    fetchByName(elem.innerHTML,code)
    suggestions.innerHTML = ''
    suggestions.classList.add('hide')
}


function renderData(data) {
    todayInfo.innerHTML = `   
            <img class="weather-icon" src='https://rodrigokamada.github.io/openweathermap/images/${data['weather'][0]['icon']}_t@4x.png'></img>
            <h2 class="temperature">${(data.main.temp - 273.15).toFixed(2) + '°C'}</h2>
            <div class="feelsLike">${(data.main.feels_like - 273.15).toFixed(2) + '°C'}</div>
            <div class="description">${data.weather[0].description}</div>
            <hr>
            <br>
            <div class="date">${date.getDate()}/${date.getMonth()}</div>
            <div class="city">${data.name}<i class="fa-regular fa-heart bookmark"></i></div>`

    weatherInfo.innerHTML = `            
        <h2 class="heading">Today's Highlights</h2>
            <br>
            <div class="highlights">
                <div class="humidity">
                    Humidity
                    <i class="fa-solid fa-water"></i>
                    <h1 id="humidity">${data.main.humidity}%</h1>
                </div>


                <div class="wind-speed">
                    Wind Speed
                    <i class="fa-solid fa-wind"></i>
                    <h1 id="wind-speed">${data.wind.speed}m/s</h1>
                </div>

                <div class="sun">
                    <span>
                        <i class="fa-solid fa-sun"></i>
                        <p><span id="sunrise">${window.moment(data.sys.sunrise * 1000).format('HH:mm a')}</span>sunrise</p>
                        <p></p>

                    </span>
                    <span>
                        <i class="fa-regular fa-sun"></i>
                        <p><span id="sunset">${window.moment(data.sys.sunset * 1000).format('HH:mm a')}</span>sunset</p>
                        
                    </span>
                </div>

                <div class="clouds">
                    Clouds
                    <i class="fa-solid fa-cloud"></i>
                    <h1 id="clouds">${data.clouds.all}%</h1>
                </div>

                <div class="visibility">
                    Visibility
                    <i class="fa-solid fa-eye"></i>
                    <h1 id="visibility">${data.visibility / 1000}km</h1>
                </div>
                <div class="pressure">
                    Pressure
                    <i class="fa-solid fa-volcano"></i>
                    <h1 id="pressure">${data.main.pressure}hPa</h1>
                </div>

            </div>
            <br>
            <h2 class="heading">Next 5 Days</h2>

            <div class="week-forecast">

                    </div>

                </span>





            </div>


`
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=0f9a088f959d3e77e4f4d52891192557`).then(res => res.json()).then(data => {
        console.log(data)
        let dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let uniqueDays = []
        fiveDay = data.list.filter(forecast => {
            const date = new Date(forecast.dt_txt)
            if (!uniqueDays.includes(date.getDate())) {
                document.querySelector('.week-forecast').innerHTML += `                
            <span class="day">
                    <div id="date">
                        <h3>${dayName[date.getDay()]}</h3>
                        <p id="day">${date.getDate()}/${date.getMonth() + 1}</p>
                    </div>
                    <div class="day-info">
                        <p id="temp"><span></span>${(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                        <img src='https://rodrigokamada.github.io/openweathermap/images/${forecast.weather[0].icon}_t@4x.png'class='forecast-icon'></img>
                        <p id="summary">${forecast.weather[0].description}</p>
                        <p id="humidity-day"><i class="fa-solid fa-water"></i>  ${forecast.main.humidity}%</p>
                    </div>

                </span>`
                console.log(date.getDay())
                console.log(forecast)
                return uniqueDays.push(date.getDate())
            }
        })

    })

    city = document.querySelector('.city').innerHTML.split('<i')[0]
    console.log(city)
    bookmark = document.querySelector('.bookmark')
    console.log(loginData['bookmarks'])

    bookmark.addEventListener('click', () => {
        console.log('asdas  ')

        if (!loginData['bookmarks'].includes(city)) {
            loginData['bookmarks'].push(city)
            save()
            
        }
        else{
            loginData['bookmarks'].splice(city)
            save()
        }
        loadBookmarks(city)

    })


    loadBookmarks(city)

}

bookmarksButton.addEventListener('click', () => {
    bookmarks.classList.toggle('open')
})

function loadBookmarks(city) {
    bookmarks.innerHTML = ' '
    loginData['bookmarks'].map(bookmark => {
        bookmarks.innerHTML += `<button onclick='fetchByName(${bookmark})'>${bookmark}</button>`
    })
    console.log(loginData['bookmarks'])
    if (loginData['bookmarks'].includes(city)) {
        console.log('POWEQWEIW')
        bookmark.classList.replace('fa-regular','fa-solid')
    }
    else{
        bookmark.classList.replace('fa-solid','fa-regular')
    }

}



function save(){
    localStorage.setItem(localStorage.getItem('login'), JSON.stringify({ 'password': loginData['password'], 'bookmarks': loginData['bookmarks'] }))
}

