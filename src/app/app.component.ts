import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <h1>Weather App</h1>
        </div>
      </header>
      <main class="container">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <div class="container">
          <p>&copy; 2025 Weather App</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .app-header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    main {
      flex: 1;
      padding: 2rem 0;
    }
    .app-footer {
      background-color: #f3f4f6;
      padding: 1rem 0;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class AppComponent {
  title = 'Weather App';
}