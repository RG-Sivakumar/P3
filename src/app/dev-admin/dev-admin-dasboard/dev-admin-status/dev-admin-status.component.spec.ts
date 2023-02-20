import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DevAdminStatusComponent } from './dev-admin-status.component';

describe('DevAdminStatusComponent', () => {
  let component: DevAdminStatusComponent;
  let fixture: ComponentFixture<DevAdminStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevAdminStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevAdminStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
