import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormlistComponent } from './formlist.component';

describe('FormlistComponent', () => {
  let component: FormlistComponent;
  let fixture: ComponentFixture<FormlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
