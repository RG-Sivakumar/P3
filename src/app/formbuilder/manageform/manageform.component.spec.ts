import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageformComponent } from './manageform.component';

describe('ManageformComponent', () => {
  let component: ManageformComponent;
  let fixture: ComponentFixture<ManageformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
