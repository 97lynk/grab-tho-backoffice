import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '../model/Action';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../model/Page';
import { Post } from '../model/Posts';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const HOST = environment.host_be;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {


  constructor(private http: HttpClient) {
  }

  getHistory(size: number, page: number) {
    return this.http.get(`${HOST}/wallet-histories?size=${size}&page=${page}`);
  }
}
