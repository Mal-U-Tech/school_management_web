import {
  Component,
  EventEmitter,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { IClassnameArray } from '../shared/classname/classname.interface';

@Component({
  selector: 'app-classname',
  templateUrl: './classname.component.html',
  styleUrls: ['./classname.component.scss'],
})
export class ClassnameComponent  {
  @ViewChild('streamDialogContent') streamDialog = {} as TemplateRef<string>;
  @Input() closeDialog: any;
  @ViewChildren('inputField') inputs!: QueryList<any>;
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  listLength = 0;
  constructor(
    public apiService: ClassnameApiService,
    public router: Router
  ) {}



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
    // assign classnames to classname array
    const namesArray: IClassnameArray = {
      names: this.classNames,
    }

    // make api call via service
    this.apiService.postClassnamesArray(namesArray).subscribe({
      next: (data: any) => {
        console.log(data);
        this.apiService.successToast('Successfully added streams');
        this.closeStreamDialog();
        this.res = 1;
      },
      error: (error) => {
        this.apiService.errorToast(error);
        this.closeStreamDialog();
        this.res = 0;
      },
    });
  }

  jumpToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  appendInput() {
    this.listLength += 1;

    // this.classNames = [...this.classNames, newElement];
    this.classNames.push({ id: this.listLength, name: '' });
  }

  trackByFn(index: any, el: any) {
    return index;
  }
}
