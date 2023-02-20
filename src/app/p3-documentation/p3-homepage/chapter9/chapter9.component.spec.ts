import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter9Component } from './chapter9.component';

describe('Chapter9Component', () => {
  let component: Chapter9Component;
  let fixture: ComponentFixture<Chapter9Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
