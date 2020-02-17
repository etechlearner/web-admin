import { Component, OnInit } from '@angular/core';
import { Aminity } from '../aminity.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AminityService } from '../aminity.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { fuseAnimations } from '@fuse/animations';
// import {UploadFileService} from 'app/main/firebase/upload-file.service';
import { UploadFile } from 'app/main/firebase/upload-file.model';
import { reject } from 'q';
import { FileValidator } from '../file-input.validator';
import { AminityIonicPickerComponent } from '../aminity-ionic-picker/aminity-ionic-picker.component';
import { AminityIcon } from '../aminity-icon.model';

// The name for the new bucket
const bucketName = 'my-new-bucket';

@Component({
    selector: 'app-aminity',
    templateUrl: './aminity.component.html',
    styleUrls: ['./aminity.component.scss'],
    animations: fuseAnimations
})
export class AminityComponent implements OnInit {
    aminity: Aminity;
    pageType: string;
    previewPath: String;
    aminityForm: FormGroup;

    // myControl = new FormControl();
    package_id: string;

    icons: AminityIcon[];
    // Private
    private _unsubscribeAll: Subject<any>;
    toppings = new FormControl();
    formSubmitted = false;
    env: any;
    imageSrc: string;
    selectedFiles: FileList;
    currentFileUpload: UploadFile;
    progress: { percentage: number } = { percentage: 0 };

    dialogRef: any;

    constructor(
        private _aminityService: AminityService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _router: Router,
        private activatedRoute: ActivatedRoute
        // private _uploadService: UploadFileService
    ) {
        // Set the default
        this.aminity = new Aminity();
        // // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this._aminityService.onItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(aminity => {
                if (aminity) {
                    this.aminity = new Aminity(aminity);
                    this.pageType = 'edit';
                    this.imageSrc = this.aminity.url;
                } else {
                    this.pageType = 'new';
                    this.aminity = new Aminity();
                }
                this.aminityForm = this.createAminityForm();
            });

        this._aminityService.getIconsItems().subscribe(amenityIcons => {
            this.icons = amenityIcons;
        });
    }

    ngOnDestroy = (): void => {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectFile = event => {
        this.selectedFiles = event.target.files;
        const file = this.selectedFiles.item(0);
        this.currentFileUpload = new UploadFile(file);
        console.log(this.currentFileUpload);

        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            reader.onload = (e: any) => {
                this.imageSrc = e.target.result;
            };
        }
    }

    createAminityForm = (): FormGroup => this._formBuilder.group({
        id: [this.aminity.id],
        name: [this.aminity.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        image: [this.aminity.image, [FileValidator.validate]],
        handle: [this.aminity.handle],
    })

    saveAminity(isImage: boolean): void {
        const data = this.aminityForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        // if (isImage === true) {
        //   data.image = this._uploadService.file.url;
        // }

        this._aminityService.saveItem(data)
            .then(() => {
                // Trigger the subscription with new data
                this._aminityService.onItemChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Record saved', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });
                this._router.navigate(['/aminities']);
            });
    }

    updateAminity(): void {
        const data = this.aminityForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        this.formSubmitted = true;
        if (this.selectedFiles === undefined) {
            this.saveAminity(false);
        } else {
            const file = this.selectedFiles.item(0);

            this.selectedFiles = undefined;

            this.currentFileUpload = new UploadFile(file);
            // this._uploadService.pushFileToStorage(this.currentFileUpload, this.progress).then(() => {
            //     this.saveAminity(true);
            // }).catch((err) => {
            //     reject(err);
            // });
        }
    }

    addAminity(): void {
        const data = this.aminityForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this._aminityService.addItem(data)
            .then(() => {

                // Trigger the subscription with new data
                this._aminityService.onItemChanged.next(data);
                // Show the success message
                this._matSnackBar.open('Record added', 'OK', {
                    verticalPosition: 'bottom',
                    duration: 3000
                });

                // Change the location with new one
                this._router.navigate(['/aminities']);
            });
        // const file = this.selectedFiles.item(0);
        // this.selectedFiles = undefined;
        // this.formSubmitted = true;

        // this.currentFileUpload = new UploadFile(file);
        // this._uploadService.pushFileToStorage(this.currentFileUpload, this.progress).then(() => {

        //   data.image = this._uploadService.file.url;

        // }).catch((err) => {
        //   reject(err);
        // });
    }

    selectIcons(): void {
        this.dialogRef = this._matDialog.open(AminityIonicPickerComponent, {
            panelClass: 'app-aminity-ionic-picker',
            data: {
                action: 'new',
                icons: this.icons

            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: AminityIcon) => {
                if (!response) {
                    return;
                }
                this.imageSrc = response.handle;
                this.aminityForm.controls['image'].setValue(response.name);
                console.log(response);
            });
    }
}
