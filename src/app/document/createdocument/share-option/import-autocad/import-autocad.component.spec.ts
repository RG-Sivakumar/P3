import { ComponentFixture, TestBed } from '@angular/core/testing';
import { v1 as uuidv1 } from "uuid";
import { ImportAutocadComponent } from './import-autocad.component';

describe('ImportAutocadComponent', () => {
  let component: ImportAutocadComponent;
  let fixture: ComponentFixture<ImportAutocadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAutocadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAutocadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
