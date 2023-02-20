import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormduplicatetableComponent } from './formduplicatetable.component';

describe('FormduplicatetableComponent', () => {
  let component: FormduplicatetableComponent;
  let fixture: ComponentFixture<FormduplicatetableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormduplicatetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormduplicatetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
