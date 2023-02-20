import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormsupportComponent } from './formsupport.component';

describe('FormsupportComponent', () => {
  let component: FormsupportComponent;
  let fixture: ComponentFixture<FormsupportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
