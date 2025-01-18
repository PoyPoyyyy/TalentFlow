import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterLink } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient()
  ]
};
