import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DuplicatetableComponent } from './duplicatetable.component';

describe('DuplicatetableComponent', () => {
  let component: DuplicatetableComponent;
  let fixture: ComponentFixture<DuplicatetableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
