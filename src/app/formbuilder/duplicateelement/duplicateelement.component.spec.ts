import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DuplicateelementComponent } from './duplicateelement.component';

describe('DuplicateelementComponent', () => {
  let component: DuplicateelementComponent;
  let fixture: ComponentFixture<DuplicateelementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateelementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateelementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
