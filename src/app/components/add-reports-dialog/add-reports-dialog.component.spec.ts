import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportsDialogComponent } from './add-reports-dialog.component';

describe('AddReportsDialogComponent', () => {
  let component: AddReportsDialogComponent;
  let fixture: ComponentFixture<AddReportsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
