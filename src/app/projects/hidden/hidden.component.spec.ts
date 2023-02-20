import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HiddenComponent } from './hidden.component';

describe('HiddenComponent', () => {
  let component: HiddenComponent;
  let fixture: ComponentFixture<HiddenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
