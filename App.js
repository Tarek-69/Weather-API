import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

const myAPI = "f78a09c17d23daf101868fff5e523cc0";

export default function App() {
  const [location, setLocation] = useState(null);
  const [cityData, setCityData] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  const getWeather = async (lat, long) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${myAPI}&units=metric&lang={fr}`
    );
    const data = await response.json();
    setCityData(data);
    setWeatherIcon(data.weather[0].icon);
    console.log(data);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission n'est pas accepter");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      getWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {cityData ? (
        <Text>{cityData.name}</Text>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      {/* Affichage du lieu localisé*/}
      {cityData ? (
        <Text>Le lieu est : {cityData.sys.country}</Text>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      {/* Affichage de la température*/}
      {cityData ? (
        <Text>La température est de : {cityData.main.temp} °C</Text>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      {weatherIcon ? (
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weatherIcon}.png`,
          }}
          style={{ width: 100, height: 100 }}
        />
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}

      <Text> Météo dans les prochains jours </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
