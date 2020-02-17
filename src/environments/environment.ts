// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// // The list of file replacements can be found in `angular.json`.
// import { KeycloakConfig } from 'keycloak-angular';


// // Add here your keycloak setup infos
// const keycloakConfig: KeycloakConfig = {
//     url: 'https://auth.gymrabbit.io/auth',
//     realm: 'local_gymrabbit',
//     clientId: 'angular-client-web-admin'
//     // ,
//     // 'public-client': 'true'
// };

export const playStoreLink = 'https://play.google.com/store/apps';
export const appStoreLink = 'https://www.apple.com/ios/app-store/';

const firebaseConfig = {
    apiKey: "AIzaSyA4TaOCrj2LCGR4XE89zyOxgd2LG4U_cYs",
    authDomain: "qa-gymrabbit.firebaseapp.com",
    databaseURL: "https://qa-gymrabbit.firebaseio.com",
    projectId: "qa-gymrabbit",
    storageBucket: "qa-gymrabbit.appspot.com",
    messagingSenderId: "939668726176",
    appId: "1:939668726176:web:217c1a475a84b22d"
  };

export const environment = {
    // apiUrl: 'http://localhost:8080/api/appservice/v1',
    // apiaccountUrl: 'http://localhost:8084/api/accountservice/v1',
    apiUrl: 'http://dev.gymrabbit.io/api/appservice/v1',
    apiaccountUrl: 'http://dev.gymrabbit.io/api/accountservice/v1',
    baseUrl: 'http://dev.gymrabbit.io',

    hmr: false,
    secure: false,
    production: false,
    assets: {
        dotaImages:
            'https://cdn-keycloak-angular.herokuapp.com/assets/images/dota-heroes/'
    },
    apis: { dota: 'http://localhost:3000' },
    // keycloak: keycloakConfig,
    firebase: firebaseConfig
    ,
    version: 'jenkinsBuildNO'

};
//
//
// /*
//  * In development mode, to ignore zone related error stack frames such as
//  * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
//  * import the following file, but please comment it out in production mode
//  * because it will have performance impact when throw error
//  */
// // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

