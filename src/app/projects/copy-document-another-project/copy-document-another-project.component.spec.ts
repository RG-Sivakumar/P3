import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDocumentAnotherProjectComponent } from './copy-document-another-project.component';

describe('CopyDocumentAnotherProjectComponent', () => {
  let component: CopyDocumentAnotherProjectComponent;
  let fixture: ComponentFixture<CopyDocumentAnotherProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyDocumentAnotherProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDocumentAnotherProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
