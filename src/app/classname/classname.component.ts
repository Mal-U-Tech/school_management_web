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
import { Store } from '@ngrx/store';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { IClassnameArray } from '../shared/classname/classname.interface';
import {
  postStreamArrayRequest,
  postSuccessAction,
  streamsIsLoading,
} from '../store/streams/streams.actions';
import { selectPostSuccess } from '../store/streams/streams.selector';

@Component({
  selector: 'app-classname',
  templateUrl: './classname.component.html',
  styleUrls: ['./classname.component.scss'],
})
export class ClassnameComponent {
  @ViewChild('streamDialogContent') streamDialog = {} as TemplateRef<string>;
  @Input() closeDialog: any;
  @ViewChildren('inputField') inputs!: QueryList<any>;
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  postSuccess$ = this.store.select(selectPostSuccess);

  listLength = 0;
  constructor(
    public apiService: ClassnameApiService,
    public router: Router,
    private store: Store
  ) {
    this.postSuccess$.subscribe({
      next: (data: boolean) => {
        console.log(`This is postSuccess ${data}`)
        if (data) {
          this.closeStreamDialog();
        }
      },
    });
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

  streamsIsLoading(state: boolean) {
    this.store.dispatch(streamsIsLoading({ streamsIsLoading: state }));
  }

  dispatchPostSuccessAction(state: boolean) {
    this.store.dispatch(postSuccessAction({postSuccess: state}));
  }

  Geeks() {
    this.streamsIsLoading(true);
    // assign classnames to classname array
    const namesArray: IClassnameArray = {
      names: this.classNames,
    };

    this.dispatchPostSuccessAction(false);

    // make api call via store effect
    this.store.dispatch(
      postStreamArrayRequest({
        classnames: namesArray,
        postSuccess: false,
      })
    );

    // this.apiService.postClassnamesArray(namesArray).subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //     this.apiService.successToast('Successfully added streams');
    //     this.closeStreamDialog();
    //     this.res = 1;
    //   },
    //   error: (error) => {
    //     this.apiService.errorToast(error);
    //     this.closeStreamDialog();
    //     this.res = 0;
    //   },
    // });
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
