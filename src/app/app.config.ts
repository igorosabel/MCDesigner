import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import routes from '@app/app.routes';
import TokenInterceptor from '@app/interceptors/token.interceptor';
import provideCore from '@modules/core';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling(scrollConfig),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};
export default appConfig;
