import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddtotoolbarstampComponent } from './addtotoolbarstamp.component';

describe('AddtotoolbarstampComponent', () => {
  let component: AddtotoolbarstampComponent;
  let fixture: ComponentFixture<AddtotoolbarstampComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtotoolbarstampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtotoolbarstampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
