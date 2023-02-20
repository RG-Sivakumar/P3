import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter5Component } from './chapter5.component';

describe('Chapter5Component', () => {
  let component: Chapter5Component;
  let fixture: ComponentFixture<Chapter5Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
