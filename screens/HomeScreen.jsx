import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React,{useCallback, useEffect, useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import {theme} from '../theme'
import {CalendarDaysIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {MapPinIcon} from 'react-native-heroicons/solid'
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForeCast } from '../api/weatherapi'
import * as Progress from 'react-native-progress'
import { storeData, getData, deleteData } from '../utils/asyncStorage'

export function HomeScreen(){

  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState([]);
  const [forecast, setForeCast] = useState({});

  const [loading,setLoading] = useState(true);


  const handleLocation = async (loc)=>{
    // const data = await fetchWeatherForeCast(
    //     {
    //         cityName: loc,
    //         days: 3
    //     }
    // )
    // console.log(`FORECAST ${loc}`, data.data);
    setLoading(true);
    fetchWeatherForeCast({cityName: loc, days: '7'}).then(data=>{
        setForeCast(data);
        setShowSearch(false);
        setLoading(false);
        storeData('currentCity', loc);
        //deleteData('currentCity');
    }).catch(error=>{
        console.log(error);
        setLoading(false);
    });
  }

  const handleSearch = async (value) =>{
    if(value.length>2){

        // const data = await fetchLocations({
        //     cityName: value
        // })
        // setLocation(data.data);

        fetchLocations({cityName: value}).then(data=>{
            setLocation(data);
        }).catch(error=>{
            console.log(error)
        });
        
    }
  }

  useEffect(()=>{
    fetchInitWeatherLocation();
  },[]);

  const fetchInitWeatherLocation = async ()=>{

    const cityName = (await getData('currentCity')) || "Pereira";

    fetchWeatherForeCast({cityName: cityName, days: '7'}).then(data=>{
        setForeCast(data);
        setLoading(false);
    }).catch(error=>{
        console.log(error);
        setLoading(false);
    });
  }

  const handleTextDebounce = useCallback(debounce(handleSearch,1200),[]);

  return (
    <View className="flex-1 relative bg-blue-800">
        <StatusBar style="light"/>
        <Image blurRadius={40} source={require('../assets/images/bg.png')} 
            className="absolute h-full w-full"
        />
        {
            loading ? (
                <View className="flex-1 flex-row justify-center items-center">
                    <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2"/>
                </View>
            ) : (
                <SafeAreaView className="flex flex-1 mt-10">
                    <View style={{height: '7%'}} className="mx-4 relative z-50">
                        <View className={`flex-row justify-end items-center mt-5 rounded-3xl ${showSearch ? 'bg-white/20' : 'bg-blue-800'}`}
                            style={{
                                backgroundColor: showSearch ? theme.bgWhite(0.2) : 'bg-blue-800'
                            }}>
                            {
                                showSearch ? 
                                (
                                    <TextInput 
                                        onChangeText={handleTextDebounce}
                                        placeholder='Search city'
                                        placeholderTextColor={'lightgray'}
                                        className="pl-6 h-10 flex-1 text-base text-white"
                                    />
                                ):null
                            }
                            <TouchableOpacity
                                style={{backgroundColor: theme.bgWhite(0.3)}}
                                className="rounded-full p-3 m-1"
                                onPress={()=>setShowSearch(!showSearch)}
                            >
                                <MagnifyingGlassIcon size="25" color="white"/>
                            </TouchableOpacity>
                        </View>
                        {
                            location.length>0 && showSearch ? 
                            (
                                <View className="absolute w-full bg-gray-300 top-16 mt-8 rounded-3xl">
                                    {
                                        location.map((loc,index)=>{
                                            let showBorder = index + 1 != location.length;
                                            let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                                            return(
                                                <TouchableOpacity key={index}
                                                    className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                                                    onPress={()=>handleLocation(loc.name)}
                                                >
                                                    <MapPinIcon size="20" color="gray"/>
                                                    <Text className="text-black text-lg ml-2">{loc.name}, {loc.region}, {loc.country}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            ):null
                        }
                    </View>
                    <View className="mx-4 flex justify-around flex-1 mb-2">
                        {
                            !showSearch ? (
                                <Text className="text-white text-center text-2xl font-bold">
                                    {Object.keys(forecast).length === 0 ? "" : forecast.location.name},
                                    <Text className="text-lg font-semibold text-gray-300">
                                    {Object.keys(forecast).length === 0 ? " " : ` ${forecast.location.country}`}
                                    </Text>
                                </Text>
                            ) : null
                        }
                        
                        <View className="flex-row justify-center">
                            <Image
                                source={{uri: Object.keys(forecast).length === 0 ? "" : `https:${forecast.current.condition.icon}`}}
                                className='w-80 h-80'
                            />
                        </View>
                        <View className="space-y-2">
                            <Text className="text-center font-bold text-white text-6xl ml-5">
                                {Object.keys(forecast).length === 0 ? "" : forecast.current.temp_c}&#176;
                            </Text>
                            <Text className="text-center text-white text-xl tracking-widest">
                                {Object.keys(forecast).length === 0 ? "" : forecast.current.condition.text}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mx-4">
                            <View className="flex-row space-x-2 items-center">
                                <Image 
                                    source={require('../assets/images/wind.png')}
                                    className="h-8 w-8"                        
                                />
                                <Text className="text-white font-semibold text-base">
                                    {Object.keys(forecast).length === 0 ? "" : forecast.current.wind_kph}km/h
                                </Text>
                            </View>
                            <View className="flex-row space-x-2 items-center">
                                <Image 
                                    source={require('../assets/images/drop.png')}
                                    className="h-8 w-8"                        
                                />
                                <Text className="text-white font-semibold text-base">
                                    {Object.keys(forecast).length === 0 ? "" : forecast.current.humidity}%
                                </Text>
                            </View>
                            <View className="flex-row space-x-2 items-center">
                                <Image 
                                    source={require('../assets/images/sun.png')}
                                    className="h-8 w-8"                        
                                />
                                <Text className="text-white font-semibold text-base">
                                    {Object.keys(forecast).length === 0 ? "" : forecast.forecast.forecastday[0].astro.sunrise}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="mb-2 space-y-3">
                        <View className="flex-row items-center mx-5 space-x-2">
                            <CalendarDaysIcon size="22" color="white"/>
                            <Text className="text-white text-base">Daily forecast</Text>
                        </View>
                        <ScrollView
                            horizontal
                            contentContainerStyle={{paddingHorizontal: 15}}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                forecast.forecast && forecast.forecast.forecastday.length>0 ? (
                                    forecast.forecast.forecastday.map((day,index)=>{
                                        let date = new Date(day.date);
                                        let options = {weekday: 'long'};
                                        let dayName = date.toLocaleDateString('en-US', options);
                                        return(
                                            <View key={index} 
                                                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" 
                                                style={{backgroundColor: theme.bgWhite(0.15)}}
                                            >
                                                <Image source={{uri: Object.keys(forecast).length === 0 ? "" : `https:${day.day.condition.icon}`}} className="h-11 w-11"/>
                                                <Text className="text-white">{dayName}</Text>
                                                <Text className="text-white text-xl font-semibold">{day.day.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })
                                ):null
                            }
                        </ScrollView>
                    </View>
                </SafeAreaView>
            )
        }        
    </View>
  )
}