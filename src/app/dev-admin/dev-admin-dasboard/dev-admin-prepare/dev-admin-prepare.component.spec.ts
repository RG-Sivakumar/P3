import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DevAdminPrepareComponent } from './dev-admin-prepare.component';

describe('DevAdminPrepareComponent', () => {
  let component: DevAdminPrepareComponent;
  let fixture: ComponentFixture<DevAdminPrepareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevAdminPrepareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevAdminPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
