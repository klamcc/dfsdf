let search = document.getElementById('location')
const date = new Date()
const todayInfo = document.querySelector('.today-info')
const weatherInfo = document.querySelector('.weather-info')
window.onload = () => { navigator.geolocation.getCurrentPosition(renderLocation) }


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
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + search.value + '&appid=0f9a088f959d3e77e4f4d52891192557')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                renderData(data)

            })
    }

})


function renderData(data){
    todayInfo.innerHTML = `   
            <img class="weatherIcon" src='http://openweathermap.org/img/wn/${data['weather'][0]['icon']}@4x.png'></img>
            <h2 class="temperature">${(data.main.temp - 273.15).toFixed(2) + '°C'}</h2>
            <div class="feelsLike">${(data.main.feels_like - 273.15).toFixed(2) + '°C'}</div>
            <div class="description">${data.weather[0].description}</div>
            <hr>
            <br>
            <div class="date">${date.getDate()}/${date.getMonth()}</div>
            <div class="city">${data.name}</div>`

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
                        <p><span id="sunrise">${window.moment(data.sys.sunrise*1000).format('HH:mm a')}</span>sunrise</p>
                        <p></p>

                    </span>
                    <span>
                        <i class="fa-regular fa-sun"></i>
                        <p><span id="sunset">${window.moment(data.sys.sunset*1000).format('HH:mm a')}</span>sunset</p>
                        
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
                    <h1 id="visibility">${data.visibility/1000}km</h1>
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
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=0f9a088f959d3e77e4f4d52891192557`).then(res=>res.json()).then(data=>{
    console.log(data)
    let dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    let uniqueDays = []
    fiveDay = data.list.filter(forecast=>{
        const date = new Date(forecast.dt_txt)
        if (!uniqueDays.includes(date.getDate())){
            document.querySelector('.week-forecast').innerHTML += `                
            <span class="day">
                    <div id="date">
                        <h3>${dayName[date.getDay()]}</h3>
                        <p id="day">${date.getDate()}/${date.getMonth()+1}</p>
                    </div>
                    <div class="day-info">
                        <p id="temp"><span></span>${(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                        <img src='http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png'class='forecast-icon'></img>
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


}







