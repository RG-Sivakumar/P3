import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessAutoCADComponent } from './success-auto-cad.component';

describe('SuccessAutoCADComponent', () => {
  let component: SuccessAutoCADComponent;
  let fixture: ComponentFixture<SuccessAutoCADComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessAutoCADComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessAutoCADComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
