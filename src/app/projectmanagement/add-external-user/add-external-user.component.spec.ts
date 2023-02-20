import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExternalUserComponent } from './add-external-user.component';

describe('AddExternalUserComponent', () => {
  let component: AddExternalUserComponent;
  let fixture: ComponentFixture<AddExternalUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExternalUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
