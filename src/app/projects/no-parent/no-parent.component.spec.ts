import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoParentComponent } from './no-parent.component';

describe('NoParentComponent', () => {
  let component: NoParentComponent;
  let fixture: ComponentFixture<NoParentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
