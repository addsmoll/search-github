import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinct, filter, switchMap, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-search-github',
  templateUrl: './search-github.component.html',
  styleUrls: ['./search-github.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchGithubComponent implements OnInit, OnDestroy{
  searchTerm: string;
  results$: Observable<GitHubResults>;
  filteredResults$: Subject<any[]> = new Subject();
  latestSearch$: Subject<string> = new Subject();
  isLoadData: boolean = false;
  resultsData: any[] = null;
  filters: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private http: HttpClient, fb: FormBuilder) {
    this.filters = fb.group({
      isOnlyPrivate: false,
      isOnlyLanguage: false,
    });

    this._unsubscribeAll = new Subject();
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
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.isLoadData = false;
        this.resultsData = res.items;
        this.filteredResults$.next(res.items);
      });

    this.filters.get('isOnlyPrivate').valueChanges.subscribe((res) => {
      let data = this.resultsData;
      data = data.filter((f) => f.private === res);
      this.filteredResults$.next(data);
    });

    this.filters.get('isOnlyLanguage').valueChanges.subscribe((res) => {
      let data = this.resultsData;
      if (res) {
        this.filters.get('isOnlyPrivate').setValue(false);
        data = data.filter((f) => f.language === 'JavaScript');
      }
      this.filteredResults$.next(data);
    });
  }

  searchTermChanged(searchTerm: string): void {
    this.isLoadData = true;
    this.latestSearch$.next(searchTerm);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

interface GitHubResults {
  incomplete_results: boolean;
  items: any[];
  total_count: number;
}
