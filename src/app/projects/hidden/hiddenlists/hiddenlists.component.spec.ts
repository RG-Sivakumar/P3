import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HiddenlistsComponent } from './hiddenlists.component';

describe('HiddenlistsComponent', () => {
  let component: HiddenlistsComponent;
  let fixture: ComponentFixture<HiddenlistsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenlistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
