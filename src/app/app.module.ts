import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { LoginModule } from './main/login/login.module';
import { DashboardModule } from './main/dashboard/dashboard.module';

// ngrx
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers/user.reducer';
import { AuthGuard } from './main/auth-guard.service';
import { AuthService } from './main/auth.service';
import { GymsModule } from './main/gyms/gyms.module';
import { TeamsModule } from './main/teams/teams.module';
import { CustomersModule } from './main/customers/customers.module';
import { HttpModule } from '@angular/http';
import { FinancesModule } from './main/finances/finances.module';
import { SupportsModule } from './main/supports/supports.module';
import { FaqsModule } from './main/faqs/faqs.module';
import { SettingsModule } from './main/settings/settings.module';
import { SubscriptionsModule } from './main/subscriptions/subscriptions.module';
import { AminitiesModule } from './main/aminities/aminities.module';
import { FirebaseModule } from './main/firebase/firebase.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthorizationsModule } from './main/authorizations/authorizations.module';
import { InterceptorService } from './main/interceptor.service';
import { ErrorInterceptor } from './main/error.interceptor';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import 'firebase/firestore';
import { NotificationsModule } from './main/notifications/notifications.module';
import { ToastrModule } from 'ngx-toastr';

const appRoutes: Routes = [
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,
        LoginModule,
        DashboardModule,
        GymsModule,
        TeamsModule,
        CustomersModule,
        FinancesModule,
        SupportsModule,
        FaqsModule,
        SettingsModule,
        SubscriptionsModule,
        AminitiesModule,
        AuthorizationsModule,
        NotificationsModule,

        // Toastr Notifications
        ToastrModule.forRoot(),

        //Firebase
        FirebaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFirestoreModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,

        // ngrx
        StoreModule.forRoot({
            reducer
        })
    ],
    providers: [
        {
            provide : LocationStrategy ,
            useClass: HashLocationStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        AuthGuard,
        AuthService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
