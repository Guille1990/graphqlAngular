import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import gql from 'graphql-tag';

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
    this.subscription = this.apollo.query({ query: gql`{ users { id, rut, name, lastName, mail } }` })
      .subscribe(
        res => {
          console.log(res.data['users']);
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
}
