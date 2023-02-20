import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormsMorePopupComponent } from './forms-more-popup.component';

describe('FormsMorePopupComponent', () => {
  let component: FormsMorePopupComponent;
  let fixture: ComponentFixture<FormsMorePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsMorePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsMorePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
