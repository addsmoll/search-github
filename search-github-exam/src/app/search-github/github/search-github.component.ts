import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinct, filter, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-search-github',
  templateUrl: './search-github.component.html',
  styleUrls: ['./search-github.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchGithubComponent implements OnInit{
  searchTerm: string;
  results$: Observable<GitHubResults>;
  filteredResults$: Subject<any[]> = new Subject();
  latestSearch$: Subject<string> = new Subject();
  isLoadData: boolean = false;
  resultsData: any[] = null;
  filters: FormGroup;

  constructor(private http: HttpClient, fb: FormBuilder) {
    this.filters = fb.group({
      isOnlyPrivate: false,
      isOnlyActive: false,
    });

  }

  ngOnInit(): void {
    this.results$ = this.latestSearch$
    .pipe(
      debounceTime(500),
      filter(searchTerm => !!searchTerm),
      distinct(),
      switchMap(searchTerm =>
        this.http.get<GitHubResults>(`https://api.github.com/search/repositories?q=${searchTerm}`)
      )
    );

    this.results$
      .subscribe((res) => {
        this.isLoadData = false;
        this.resultsData = res.items;
        this.filteredResults$.next(res.items);
      });

    this.filters.valueChanges.subscribe((res) => {
      this.filterFunc(res);
    })
  }

  searchTermChanged(searchTerm: string): void {
    this.isLoadData = true;
    this.latestSearch$.next(searchTerm);
  }

  filterFunc(param: {isOnlyPrivate: boolean, isOnlyActived: boolean}): void {
    let data = this.resultsData;
    if(param.isOnlyPrivate) data = data.filter((f) => f.private === param.isOnlyPrivate);
    if(param.isOnlyActived) data = data.filter((f) => f.archived !== param.isOnlyActived);
    this.filteredResults$.next(data);
  }
}

interface GitHubResults {
  incomplete_results: boolean;
  items: any[];
  total_count: number;
}
