import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStubsComponent } from './add-stubs.component';

describe('AddStubsComponent', () => {
  let component: AddStubsComponent;
  let fixture: ComponentFixture<AddStubsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
