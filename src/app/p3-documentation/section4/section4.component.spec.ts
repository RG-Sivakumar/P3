import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Section4Component } from './section4.component';

describe('Section4Component', () => {
  let component: Section4Component;
  let fixture: ComponentFixture<Section4Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Section4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
