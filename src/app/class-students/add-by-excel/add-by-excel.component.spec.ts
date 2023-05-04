import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddByExcelComponent } from './add-by-excel.component';

describe('AddByExcelComponent', () => {
  let component: AddByExcelComponent;
  let fixture: ComponentFixture<AddByExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddByExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
