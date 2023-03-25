import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepartmentsTableComponent } from './view-departments-table.component';

describe('ViewDepartmentsTableComponent', () => {
  let component: ViewDepartmentsTableComponent;
  let fixture: ComponentFixture<ViewDepartmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDepartmentsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDepartmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
