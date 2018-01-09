import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import gql from 'graphql-tag';

const USERS_QUERY = gql`{ users { id, rut, name, lastName, mail } }`;
const USERS_SUBSCRIPTION = gql`subscription test { userAdded { id, rut, name, lastName, mail } }`;

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
  ) {
    this.usersQuery = this.apollo.watchQuery({
      query: USERS_QUERY
    });

    this.usersObservable = this.usersQuery.valueChanges;
  }

  ngOnInit() {
    this.subscribeToMore();

    this.subscription = this.apollo.query({ query: USERS_QUERY })
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource<User>(res.data['users']);
          this.dataSource.paginator = this.paginator;
        }, err => {
          console.log(err);
        });
  }

  edit (user: User) {
    console.log(user);
    localStorage.setItem('userEdit', JSON.stringify(user));
    this.router.navigate(['/edit']);
  }

  ngOnDestroy () {
    console.log('entre al onDestroy');
    this.subscription.unsubscribe();
  }

  subscribeToMore () {
    this.usersQuery.subscribeToMore({
      document: USERS_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        console.log(prev, subscriptionData);
        if (!subscriptionData.data) {
          return prev;
        }

        const userAdded = subscriptionData.data['userAdded'];
        return Object.assign({}, prev, { users: [ userAdded, ...prev['users'] ] })
      }
    });
  }
}
