import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormdesignComponent } from './formdesign.component';

describe('FormdesignComponent', () => {
  let component: FormdesignComponent;
  let fixture: ComponentFixture<FormdesignComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormdesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormdesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
