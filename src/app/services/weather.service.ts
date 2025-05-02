import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherApiKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  getWeatherByCity(city: string): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<WeatherData>(url).pipe(
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Error fetching weather data. Please try again.'));
      })
    );
  }

  getForecastByCity(city: string): Observable<ForecastData> {
    const url = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<ForecastData>(url).pipe(
      catchError(error => {
        console.error('Error fetching forecast data:', error);
        return throwError(() => new Error('Error fetching forecast data. Please try again.'));
      })
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<WeatherData>(url).pipe(
      catchError(error => {
        console.error('Error fetching weather data by location:', error);
        return throwError(() => new Error('Error fetching weather data. Please try again.'));
      })
    );
  }

  getForecastByCoords(lat: number, lon: number): Observable<ForecastData> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<ForecastData>(url).pipe(
      catchError(error => {
        console.error('Error fetching forecast data by location:', error);
        return throwError(() => new Error('Error fetching forecast data. Please try again.'));
      })
    );
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  convertToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  getDailyForecast(forecastData: ForecastData): any[] {
    // Get one forecast per day (noon)
    const dailyForecasts: any[] = [];
    const today = new Date().setHours(0, 0, 0, 0);
    
    // Group by day
    const groupedByDay = forecastData.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(forecast);
      return acc;
    }, {} as Record<number, any[]>);
    
    // Get the forecast for 12:00 or closest to it for each day
    Object.keys(groupedByDay).forEach(dateStr => {
      const date = parseInt(dateStr);
      if (date <= today) return; // Skip today
      
      const forecasts = groupedByDay[date];
      // Find forecast closest to noon
      let closestToNoon = forecasts[0];
      let minDiff = Infinity;
      
      forecasts.forEach(forecast => {
        const forecastTime = new Date(forecast.dt * 1000);
        const diff = Math.abs(12 - forecastTime.getHours());
        if (diff < minDiff) {
          minDiff = diff;
          closestToNoon = forecast;
        }
      });
      
      dailyForecasts.push(closestToNoon);
    });
    
    return dailyForecasts.slice(0, 5); // Return max 5 days
  }
}