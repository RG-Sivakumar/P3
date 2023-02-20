import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Section3Component } from './section3.component';

describe('Section3Component', () => {
  let component: Section3Component;
  let fixture: ComponentFixture<Section3Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Section3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
