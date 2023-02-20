import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DuplicateToolbarComponent } from './duplicate-toolbar.component';

describe('DuplicateToolbarComponent', () => {
  let component: DuplicateToolbarComponent;
  let fixture: ComponentFixture<DuplicateToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
