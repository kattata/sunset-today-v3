import { zonedTimeToUtc } from "date-fns-tz";

export async function fetchLocationByTerm(term: string) {
  const res = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${term}`, {
    headers: {
      'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY
    }
  });
  
  const data = await res.json();
  return data;
}

export function getCurrentLocation() {
  // const response = {
  //     lat: 0,
  //     lng: 0
  // };

  let response = {};

  // if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position: any) => {
      // return {
        // response.lat = position.coords.latitude;
        // response.lng = position.coords.longitude;
        response = position.coords;
      // }
    });
  // } else {
  //   console.log("Geolocation is not supported by this browser.");
  // }
  // else {
  //   response.error = "Geolocation is not supported by this browser.";
  //   response.data = {
  //     lat: 0,
  //     lng: 0
  //   }
  // }
  return response;
}

export async function fetchSunsetTime (lat: number, lng: number) {
  const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&timezone=UTC`);
  const data = await res.json();

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(data.results.sunset, timezone); 
  return String(utcDate);
}

export async function fetchBackground () {
  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY;
  const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}&query=sunset`);
  const data = await res.json();

  return data.urls.regular;
}