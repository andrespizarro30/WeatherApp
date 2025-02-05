import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React,{useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import {theme} from '../theme'
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {MapPinIcon} from 'react-native-heroicons/solid'

export function HomeScreen(){

  const [showSearch, setShowSearch] = useState(true);
  const [location, setLocation] = useState(['Pereira','Bogota','Cali']);

  const handleLocation = (loc)=>{
    console.log(loc);
  }

  return (
    <View className="flex-1 relative bg-blue-800">
        <StatusBar style="light"/>
        <Image blurRadius={40} source={require('../assets/images/bg.png')} 
            className="absolute h-full w-full"
        />
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
                                            onPress={()=>handleLocation(loc)}
                                        >
                                            <MapPinIcon size="20" color="gray"/>
                                            <Text className="text-black text-lg ml-2">{loc}, Risaralda, Colombia</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ):null
                }
            </View>
            <View className="mx-4 flex justify-around flex-1 mb-2">
                <Text className="text-white text-center text-2xl font-bold">
                    Pereira,
                    <Text className="text-lg font-semibold text-gray-300">
                        Colombia
                    </Text>
                </Text>
                <View className="flex-row justify-center">
                    <Image
                        source={{uri:'https://cdn.weatherapi.com/weather/64x64/day/116.png'}}
                        className='w-80 h-80'
                    />
                </View>
                <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                        26&#176;
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    </View>
  )
}