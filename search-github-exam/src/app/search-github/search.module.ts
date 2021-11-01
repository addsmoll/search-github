import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SearchGithubComponent } from './github/search-github.component';
import {Route, RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import { ItemRepoComponent } from './item-repo/item-repo.component';
import {MatRippleModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FlexModule} from "@angular/flex-layout";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

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
    MatButtonModule,
    MatRippleModule,
    MatProgressBarModule,
    MatCheckboxModule,
    FlexModule,
    MatProgressSpinnerModule,

  ],
  declarations: [
    SearchGithubComponent,
    ItemRepoComponent,
  ]
})
export class SearchModule { }
