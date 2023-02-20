import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimberformComponent } from './timberform.component';

describe('TimberformComponent', () => {
  let component: TimberformComponent;
  let fixture: ComponentFixture<TimberformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimberformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimberformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
