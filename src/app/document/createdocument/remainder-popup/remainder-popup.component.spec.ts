import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemainderPopupComponent } from './remainder-popup.component';

describe('RemainderPopupComponent', () => {
  let component: RemainderPopupComponent;
  let fixture: ComponentFixture<RemainderPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
