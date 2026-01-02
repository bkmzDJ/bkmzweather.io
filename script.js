const today = new Date()
const opt = {year: 'numeric', month: 'long', day: 'numeric'}
const today_ed = today.toLocaleString('ru-RU', opt)
document.getElementById('Date').textContent = today_ed
const apikeys = `e143cde91e8691c5e36069a1cda94af5`
const apiurl = `https://api.openweathermap.org/data/2.5/weather?`
const apiurlf = `https://api.openweathermap.org/data/2.5/forecast?`
if ((today.getMonth() >= 0 && 1 >= today.getMonth()) || today.getMonth() === 11){
    if(window.innerWidth <= 900){
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/media_bg.jpg)"
    } else{
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/winter_bg.jpg)"
    }
} else if (today.getMonth() >= 2 && 4 >= today.getMonth()){
    if(window.innerWidth <= 900){
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/media_spring_bg.jpg)"
    } else{
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/spring_bg.jpg)"
    }
} else if (today.getMonth() >= 5 && 7 >= today.getMonth()){
    if(window.innerWidth <= 900){
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/media_summer_bg.jpg)"
    } else{
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/summer_bg.jpg)"
    }
} else if (today.getMonth() >= 8 && 10 >= today.getMonth()){
    if(window.innerWidth <= 900){
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/media_autumn_bg.jpg)"
    } else{
        document.getElementById('body_js').style.backgroundImage = "url(./assets/img/autumn_bg.jpg)"
    }
}
async function weather(city_name) {
    document.getElementById('Date').textContent = today_ed
    document.getElementById('Date').style.textShadow = "none"
    document.getElementById('Date').style.color = "black"
    document.getElementById('main_m').style.display = "none"
    document.getElementById('loading').style.display = "flex"
    let loadTime = setTimeout(function loge() {
        setTimeout(() =>{
            document.getElementById('loading').textContent = "Загрузка."
            setTimeout(() =>{
                document.getElementById('loading').textContent = "Загрузка.."
                setTimeout(() =>{
                    document.getElementById('loading').textContent = "Загрузка..."
                    setTimeout(() =>{
                        document.getElementById('loading').textContent = "Загрузка"
                        setTimeout(loge, 0)
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 500);
    const response = await fetch(apiurl + city_name + "&appid=" + apikeys + "&units=metric&lang=ru")
    const data = await response.json();
    const response_forecast = await fetch(apiurlf + city_name + "&appid=" + apikeys + "&units=metric&lang=ru")
    const data_forecast = await response_forecast.json();
    if(data.cod == "404") {
        document.getElementById('Date').textContent = "Ошибка, нет города"
        document.getElementById('Date').style.color = "red"
        document.getElementById('Date').style.textShadow = "0px 0px 10px red"
        console.log("ошибка");
        document.getElementById('main_m').style.display = "flex"
        document.getElementById('loading').style.display = "none"
    } else {
    clearTimeout(loadTime) 
    const date_mas = {}
    data_forecast.list.forEach(element => {
        const date = new Date(element.dt * 1000);
        const ddmm = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}`
        const dateFilter = date.toDateString();
        if (!date_mas[dateFilter]){
            date_mas[dateFilter] = {
                date: date,
                temps: [],
                feels_like: [],
                windSpeeds: [],
                weather: [],
                date_dis: ddmm
            }
        }
        date_mas[dateFilter].temps.push(element.main.temp)
        date_mas[dateFilter].feels_like.push(element.main.feels_like)
        date_mas[dateFilter].windSpeeds.push(Math.floor(element.wind.speed))
        date_mas[dateFilter].weather.push(element.weather[0].main)
    });
    const date_array = Object.values(date_mas)
        .sort((a, b) => a.date - b.date)
        .slice(0, 6);
    if (date_array.length === 6) {
        for (let i = 1; i < date_array.length; i++){
            let idEl = `img_${i}_forecast`
            let dtemp = `${i}_day_temp`
            let dfl = `${i}_day_fl`
            let dwind = `${i}_day_wind`
            let datecard = `${i}_day`
            document.getElementById(datecard).textContent = date_array[i].date_dis
            document.getElementById(dtemp).textContent = (date_array[i].temps.reduce((a, b)=> a+b)/date_array[i].temps.length).toFixed(1)
            document.getElementById(dfl).textContent = (date_array[i].feels_like.reduce((a, b)=> a+b)/date_array[i].feels_like.length).toFixed(1)
            document.getElementById(dwind).textContent = (date_array[i].windSpeeds.reduce((a, b)=> a+b)/date_array[i].windSpeeds.length).toFixed(1)
            if (date_array[i].weather[4] == 'Rain' || date_array[i].weather[0] == 'Rain'){
                document.getElementById(idEl).src = './assets/img/rain.png'
            } else if (date_array[i].weather[4] == 'Snow' || date_array[i].weather[0] == 'Snow') {
                document.getElementById(idEl).src = './assets/img/snow.png'
            } else if (date_array[i].weather[4] == 'Clouds' || date_array[i].weather[0] == 'Clouds'){
                document.getElementById(idEl).src = './assets/img/clouds.png'
            } else if (date_array[i].weather[4] == 'Clear' || date_array[i].weather[0] == 'Clear') {
                document.getElementById(idEl).src = './assets/img/clear.png'
            } else if (date_array[i].weather[4] == 'Fog' || date_array[i].weather[4] == 'Mist' || date_array[i].weather[0] == 'Fog' || date_array[i].weather[0] == 'Mist') {
                document.getElementById(idEl).src = './assets/img/fog.png'
            }
    }
    } else {
        for (let i = 0; i < date_array.length; i++){
        let idEl = `img_${i+1}_forecast`
        let dtemp = `${i+1}_day_temp`
        let dfl = `${i+1}_day_fl`
        let dwind = `${i+1}_day_wind`
        let datecard = `${i+1}_day`
        document.getElementById(datecard).textContent = date_array[i].date_dis
        document.getElementById(dtemp).textContent = (date_array[i].temps.reduce((a, b)=> a+b)/date_array[i].temps.length).toFixed(1)
        document.getElementById(dfl).textContent = (date_array[i].feels_like.reduce((a, b)=> a+b)/date_array[i].feels_like.length).toFixed(1)
        document.getElementById(dwind).textContent = (date_array[i].windSpeeds.reduce((a, b)=> a+b)/date_array[i].windSpeeds.length).toFixed(1)
        if (date_array[i].weather[4] == 'Rain'){
            document.getElementById(idEl).src = './assets/img/rain.png'
        } else if (date_array[i].weather[4] == 'Snow') {
            document.getElementById(idEl).src = './assets/img/snow.png'
        } else if (date_array[i].weather[4] == 'Clouds'){
            document.getElementById(idEl).src = './assets/img/clouds.png'
        } else if (date_array[i].weather[4] == 'Clear') {
            document.getElementById(idEl).src = './assets/img/clear.png'
        } else if (date_array[i].weather[4] == 'Fog' || date_array[i].weather[4] == 'Mist') {
            document.getElementById(idEl).src = './assets/img/fog.png'
        }
    }
    }
    document.getElementById('main_m').style.display = "flex"
    document.getElementById('loading').style.display = "none"
    document.getElementById('name_cit').textContent = data.name
    document.getElementById('mainw').textContent = data.weather[0].description
    document.getElementById('temp').textContent = Math.floor(data.main.temp)
    document.getElementById('temp_like').textContent = Math.floor(data.main.feels_like)
    document.getElementById('wind').textContent = data.wind.speed
    document.getElementById('himi').textContent = data.main.humidity
    document.getElementById('wind_deg').textContent = data.wind.deg
    if (data.wind.deg < 45 || data.wind.deg > 315){
        document.getElementById('wind_deg').textContent = "СЕВЕР "+"("+data.wind.deg+"°)"
    } else if (data.wind.deg < 135 && data.wind.deg > 45) {
        document.getElementById('wind_deg').textContent = "ВОСТОК "+"("+data.wind.deg+"°)"
    } else if (data.wind.deg < 225 && data.wind.deg > 135) {
        document.getElementById('wind_deg').textContent = "ЮГ "+"("+data.wind.deg+"°)"
    } else if (data.wind.deg < 315 && data.wind.deg > 225) {
        document.getElementById('wind_deg').textContent = "ЗАПАД "+"("+data.wind.deg+"°)"
    }


    if (data.weather[0].main == 'Rain'){
        document.getElementById('img_ico').src = './assets/img/rain.png'
    } else if (data.weather[0].main == 'Snow') {
        document.getElementById('img_ico').src = './assets/img/snow.png'
    } else if (data.weather[0].main == 'Clouds'){
        document.getElementById('img_ico').src = './assets/img/clouds.png'
    } else if (data.weather[0].main == 'Clear') {
        document.getElementById('img_ico').src = './assets/img/clear.png'
    } else if (data.weather[0].main == 'Fog' || data.weather[0].main == 'Mist') {
        document.getElementById('img_ico').src = './assets/img/fog.png'
    }
    }
}
if (!navigator.geolocation){
    alert("Ваш браузер не подерживает геолокацию! \nВы можете ввести свой город в поисковик.")
}
else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position =>{
        weather("lat="+position.coords.latitude+"&lon="+position.coords.longitude)
    })
}
document.getElementById('search_btn').addEventListener('click', () => {
    weather("q="+document.getElementById('inp_city').value)
})
document.getElementById('inp_city').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        weather("q="+document.getElementById('inp_city').value)
    }
})
setInterval