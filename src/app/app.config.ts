import { ApplicationConfig } from '@angular/core';
import {
  InMemoryScrollingFeature,
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

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);
const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
    provideRouter(
      routes,
      withViewTransitions(),
      inMemoryScrollingFeature,
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};
export default appConfig;
