import { Component, EventEmitter, OnInit } from '@angular/core';
import { Setting } from '../setting.model';
import { FormGroup, FormBuilder, FormControl, NgForm, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { SettingService } from '../setting.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { HtmlEditorService, ImageService, LinkService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-setting-default',
    templateUrl: './setting-page.component.html',
    styleUrls: ['./setting-page.component.scss'],
    providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
    animations: fuseAnimations
})

export class SettingPageComponent implements OnInit {
    setting: Setting;
    settings;
    pageType: string;
    settingForm: FormGroup;
    edit: boolean = false;
    routeParams: any;
    pagecontent: string;
    public reenableButton = new EventEmitter<boolean>(false);
    value = '<strong>The Tortoise</strong> &amp; the Hare';
    package_id: string;
    private _unsubscribeAll: Subject<any>;
    toppings = new FormControl();
    env: any;
    tools = {
        items: ['Bold', 'Italic', 'Underline', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList', '|',
            'CreateLink', '|', 'Undo', 'Redo', '|', 'SourceCode']
    }

    constructor(
        private _settingService: SettingService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this.setting = new Setting();
        this._unsubscribeAll = new Subject();
        route.params.subscribe((data) => {
            this.routeParams = data.id;
        });
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this._settingService.onItemsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(setting => {
                this.settings = setting;
                this.settingForm = this.createSettingForm(setting.appValue);
            });
    }

    byPassSanitization() {
        return this.sanitizer.bypassSecurityTrustHtml(this.settings.appValue)
    }

    ngOnDestroy = (): void => {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createSettingForm(appValue?): FormGroup {
        return this._formBuilder.group({
            name: [this.settings.appValue.slice(
                this.settings.appValue.indexOf(">") + 1,
                this.settings.appValue.indexOf("/") - 1
            ), [headingValidator]],
            description: [this.settings.appValue.slice(
                this.settings.appValue.indexOf("/") + 4
            )],
        });
    }

    saveSetting(): void {
        const data = this.settingForm.getRawValue();
        let appValue = `<h1>${data.name}</h1>${data.description}`;
        this.settings.appValue = appValue;
        this._settingService.updateSettingsContent(this.settings)
            .then((res: any) => {
                // console.log(res)
                this.toggleEdit();
            })
            .catch(err => {
                console.log(err)
                this._matSnackBar.open("Unable to update", "Ok", {
                    verticalPosition: 'bottom',
                    duration: 3000
                })
            })
    }

    addSetting(): void {
        const data = this.settingForm.getRawValue();
        console.log(data);
    }

    toggleEdit() {
        this.edit = !this.edit;
    }

    resetForm() {
        this.settingForm.reset();
    }

}

export const headingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    let name = control.parent.get('name').value;

    if (name.trim()) {
        return null;
    }

    return { 'blankName': true };
};