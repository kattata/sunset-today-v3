export async function fetchLocationByTerm(term: string) {
  const res = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${term}`, {
    headers: {
      'X-Api-Key': import.meta.env.VITE_API_KEY
    }
  });
  const data = await res.json();
  return data;
}

export async function getCurrentLocation() {
  const response = {
    data: {
      lat: '0',
      lng: '0'
    },
    error: ''
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(((geolocation: any) => {
      response.data =  {
        lat: geolocation.coords.latitude,
        lng: geolocation.coords.longitude
      };
    }));
  } else {
    response.error = "Geolocation is not supported by this browser.";
    response.data = {
      lat: '0',
      lng: '0'
    }
  }
  return response;
}