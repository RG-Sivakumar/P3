import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HiddenProjectComponent } from './hidden-project.component';

describe('HiddenProjectComponent', () => {
  let component: HiddenProjectComponent;
  let fixture: ComponentFixture<HiddenProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
