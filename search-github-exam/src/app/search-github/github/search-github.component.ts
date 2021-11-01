import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { switchMap, debounceTime, filter, distinct } from 'rxjs/operators';

@Component({
  selector: 'app-search-github',
  templateUrl: './search-github.component.html',
  styleUrls: ['./search-github.component.scss']
})
export class SearchGithubComponent {
  searchTerm: string;
  results$: Observable<GitHubResults>;
  latestSearch$: Subject<string> = new Subject();

  constructor(private http: HttpClient) {
    this.results$ = this.latestSearch$
      .pipe(
        debounceTime(500),
        filter(searchTerm => !!searchTerm),
        distinct(),
        switchMap(searchTerm =>
          this.http.get<GitHubResults>(`https://api.github.com/search/repositories?q=${searchTerm}`)
        )
      );
  }

  searchTermChanged(searchTerm: string): void {
    this.latestSearch$.next(searchTerm);
  }
}

interface GitHubResults {
  incomplete_results: boolean;
  items: any[];
  total_count: number;
}
