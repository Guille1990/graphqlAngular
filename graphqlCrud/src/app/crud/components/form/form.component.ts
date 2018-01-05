import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { RutValidator, RutDirective } from 'ng2-rut';
import { SpinnerService } from '../../services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import gql from 'graphql-tag';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [
    RutDirective
  ]
})
export class FormComponent implements OnInit {

  public form: FormGroup;
  public userAdd: User;
  public userUpdate: User;

  constructor(
    private apollo: Apollo,
    private rv: RutValidator,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      rutCtrl: new FormControl('', [
        Validators.required
      ]),
      nameCtrl: new FormControl('', [
        Validators.required
      ]),
      lastNameCtrl: new FormControl('', [
        Validators.required
      ]),
      mailCtrl: new FormControl('', [
        Validators.required
      ])
    });

    this.userUpdate = JSON.parse(localStorage.getItem('userEdit'));

    if (this.userUpdate) {
      this.setFormControl(this.userUpdate);
      this.form.controls['rutCtrl'].disable();
    }

    localStorage.removeItem('userEdit');
  }

  submit () {
    this.spinnerService.openSpinner();
    this.userAdd = {
      rut: this.form.controls['rutCtrl'].value,
      name: this.form.controls['nameCtrl'].value,
      lastName: this.form.controls['lastNameCtrl'].value,
      mail: this.form.controls['mailCtrl'].value
    };

    const addUser = gql`
      mutation addUser($user: newUser!) {
        userAdd(user: $user) {
          id
          name
          lastName
        }
      }
    `;

    const updateUser = gql`
      mutation updateUser($id: Int!, $user: updateUser) {
        userUpdate(id: $id, user: $user) {
          id
          name
          lastName
        }
      }
    `;

    const variablesAdd = { user: this.userAdd };
    let variablesUpdate;

    if (this.userUpdate) {
      variablesUpdate = {
        id: this.userUpdate.id,
        user: {
          name: this.form.controls['nameCtrl'].value,
          lastName: this.form.controls['lastNameCtrl'].value,
          mail: this.form.controls['mailCtrl'].value
        }
      };
    }

    this.apollo.mutate({
      mutation: this.userUpdate ? updateUser : addUser,
      variables: this.userUpdate ? variablesUpdate : variablesAdd
    }).subscribe(
      res => {
        this.spinnerService.closeSpinner();
        this.router.navigate(['/list']);
      },
      err => {
        console.log(err);
        this.spinnerService.closeSpinner();
      }
    );
  }

  setFormControl (user: User) {
    this.form.controls['rutCtrl'].setValue(user.rut);
    this.form.controls['nameCtrl'].setValue(user.name);
    this.form.controls['lastNameCtrl'].setValue(user.lastName);
    this.form.controls['mailCtrl'].setValue(user.mail);
  }

}
