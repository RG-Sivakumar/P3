import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportFormsComponent } from './import-forms.component';

describe('ImportFormsComponent', () => {
  let component: ImportFormsComponent;
  let fixture: ComponentFixture<ImportFormsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
