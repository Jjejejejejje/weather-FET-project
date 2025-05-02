import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData, ForecastData } from '../../services/weather.service';
import { SearchComponent } from '../../components/search/search.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weatherData: WeatherData | null = null;
  forecastData: any[] = [];
  loading = false;
  error: string | null = null;
  useFahrenheit = false;
  cityName = '';
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeatherForCity('London');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getWeatherForCity(city: string): void {
    this.loading = true;
    this.error = null;
    this.cityName = city;

    this.weatherService.getWeatherByCity(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.getForecastForCity(city);
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch weather data';
          this.loading = false;
        }
      });
  }

  getForecastForCity(city: string): void {
    this.weatherService.getForecastByCity(city)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.forecastData = this.weatherService.getDailyForecast(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch forecast data';
          this.loading = false;
        }
      });
  }

  getWeatherByLocation(coords: {lat: number, lon: number}): void {
    this.loading = true;
    this.error = null;

    this.weatherService.getWeatherByCoords(coords.lat, coords.lon)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.cityName = data.name;
          this.getForecastByLocation(coords);
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch weather data';
          this.loading = false;
        }
      });
  }

  getForecastByLocation(coords: {lat: number, lon: number}): void {
    this.weatherService.getForecastByCoords(coords.lat, coords.lon)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.forecastData = this.weatherService.getDailyForecast(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch forecast data';
          this.loading = false;
        }
      });
  }

  toggleTemperatureUnit(): void {
    this.useFahrenheit = !this.useFahrenheit;
  }

  getFormattedTemperature(temp: number): string {
    let temperature = temp;
    let unit = '°C';
    
    if (this.useFahrenheit) {
      temperature = this.weatherService.convertToFahrenheit(temp);
      unit = '°F';
    }
    
    return `${Math.round(temperature)}${unit}`;
  }

  getWeatherIconUrl(icon: string): string {
    return this.weatherService.getWeatherIconUrl(icon);
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  getFormattedTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
}