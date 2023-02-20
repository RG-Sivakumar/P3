import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlistpopupComponent } from './formlistpopup.component';

describe('FormlistpopupComponent', () => {
  let component: FormlistpopupComponent;
  let fixture: ComponentFixture<FormlistpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlistpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlistpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
