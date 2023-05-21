export interface Coordinates {
  lat: number;
  lng: number
}

export interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
}

export interface UnsplashResponse {
  url: string;
  credits: UnsplashCredits;
}

export interface UnsplashCredits {
  author: string;
  profileUrl: string;
}