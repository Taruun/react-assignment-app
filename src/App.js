import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import { getPlacesData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

const App = () => {
  // State variables
  const [type, setType] = useState("restaurants"); // Type of places (e.g., restaurants, hotels)
  const [rating, setRating] = useState(""); // Rating filter

  const [coords, setCoords] = useState({}); // User's coordinates
  const [bounds, setBounds] = useState(null); // Map bounds

  const [weatherData, setWeatherData] = useState([]); // Weather data
  const [filteredPlaces, setFilteredPlaces] = useState([]); // Filtered places based on rating
  const [places, setPlaces] = useState([]); // All places

  const [autocomplete, setAutocomplete] = useState(null); // Google Maps Autocomplete object
  const [childClicked, setChildClicked] = useState(null); // Selected place card
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch user's current geolocation coordinates
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  // Filter places based on rating
  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  }, [rating]);

  // Fetch weather and places data when the map bounds or type changes
  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      // Fetch weather data for the current coordinates
      getWeatherData(coords.lat, coords.lng).then((data) =>
        setWeatherData(data)
      );

      // Fetch places data within the map bounds and filter out places with no name or reviews
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setRating("");
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  // Callback when Google Maps Autocomplete is loaded
  const onLoad = (autoC) => setAutocomplete(autoC);

  // Callback when the selected place in Autocomplete changes
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };

  return (
    <>
      <CssBaseline />
      <Header
        color="black"
        onPlaceChanged={onPlaceChanged}
        onLoad={onLoad}
      />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
