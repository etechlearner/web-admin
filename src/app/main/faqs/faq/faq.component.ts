import { Component, OnDestroy, OnInit } from '@angular/core';
import { Faq } from '../faq.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { FaqService } from '../faq.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    animations: fuseAnimations
})
export class FaqComponent implements OnInit, OnDestroy {
    faq: Faq;
    pageType: string;
    faqForm: FormGroup;

    // myControl = new FormControl();
    package_id: string;

    // Private
    private _unsubscribeAll: Subject<any>;
    toppings = new FormControl();

    env: any;

    constructor(
        private _faqService: FaqService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _router: Router
    ) {
        // Set the default
        this.faq = new Faq();
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this._faqService.onItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(faq => {
                if (faq) {
                    this.faq = new Faq(faq);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.faq = new Faq();
                }
                this.faqForm = this.createFaqForm();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createFaqForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.faq.id],
            answer: [this.faq.answer, [Validators.required, answerValidator]],
            question: [this.faq.question, [Validators.required, questionValidator]],
            handle: [this.faq.handle],
        });
    }

    saveFaq(): void {
        const data = this.faqForm.getRawValue();
        if (data.answer !== " " && data.question !== " ") {
            this._faqService.saveItem(data)
                .then(() => {
                    // Trigger the subscription with new data
                    this._faqService.onItemChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Record saved', 'OK', {
                        verticalPosition: 'bottom',
                        duration: 3000
                    });
                    this._router.navigate(['/faqs']);
                });
        } else {
            this._matSnackBar.open('Invalid text', 'OK', {
                verticalPosition: 'bottom',
                duration: 3000
            });
        }
    }

    addFaq(): void {
        const data = this.faqForm.getRawValue();
        if (data.answer !== " " && data.question !== " ") {
            console.log("Entered")
            this._faqService.addItem(data)
                .then(() => {
                    // Trigger the subscription with new data
                    this._faqService.onItemChanged.next(data);
                    // Show the success message
                    this._matSnackBar.open('Record added', 'OK', {
                        verticalPosition: 'bottom',
                        duration: 3000
                    });

                    // Change the location with new one
                    this._router.navigate(['/faqs']);
                });
        } else {
            this._matSnackBar.open('Invalid text', 'OK', {
                verticalPosition: 'bottom',
                duration: 2000
            });
        }
    }

}

export const questionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    let name = control.parent.get('question').value;

    if (name.trim()) {
        return null;
    }

    return { 'blankName': true };
};

export const answerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    let name = control.parent.get('answer').value;

    if (name.trim()) {
        return null;
    }

    return { 'blankName': true };
};