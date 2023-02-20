import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagetagsComponent } from './managetags.component';

describe('ManagetagsComponent', () => {
  let component: ManagetagsComponent;
  let fixture: ComponentFixture<ManagetagsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagetagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagetagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
