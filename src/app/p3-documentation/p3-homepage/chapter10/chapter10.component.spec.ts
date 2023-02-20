import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter10Component } from './chapter10.component';

describe('Chapter10Component', () => {
  let component: Chapter10Component;
  let fixture: ComponentFixture<Chapter10Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
