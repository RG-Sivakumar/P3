import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RefreshWindowComponent } from './refresh-window.component';

describe('RefreshWindowComponent', () => {
  let component: RefreshWindowComponent;
  let fixture: ComponentFixture<RefreshWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
