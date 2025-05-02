import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <form (submit)="submitSearch($event)">
        <div class="search-input-container">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            name="searchTerm" 
            placeholder="Enter city name..."
            class="search-input"
            autocomplete="off"
          />
          <button type="submit" class="btn btn-primary search-button">
            <span class="btn-text">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      <div class="location-button-container">
        <button 
          (click)="useCurrentLocation()" 
          class="btn location-button" 
          [disabled]="isGettingLocation"
        >
          <span *ngIf="!isGettingLocation">Use current location</span>
          <span *ngIf="isGettingLocation" class="loading-spinner-small"></span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      margin-bottom: 2rem;
    }
    .search-input-container {
      display: flex;
      gap: 0.5rem;
    }
    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    .search-button {
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .search-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
    .location-button-container {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
    }
    .location-button {
      background-color: transparent;
      color: var(--primary-color);
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--primary-color);
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .location-button:hover:not(:disabled) {
      background-color: rgba(59, 130, 246, 0.1);
    }
    .location-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .loading-spinner-small {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      border-top-color: var(--primary-color);
      animation: spin 1s ease-in-out infinite;
    }
    @media (max-width: 640px) {
      .search-input-container {
        flex-direction: column;
      }
      .search-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  @Output() locationSearch = new EventEmitter<{lat: number, lon: number}>();
  
  searchTerm = '';
  isGettingLocation = false;

  submitSearch(event: Event): void {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm.trim());
    }
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      this.isGettingLocation = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          this.locationSearch.emit(coords);
          this.isGettingLocation = false;
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please try searching by city name.');
          this.isGettingLocation = false;
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please try searching by city name.');
    }
  }
}