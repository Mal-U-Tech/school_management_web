import { Component, Input } from '@angular/core';
import { IUser } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent {
  @Input() teachers!: IUser[];
}
