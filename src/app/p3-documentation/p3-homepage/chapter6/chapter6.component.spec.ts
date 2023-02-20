import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter6Component } from './chapter6.component';

describe('Chapter6Component', () => {
  let component: Chapter6Component;
  let fixture: ComponentFixture<Chapter6Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
