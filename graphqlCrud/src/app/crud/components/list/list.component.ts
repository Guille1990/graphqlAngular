import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

/**
 * GraphQL tag se utiliza para poder definir las operaciones
 * que queramos realizar en el servicio GraphQL (Querys, Mutation y Subscription)
 */
import gql from 'graphql-tag';

/**
 * Interfas de tipo de dato User
 */
export interface User {
  id: number;
  rut: string;
  name: string;
  lastName: string;
  mail: string;
}

/**
 * Query de consulta de usuarios
 */
const USERS_QUERY = gql`{ users { id, rut, name, lastName, mail } }`;
/**
 * Suscripción a evento userAdded
 */
const USERS_ADDED_SUBSCRIPTION = gql`subscription added { userAdded { id, rut, name, lastName, mail } }`;
/**
 * Suscripción a evento userUpdated
 */
const USERS_UPDATED_SUBSCRIPTION = gql`subscription updated { userUpdated { id, rut, name, lastName, mail } }`;
/**
 * Mutación para eliminar usuario
 */
const USER_DELETED = gql`mutation userDelete($id: Int!) { userDelete(id: $id) { id, rut, name, lastName, mail } }`;
/**
 * Suscripción a evento userDeleted
 */
const USER_DELETED_SUBSCRIPTION = gql`subscription deleted { userDeleted { id, rut, name, lastName, mail } }`;


/**
 * @example
 * <app-list></app-list>
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  public users: User[];
  public dataSource: MatTableDataSource<User>;
  private subscription: Subscription;

  public usersQuery: QueryRef<any>;
  public usersObservable: Observable<any>;

  public displayColumns = [
    'actions',
    'id',
    'rut',
    'name',
    'lastName',
    'mail'
  ];

  /**
   * Injección de dependencias
   * @param apollo
   * @param router
   */
  constructor(
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>([]);

    /**
     * Observable que realiza consulta al servicio GraphQL,
     * utiliza como parámetro la Query escrita en GQL
     */
    this.usersQuery = this.apollo.watchQuery<User[]>({
      query: USERS_QUERY
    });
    this.usersObservable = this.usersQuery.valueChanges;

    /**
     * Realiza petición al servidor para obtener la lista de
     * usuarios
     */
    this.subscription = this.usersObservable.subscribe(
      res => {
        this.setDataTable(res.data['users']);
      }, err => {
        console.log(err);
      });

    /**
     * Llamada a métodos de subscrición
     */
    this.userAddedSubscribeToMore();
    this.userUpdatedSubscribeToMore();
    this.userDeletedSubscribeToMore();
  }

  /**
   * Carga datos en la tabla
   * @param data
   */
  setDataTable (data: User[]) {
    this.dataSource = new MatTableDataSource<User>(data);
  }

  /**
   * Función para pasar al formulario de
   * edición
   * @param user
   */
  edit (user: User) {
    this.router.navigate(['/userupdate', user.id]);
  }

  /**
   * Método para eliminar usuario
   * @param user
   */
  delete (user: User) {
    this.apollo.mutate({
      mutation: USER_DELETED,
      variables: {
        id: user.id
      }
    }).subscribe(res => {
      const data = Object.assign([], this.users);
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  /**
   * Método para suscribirse a evento userAdded
   */
  userAddedSubscribeToMore () {
    this.usersQuery.subscribeToMore({
      document: USERS_ADDED_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const userAdded = subscriptionData.data['userAdded'];

        return { users: [ userAdded, ...prev['users'] ] };
      }
    });
  }

  /**
   * Método para suscribirse a evento userUpdated
   */
  userUpdatedSubscribeToMore () {
    this.usersQuery.subscribeToMore({
      document: USERS_UPDATED_SUBSCRIPTION,
      variables: {}
    });
  }

  /**
   * Método para suscribirse a evento userDeleted
   */
  userDeletedSubscribeToMore () {
    this.usersQuery.subscribeToMore({
      document: USER_DELETED_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const userDeleted = subscriptionData.data['userDeleted'];

        const newData = prev['users'].filter(usr => {
          return usr.id !== userDeleted.id;
        });

        return { users: [ ...newData ] };
      }
    });
  }
}
