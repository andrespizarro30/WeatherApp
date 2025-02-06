import axios from "axios";
import { BASE_URL, TOKEN } from "../constants";

const forecastendpoint = (params) => `https://api.weatherapi.com/v1/forecast.json?key=${TOKEN}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsendpoint = (params) => `https://api.weatherapi.com/v1/search.json?key=${TOKEN}&q=${params.cityName}`;

const apiCall = async (endpoint,params)=>{
    const options = {
        method: 'GET',
        url: endpoint
    }

    try{
        const response = await axios.request(options);
        return response.data;
    }catch(error){
        console.log(error);
        return {};
    }
}

export const fetchWeatherForeCast = (params) =>{
    let forecastUrl = forecastendpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = async (params) =>{
    let locationsUrl = locationsendpoint(params);
    return await apiCall(locationsUrl);
}
