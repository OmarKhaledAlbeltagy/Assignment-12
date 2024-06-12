const searchInput = document.getElementById('search');
const resultContainer = document.getElementById('result');
const baseURL = 'https://api.weatherapi.com/v1/forecast.json?key=f219e310d9594626bb0235601241106&days=3&q=id:'
let currentLocation = '';

searchInput.addEventListener('keyup',async function(){
    if (searchInput.value.length < 3) {
       let data = await getData(currentLocation);
       showData(data);
    }
    else{
        let location = await search(searchInput.value);
        let data = await getData(location);
        showData(data);
    }
})



async function getData(location) {
    let result = await fetch(baseURL+location);
    let finalResult = await result.json();
    return finalResult;
}

async function showData(data){
    let dataContainer = '';
    dataContainer += ` <div class="col-12 d-flex justify-content-center">
                                    <div class="text-center rounded-pill w-50 text-white fw-bold fs-2" style="background-color: #2225307b;">${data.location.name}</div>
                                  </div>`

    for (let i = 0; i < data.forecast.forecastday.length; i++) {
       
        let mainResult = data.forecast.forecastday[i];

         var day =   (new Date(mainResult.date)).toLocaleDateString('en-EG',{
            weekday:"long",
         });

         var date =   (new Date(mainResult.date)).toLocaleDateString('en-EG',{
            day:"numeric",
            month:"long"

         });
        let thisDay = mainResult.day;

        let maxTemp = thisDay.maxtemp_c;
        let minTemp = thisDay.mintemp_c;

        dataContainer += `<div class="col-12 col-lg-4">
                                <div class="card border-dark rounded-5">
                                    <div class="card-header d-flex justify-content-between bg-dark text-white bg-gradient">
                                      <div>${day}</div><div>${date}</div>
                                    </div>
                                    <div class="card-body" style="background-color: #222530bf;">
                                      <h2 class="text-white fs-1">${maxTemp}<sup>o</sup>C / ${minTemp}<sup>o</sup>C</h2>
                                      <p class="card-text text-white fs-4"><img src="${thisDay.condition.icon}" alt="">${thisDay.condition.text}</p>
                                    </div>
                                    <div class="card-footer bg-dark d-flex text-white justify-content-between bg-gradient">
                                      <div><i class="fa-solid fa-umbrella"></i> ${thisDay.daily_chance_of_rain}%</div>
                                      <div><i class="fa-solid fa-wind"></i> ${thisDay.maxwind_kph}km/h</div>
                                      <div><i class="fa-solid fa-droplet"></i> ${thisDay.avghumidity}</div>
                                      </div>
                                  </div>
                            </div>`
    }

    resultContainer.innerHTML = dataContainer
}


async function getCurrentLocation(){
    var result = await fetch("https://ipinfo.io?token=a410bf6c6ee906");
    var finalResult = await result.json();
    currentLocation = finalResult.city;
    var data = await getData(currentLocation);
    showData(data)
}


async function search(searchValue){
    var result = await fetch("https://api.weatherapi.com/v1/search.json?key=f219e310d9594626bb0235601241106&q="+searchValue);
    var finalResult = await result.json();
    return finalResult[0].id;
}

getCurrentLocation();