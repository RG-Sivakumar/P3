import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptiondeleteComponent } from './optiondelete.component';

describe('OptiondeleteComponent', () => {
  let component: OptiondeleteComponent;
  let fixture: ComponentFixture<OptiondeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptiondeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptiondeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
