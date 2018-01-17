import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';

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

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  public users: User[];
  public dataSource: MatTableDataSource<User>;
  private subscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    console.log('Entre al onInit');
    this.usersQuery = this.apollo.watchQuery<User[]>({
      query: USERS_QUERY
    });

    this.usersObservable = this.usersQuery.valueChanges;

    this.userAddedSubscribeToMore();
    this.userUpdatedSubscribeToMore();

    this.subscription = this.usersObservable.subscribe(
      res => {
        this.dataSource = new MatTableDataSource<User>(res.data['users']);
        this.dataSource.paginator = this.paginator;
      }, err => {
        console.log(err);
      });
  }

  edit (user: User) {
    this.router.navigate(['/userupdate', user.id]);
  }

  ngOnDestroy () {
    console.log('entre al onDestroy');
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
}
