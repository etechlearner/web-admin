import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AminityIonicPickerComponent } from './aminity-ionic-picker.component';

describe('AminityIonicPickerComponent', () => {
  let component: AminityIonicPickerComponent;
  let fixture: ComponentFixture<AminityIonicPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AminityIonicPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AminityIonicPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
