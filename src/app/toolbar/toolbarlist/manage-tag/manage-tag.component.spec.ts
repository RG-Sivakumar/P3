import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageTagComponent } from './manage-tag.component';

describe('ManageTagComponent', () => {
  let component: ManageTagComponent;
  let fixture: ComponentFixture<ManageTagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
