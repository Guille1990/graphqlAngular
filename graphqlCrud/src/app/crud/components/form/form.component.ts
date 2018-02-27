import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { RutValidator, RutDirective } from 'ng2-rut';
import { SpinnerService } from '../../services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import gql from 'graphql-tag';

/**
 * Query para consultar por todos los usuarios
 */
const USERS_QUERY = gql`{ users { id, rut, name, lastName, mail } }`;

/**
 * Mutación para añadir usuarios
 */
const addUser = gql`
  mutation addUser($user: newUser!) {
    userAdd(user: $user) {
      id
      name
      lastName
    }
  }
`;

/**
 * Mutación para actualizar usuarios
 */
const updateUser = gql`
  mutation updateUser($id: Int!, $user: updateUser) {
    userUpdate(id: $id, user: $user) {
      id
      name
      lastName
    }
  }
`;

/**
 * Query para consultar usuarios por ID
 */
const USER_QUERY = gql`query userQuery ($id: Int!) {
  user (id: $id) {
    id,
    rut,
    name,
    lastName,
    mail
  }
}`;

/**
 * Mensajes de actualización e inserción
 */
const MESSAGE_INSERT = 'Usuario agregado correctamente';
const MESSAGE_UPDATE = 'Usuario actualizado correctamente';

/**
 * @example
 * <app-form></app-form>
 */
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
  public dialogRef: MatDialogRef<DialogComponent>;

  /**
   * Injección de dependencias
   * @param apollo
   * @param rv
   * @param spinnerService
   * @param router
   * @param route
   * @param dialog
   */
  constructor(
    private apollo: Apollo,
    private rv: RutValidator,
    private spinnerService: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    /**
     * Creación de Reactive Forms
     */
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

    /**
     * Captura la id del usuario cuando se va a editar el objeto
     */
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      this.getUser(userId);
    }
  }

  /**
   * Método que realiza inserción o actualización de
   * objeto User
   */
  submit () {
    this.spinnerService.openSpinner();

    /**
     * Se arma objeto que se va a insertar
     */
    this.userAdd = {
      rut: this.form.controls['rutCtrl'].value,
      name: this.form.controls['nameCtrl'].value,
      lastName: this.form.controls['lastNameCtrl'].value,
      mail: this.form.controls['mailCtrl'].value
    };

    const variablesAdd = { user: this.userAdd };

    /**
     * Objeto utilizado para actualizar un usuario
     */
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

    /**
     * Mutación que actualiza o inserta objeto.
     */
    this.apollo.mutate({
      mutation: this.userUpdate ? updateUser : addUser,
      variables: this.userUpdate ? variablesUpdate : variablesAdd,
      refetchQueries: [
        { query: USERS_QUERY }
      ]
    }).subscribe(
      res => {
        this.spinnerService.closeSpinner();
        this.dialogRef = this.dialog.open(DialogComponent, {
          panelClass: 'dialogPanel',
          data: {
            message: this.userUpdate ? MESSAGE_UPDATE : MESSAGE_INSERT
          }
        });

        this.dialogRef
          .afterClosed()
          .toPromise()
          .then(response => {
            this.router.navigateByUrl('/list');
          });
      },
      err => {
        console.log(err);
        this.spinnerService.closeSpinner();
      }
    );
  }

  /**
   * Método utilizado para obtener a un user por la Id
   * @param id
   */
  getUser (id) {
    this.apollo.watchQuery<any>({
      query: USER_QUERY,
      variables: {
        id
      }
    })
    .valueChanges
    .subscribe(({ data }) => {
      this.userUpdate = data.user;
      this.setFormControl(this.userUpdate);
      this.form.controls['rutCtrl'].disable();
    });
  }

  /**
   * Método para setear valores de formulario
   * @param user
   */
  setFormControl (user: User) {
    this.form.controls['rutCtrl'].setValue(user.rut);
    this.form.controls['nameCtrl'].setValue(user.name);
    this.form.controls['lastNameCtrl'].setValue(user.lastName);
    this.form.controls['mailCtrl'].setValue(user.mail);
  }
}
