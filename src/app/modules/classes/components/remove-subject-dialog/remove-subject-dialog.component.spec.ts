import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSubjectDialogComponent } from './remove-subject-dialog.component';

describe('RemoveSubjectDialogComponent', () => {
  let component: RemoveSubjectDialogComponent;
  let fixture: ComponentFixture<RemoveSubjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveSubjectDialogComponent]
    });
    fixture = TestBed.createComponent(RemoveSubjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
