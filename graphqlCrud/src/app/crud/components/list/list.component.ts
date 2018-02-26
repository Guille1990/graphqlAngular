import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';
import { variable } from '@angular/compiler/src/output/output_ast';

export interface User {
  id: number;
  rut: string;
  name: string;
  lastName: string;
  mail: string;
}

const USERS_QUERY = gql`{ users { id, rut, name, lastName, mail } }`;
const USERS_ADDED_SUBSCRIPTION = gql`subscription added { userAdded { id, rut, name, lastName, mail } }`;
const USERS_UPDATED_SUBSCRIPTION = gql`subscription updated { userUpdated { id, rut, name, lastName, mail } }`;
const USER_DELETED = gql`mutation userDelete($id: Int!) { userDelete(id: $id) { id, rut, name, lastName, mail } }`;
const USER_DELETED_SUBSCRIPTION = gql`subscription deleted { userDeleted { id, rut, name, lastName, mail } }`;

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

  constructor(
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>([]);
    this.dataSource.paginator = this.paginator;

    this.usersQuery = this.apollo.watchQuery<User[]>({
      query: USERS_QUERY
    });

    this.usersObservable = this.usersQuery.valueChanges;

    this.userAddedSubscribeToMore();
    this.userUpdatedSubscribeToMore();
    this.userDeletedSubscribeToMore();

    this.subscription = this.usersObservable.subscribe(
      res => {
        this.setDataTable(res.data['users']);
      }, err => {
        console.log(err);
      });
  }

  setDataTable (data: User[]) {
    this.dataSource = new MatTableDataSource<User>(data);
  }

  edit (user: User) {
    this.router.navigate(['/userupdate', user.id]);
  }

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

  userUpdatedSubscribeToMore () {
    this.usersQuery.subscribeToMore({
      document: USERS_UPDATED_SUBSCRIPTION,
      variables: {}
    });
  }

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
