import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HiddenlistComponent } from './hiddenlist.component';

describe('HiddenlistComponent', () => {
  let component: HiddenlistComponent;
  let fixture: ComponentFixture<HiddenlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
