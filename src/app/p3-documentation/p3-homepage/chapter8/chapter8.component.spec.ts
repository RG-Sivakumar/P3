import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter8Component } from './chapter8.component';

describe('Chapter8Component', () => {
  let component: Chapter8Component;
  let fixture: ComponentFixture<Chapter8Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
