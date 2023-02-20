import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldselectfolderComponent } from './fieldselectfolder.component';

describe('FieldselectfolderComponent', () => {
  let component: FieldselectfolderComponent;
  let fixture: ComponentFixture<FieldselectfolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldselectfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldselectfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
