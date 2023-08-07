import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTabTableComponent } from './mat-tab-table.component';

describe('MatTabTableComponent', () => {
  let component: MatTabTableComponent;
  let fixture: ComponentFixture<MatTabTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTabTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTabTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
