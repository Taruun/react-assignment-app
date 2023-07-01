import { useState, useEffect, createRef } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import useStyles from "./styles.js";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

function List({
  places,
  childClicked,
  isLoading,
  type,
  setType,
  setRating,
  rating,
}) {
  const classes = useStyles();
  const [distance, setDistance] = useState(4);
  const [elRefs, setElRefs] = useState([]);

  //Filter places based on distance
  const filteredPlaces = places?.filter((place) => place.distance <= distance);

  useEffect(() => {
    // Create and initialize refs for each place
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  return (
    <div className={classes.container}>
      <Typography variant="h4">
        Restaurants, Hotels & Attractions Around You
      </Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          {/* Type filter */}
          <FormControl className={classes.formControl}>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          
           {/* Rating filter */}
          <FormControl className={classes.formControl}>
            <InputLabel>Rating</InputLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>Above 3.0</MenuItem>
              <MenuItem value={4}>Above 4.0</MenuItem>
              <MenuItem value={4.5}>Above 4.5</MenuItem>
            </Select>
          </FormControl>

           {/* Distance filter */}
          <FormControl className={classes.formControl}>
            <InputLabel>Distance (km)</InputLabel>
            <Select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <MenuItem value={0}>0 km</MenuItem>
              <MenuItem value={1}>1 km</MenuItem>
              <MenuItem value={2}>2 km</MenuItem>
              <MenuItem value={3}>3 km</MenuItem>
              <MenuItem value={4}>4 km</MenuItem>
              <MenuItem value={5}>5 km</MenuItem>
              <MenuItem value={6}>6 km</MenuItem>
              <MenuItem value={7}>7 km</MenuItem>
              <MenuItem value={8}>8 km</MenuItem>
              <MenuItem value={9}>9 km</MenuItem>
              <MenuItem value={10}>10 km</MenuItem>
            </Select>
          </FormControl>
          
           {/* Grid of places */}
          <Grid container spacing={3} className={classes.list}>
            {filteredPlaces?.map((place, i) => (
              <Grid ref={elRefs[i]} item key={i} xs={12}>
                <PlaceDetails
                  place={place}
                  selected={Number(childClicked) === i}
                  refProp={elRefs[i]}
                  distance={distance}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}

export default List;

