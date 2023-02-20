import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DuplicateformComponent } from './duplicateform.component';

describe('DuplicateformComponent', () => {
  let component: DuplicateformComponent;
  let fixture: ComponentFixture<DuplicateformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
