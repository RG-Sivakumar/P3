import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldsheetComponent } from './fieldsheet.component';

describe('FieldsheetComponent', () => {
  let component: FieldsheetComponent;
  let fixture: ComponentFixture<FieldsheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
