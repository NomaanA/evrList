import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Rx";

/*
 Generated class for the ChecklistModel provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ChecklistModel {

  checklist: any;
  checklistObserver: any;

  constructor(public title:String, public items: any[]) {
    this.items = items;
    this.checklist=  Observable.create(observer => {
      this.checklistObserver = observer;
    })
  }

  addItem(item):void {
    this.items.push({
      title: item,
      checked: false
    });

    this.checklistObserver.next(true);
  }
  renameItem(item, title: void) {
    let index = this.items.indexOf(item);

    if (index > -1) {
      this.items[index].title = title;
    }

    this.checklistObserver.next(true);
  }

  setTitle(title):void {
    this.title = title;
    this.checklistObserver.next(true);
  }

  toggleItem(item):void {
    item.check= !item.checked;
    this.checklistObserver.next(true);
  }


  removeItem(item):void {
    let index = this.items.indexOf(item);

    if(index > -1){
      this.items.splice(index, 1 );
    }

    this.checklistObserver.next(true);
  }
}

