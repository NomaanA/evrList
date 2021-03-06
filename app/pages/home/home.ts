import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {ChecklistPage} from '../checklist/checklist';
import {ChecklistModel} from '../../providers/checklist-model/checklist-model';
import {Data} from '../../providers/data/data';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  checklists: ChecklistModel[] = [];

  constructor(public nav: NavController, public dataService: Data, public alertCtrl: AlertController) {
    this.dataService.getData().then((checklists) => {
      let saveChecklists: any = false;
      if(typeof checklists != "undefined") {
        saveChecklists = JSON.parse(checklists);
      }

      if(saveChecklists){
        saveChecklists.forEach((saveChecklist) => {
          let loadChecklist = new ChecklistModel(saveChecklist.title, saveChecklist.items);
          this.checklists.push(loadChecklist);
          loadChecklist.checklist.subscribe(update => {
            this.save();

          })
        });
      }
    });
  }

  addChecklist(): void {
    console.log(this.checklists);
    let prompt = this.alertCtrl.create({
      title: "New Checklist",
      message: "Enter the name of your new checklist",
      inputs: [
        {
          name: 'name',
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let newChecklist = new ChecklistModel(data.name, []);
            this.checklists.push(newChecklist);

            newChecklist.checklist.subscribe(update => {
              this.save();
            });

            this.save();
          }
        }
      ]
    });
    prompt.present();
  }

  renameChecklist(checklist): void {
    let prompt = this.alertCtrl.create({
      title: "Rename Checklist",
      message: "Enter the new name of your new checklist",
      inputs: [
        {
          name: 'name',
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let index = this.checklists.indexOf(checklist);
            if (index > -1) {
              this.checklists[index].setTitle(data.name);
              this.save();
            }
            prompt.present();
          }
        }
      ]
    });
    prompt.present();
  }

  viewChecklist(checklist): void {
    this.nav.push(ChecklistPage, {
      checklist: checklist
    });
  }

  removeChecklist(checklist): void {
    let index = this.checklists.indexOf(checklist);

    if (index > -1) {
      this.checklists.splice(index, 1);
    }
    this.save();
  }

  save(): void {
    this.dataService.save(this.checklists);
  }
}
