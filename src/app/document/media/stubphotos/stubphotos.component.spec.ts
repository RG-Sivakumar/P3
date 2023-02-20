import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StubphotosComponent } from './stubphotos.component';

describe('StubphotosComponent', () => {
  let component: StubphotosComponent;
  let fixture: ComponentFixture<StubphotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StubphotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StubphotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
