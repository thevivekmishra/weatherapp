//fetching 
const userTab=document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[data-searchWeather]");

const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");

const searchForm=document.querySelector("[data-searchForm]");

const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//initilize

let currentTab=userTab;
const API_KEY="35dc71e4856bbccb65b5cf89c224ba78"
currentTab.classList.add("current-tab");  //css property

//switch function 
function switchTab(clickedTab){
    if(clickedTab !== currentTab){
       currentTab.classList.remove("current-tab");
       currentTab = clickedTab;
       currentTab.classList.add("current-tab");

       //we dont know in which tab we are standing by default we are on your weather tab
       //it means your weather tab propertys are visble and now we are switching from your weather to search weather
       //so we have to make search tab visible and make your weather tab and grantaccess tab invisible
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        //suppose we are on search form tab and we are switching form search form to your weather
        //in this case you have to make search form tab invisible 
        else{
            searchForm.classList.remove("active");   
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}    
userTab.addEventListener("click",() => {
    switchTab(userTab);
});
searchTab.addEventListener("click",() => {
    switchTab(searchTab);
});

//check if coordinate are already present inside storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    //here we are checking user-coordinates inside session storage
    //if local coordinates not found call grant access container
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    //if coordinates found inside sessionstorage then use the latitude and longitude 
    //fetch API
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        //means with the help of coordinates call fetchUserWeatherInfo function
    
    }
}
// function for API call
async function fetchUserWeatherInfo(coordinates){
 const{lat,lon}=coordinates;
 //we have to make grantaccess container invisible
 grantAccessContainer.classList.remove("active");
 //make loader visible
 loadingScreen.classList.add("active");
 //API call
 try{
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
   const data = await response.json();

   //remove loader because data is fetched 
   loadingScreen.classList.remove("active");
   //activating user-weather-info section which contaien city name flag and cards
   userInfoContainer.classList.add("active");
   //to show on ui we have to render because ui contain limited info and API contain a lot of info so 
   //basically it acts as a filter
   renderWeatherInfo(data)
}
 catch(err){
    loadingScreen.classList.remove("active");
 }
}

function renderWeatherInfo(weatherInfo){
     //fetching what information we have to show on ui
     const cityName=document.querySelector("[data-cityName]");
     const countryIcon= document.querySelector("[data-countryIcon]");
     const desc=document.querySelector("[data-weatherDesc]");
     const weatherIcon=document.querySelector("[data-weatherIcon]");
     const temp=document.querySelector("[data-temp]");
     const windspeed=document.querySelector("[data-windspeed]");
     const humidity=document.querySelector("[data-humidity]");
     const cloudiness=document.querySelector("[data-cloudiness]");
     //fetch values from data and put into UI
     cityName.innerText=weatherInfo?.name;
     countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText=weatherInfo?.weather?.[0]?.description;
     weatherIcon.src=`http://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText=`${weatherInfo?.main?.temp} °C`;
     windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
     humidity.innerText=`${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

//now let no coordinates found inside local storage 
//in this case grant access tab open 
//in which ther is a buttoon of grant access in which listener is applied 
//which retriver our current location  and display temp on userinfo container 

function getLocation(){
    //if navigation support available
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    //else if navigation support not available
    else{
        alert("navigation not supported in your device ");
    }
}
function showPosition(position){

    const userCoordinates= {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="")
    return;
else
fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
       const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
       const data=await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err){
     alert("error");
    }
}

