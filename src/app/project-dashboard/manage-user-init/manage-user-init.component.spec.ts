import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageUserInitComponent } from './manage-user-init.component';

describe('ManageUserInitComponent', () => {
  let component: ManageUserInitComponent;
  let fixture: ComponentFixture<ManageUserInitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUserInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
