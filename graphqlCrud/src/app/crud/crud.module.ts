import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { CrudRouterModule } from './crud-router/crud-router.module';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { MaterialExportModule } from '../material-export/material-export.module';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2Rut } from 'ng2-rut';
import { SpinnerService } from './services/spinner.service';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    CrudRouterModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
    HttpLinkModule,
    MaterialExportModule,
    ReactiveFormsModule,
    Ng2Rut
  ],
  declarations: [
    ListComponent,
    FormComponent,
    SpinnerComponent
  ],
  entryComponents: [
    SpinnerComponent
  ],
  providers: [
    SpinnerService
  ]
})
export class CrudModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:1234/graphql' }),
      cache: new InMemoryCache()
    });
  }
}
