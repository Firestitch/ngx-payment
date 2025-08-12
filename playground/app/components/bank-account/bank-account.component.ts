import { Component } from '@angular/core';


@Component({
  selector: 'bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent {

  public config = {};

  public changed(event) {
    console.log(event);
  }

  public save() {
    alert('Save');
  }
}
