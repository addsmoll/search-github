import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SearchGithubComponent } from './github/search-github.component';
import {Route, RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";

export const routes: Route[] = [
  {
    path     : '',
    component: SearchGithubComponent,

  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  declarations: [
    SearchGithubComponent,
  ]
})
export class SearchModule { }
