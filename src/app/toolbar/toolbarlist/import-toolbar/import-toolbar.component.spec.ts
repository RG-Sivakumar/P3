import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportToolbarComponent } from './import-toolbar.component';

describe('ImportToolbarComponent', () => {
  let component: ImportToolbarComponent;
  let fixture: ComponentFixture<ImportToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
