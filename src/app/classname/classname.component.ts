import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-classname',
  templateUrl: './classname.component.html',
  styleUrls: ['./classname.component.sass'],
})
export class ClassnameComponent implements OnInit {
  @ViewChild('streamDialogContent') streamDialog = {} as TemplateRef<string>;
  @Input() closeDialog: any;
  @ViewChildren('inputField') inputs!: QueryList<any>;
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  listLength = 0;
  constructor(
    private _snackBar: MatSnackBar,
    public apiService: ClassnameApiService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // this.openDialog();
  }

  public classNames = [{ id: this.listLength, name: '' }];
  public title = 'Add Streams';
  public res = 0;

  closeStreamDialog() {
    this.onClose.emit();
  }

  submitStreamsRequest() {
    this.onSubmit.emit();
  }

  Geeks() {
    // make api call via service
    this.apiService.postClassnamesArray({ names: this.classNames }).subscribe({
      next: (data: any) => {
        console.log(data);
        this.openSnackBar('Successfully added streams', 'Close');
        this.closeStreamDialog();
        this.res = 1;
      },
      error: (error) => {
        this.openSnackBar(error, 'Close');
        this.closeStreamDialog();
        this.res = 0;
      },
    });
    console.log(this.classNames);
  }

  jumpToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  appendInput() {
    this.listLength += 1;

    // this.classNames = [...this.classNames, newElement];
    this.classNames.push({ id: this.listLength, name: '' });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  trackByFn(index: any, el: any) {
    return index;
  }
}
