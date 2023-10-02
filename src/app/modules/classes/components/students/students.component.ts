import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { IStudent } from '../../../../interfaces/student.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements AfterViewInit {
  @Input() students?: IStudent[];

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['avatar', 'name', 'contact'];
  data = new MatTableDataSource(this.students);

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.data.data = this.students!;
    this.data.paginator = this.paginator!;

    this.cdr.detectChanges();
  }
}
