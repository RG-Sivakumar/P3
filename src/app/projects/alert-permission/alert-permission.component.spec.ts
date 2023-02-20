import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertPermissionComponent } from './alert-permission.component';

describe('AlertPermissionComponent', () => {
  let component: AlertPermissionComponent;
  let fixture: ComponentFixture<AlertPermissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
