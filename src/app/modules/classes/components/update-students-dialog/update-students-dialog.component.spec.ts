import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentsDialogComponent } from './update-students-dialog.component';

describe('UpdateStudentsDialogComponent', () => {
  let component: UpdateStudentsDialogComponent;
  let fixture: ComponentFixture<UpdateStudentsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudentsDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateStudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
