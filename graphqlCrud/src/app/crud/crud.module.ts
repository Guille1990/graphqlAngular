import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { CrudRouterModule } from './crud-router/crud-router.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExportModule } from '../material-export/material-export.module';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2Rut } from 'ng2-rut';
import { SpinnerService } from './services/spinner.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DialogComponent } from './components/dialog/dialog.component';

/**
 * Utilidades de apollo
 */
import { ApolloModule, Apollo } from 'apollo-angular';
/**
 * HttpLinkModule ayuda a hacer consultas de manera sencilla a un servicio GraphQL,
 * Internamente utiliza HttpClient
 */
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

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
    SpinnerComponent,
    DialogComponent
  ],
  entryComponents: [
    SpinnerComponent,
    DialogComponent
  ],
  providers: [
    SpinnerService
  ]
})
export class CrudModule {
  /**
   * Injección de dependencias
   * @param apollo
   * @param httpLink
   *
   * Se deben injectar las dependencias y crear un cliente
   */
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    /**
     * Crea el link para consumir el servicio GraphQL
     */
    const http = httpLink.create({
      uri: 'http://localhost:1234/graphql'
    });

    /**
     * Crea el link de web socket para consumir suscripciones,
     * con la opción de re conexión
     */
    const ws = new WebSocketLink({
      uri: 'ws://localhost:1234/subscriptions',
      options: {
        reconnect: true
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http
    );

    /**
     * Crea cliente para consumir servicio GraphQL
     *
     * InMemoryCache es un store que normaliza los datos antes de guardarlos,
     * creando un identificador único para cada objeto
     */
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
