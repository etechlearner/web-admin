import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingOffersComponent } from './setting-offers.component';

describe('SettingOffersComponent', () => {
  let component: SettingOffersComponent;
  let fixture: ComponentFixture<SettingOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
