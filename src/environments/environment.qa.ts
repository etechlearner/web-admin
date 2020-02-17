// import {KeycloakConfig} from 'keycloak-angular';

// /** Keyclock Env Config */ const keycloakConfig: KeycloakConfig = {
//     url: 'https://auth.gymrabbit.io/auth',
//     realm: 'qa_gymrabbit',
//     clientId: 'angular-client-web-admin'
// };
export const playStoreLink = 'https://play.google.com/store/apps';
export const appStoreLink = 'https://www.apple.com/ios/app-store/';

/** Firebase Env Config */ 
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
    apiUrl: 'https://qa.gymrabbit.io/api/appservice/v1',
    apiaccountUrl: 'https://qa.gymrabbit.io/api/accountservice/v1',
    baseUrl: 'https://qa.gymrabbit.io',
    hmr: false,
    secure: false,
    production: false,
    assets: {dotaImages: 'https://cdn-keycloak-angular.herokuapp.com/assets/images/dota-heroes/'},
    apis: {dota: 'http://localhost:3000'},
    // keycloak: keycloakConfig,
    firebase: firebaseConfig,
    version: 'jenkinsBuildNO'

};
