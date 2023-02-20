import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Shareoption1Component } from './shareoption1.component';

describe('Shareoption1Component', () => {
  let component: Shareoption1Component;
  let fixture: ComponentFixture<Shareoption1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Shareoption1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Shareoption1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
