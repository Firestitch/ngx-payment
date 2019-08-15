import { Component } from '@angular/core';
import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'bank-account',
  templateUrl: 'bank-account.component.html',
  styleUrls: ['bank-account.component.scss']
})
export class BankAccountComponent {

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
