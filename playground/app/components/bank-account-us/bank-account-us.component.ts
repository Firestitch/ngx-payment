import { Component, inject } from '@angular/core';
import { FsMessage } from '@firestitch/message';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsBankAccountComponent } from '../../../../src/app/components/bank-account/bank-account.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'bank-account-us',
    templateUrl: 'bank-account-us.component.html',
    styleUrls: ['bank-account-us.component.scss'],
    standalone: true,
    imports: [FormsModule, FsFormModule, FsBankAccountComponent, MatButton]
})
export class BankAccountUsComponent {
  private message = inject(FsMessage);


  public config = {};

  public changed(event) {
    console.log(event);
  }

  public save() {
    alert("Save");
  }
}
