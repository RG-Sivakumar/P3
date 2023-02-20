import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmpopupComponent } from './confirmpopup.component';

describe('ConfirmpopupComponent', () => {
  let component: ConfirmpopupComponent;
  let fixture: ComponentFixture<ConfirmpopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
