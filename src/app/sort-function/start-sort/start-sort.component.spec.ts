import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartSortComponent } from './start-sort.component';

describe('StartSortComponent', () => {
  let component: StartSortComponent;
  let fixture: ComponentFixture<StartSortComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
