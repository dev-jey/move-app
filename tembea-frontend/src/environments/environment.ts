// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Always update the other envs for all new values you are adding
// Do not change the andelaAuthServiceUrl
export const environment = {
  production: false,
  tembeaBackEndUrl: 'http://localhost:5000',
  andelaAuthServiceUrl: 'https://api-staging.andela.com/login?redirect_url',
  teamUrl: 'andela-tembea.slack.com',
  googMapsAPIKey: 'AIzaSyDT1bJDksmdUa0221cLtjq36p9GidNa110',
  BUGSNAG_API_KEY: 'your glory my savior',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
