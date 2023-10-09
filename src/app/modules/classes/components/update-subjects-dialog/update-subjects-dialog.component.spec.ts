import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubjectsDialogComponent } from './update-subjects-dialog.component';

describe('UpdateSubjectsDialogComponent', () => {
  let component: UpdateSubjectsDialogComponent;
  let fixture: ComponentFixture<UpdateSubjectsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSubjectsDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateSubjectsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
