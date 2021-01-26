import { Component } from '@angular/core';
import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'bank-account-us',
  templateUrl: 'bank-account-us.component.html',
  styleUrls: ['bank-account-us.component.scss']
})
export class BankAccountUsComponent {

  public config = {};

  constructor(private message: FsMessage) {
  }

  public changed(event) {
    console.log(event);
  }

  public save() {
    alert("Save");
  }
}
