import type { UnsplashResponse } from "@/types";
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

  const response: UnsplashResponse = {
    url: data.urls.regular,
    credits: {
      author: data.user.name,
      profileUrl: `${data.user.links.html}?utm_source=SunsetTodayV3&utm_medium=referral`
    }
  };
  
  return response;
}