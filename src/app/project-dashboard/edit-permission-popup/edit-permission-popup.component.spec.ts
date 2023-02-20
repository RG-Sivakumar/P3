import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPermissionPopupComponent } from './edit-permission-popup.component';

describe('EditPermissionPopupComponent', () => {
  let component: EditPermissionPopupComponent;
  let fixture: ComponentFixture<EditPermissionPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPermissionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPermissionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
