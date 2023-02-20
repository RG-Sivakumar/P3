import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DevAdminConvertComponent } from './dev-admin-convert.component';

describe('DevAdminConvertComponent', () => {
  let component: DevAdminConvertComponent;
  let fixture: ComponentFixture<DevAdminConvertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevAdminConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevAdminConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
