import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DevAdminLoginComponent } from './dev-admin-login.component';

describe('DevAdminLoginComponent', () => {
  let component: DevAdminLoginComponent;
  let fixture: ComponentFixture<DevAdminLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevAdminLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevAdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
