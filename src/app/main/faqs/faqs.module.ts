import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqListComponent } from './faq-list/faq-list.component';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule
} from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FaqService } from './faq.service';
import { FaqComponent } from './faq/faq.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
    {
        path: 'faqs',
        component: FaqListComponent,
        resolve: {
            data: FaqService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'faqs/:id',
        component: FaqComponent,
        resolve: {
            data: FaqService
        },
        canActivate: [AuthGuard]

    },
    {
        path: 'faqs/:id/:handle',
        component: FaqComponent,
        resolve: {
            data: FaqService
        },
        canActivate: [AuthGuard]

    }
];


@NgModule({
    declarations: [FaqListComponent, FaqComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatDialogModule,

        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule
    ]
})
export class FaqsModule {
}
