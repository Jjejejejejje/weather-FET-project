import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

// Define app routes
const routes = [
  { 
    path: '', 
    loadComponent: () => import('./app/pages/weather/weather.component').then(m => m.WeatherComponent) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));