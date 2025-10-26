import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsBankAccountComponent } from '../../../../src/app/components/bank-account/bank-account.component';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'bank-account',
    templateUrl: './bank-account.component.html',
    styleUrls: ['./bank-account.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsBankAccountComponent,
        MatButton,
    ],
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
