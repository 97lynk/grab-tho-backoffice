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
export class PostService {


  constructor(private http: HttpClient) {
  }

  getPost(status: string[], page: number) {
    return this.http.get<Page<Post>>(`${HOST}/posts?page=${page}&status=${status.join(',')}`);
  }

  getPostRecent = (page: number) => {
    return this.getPost(['POSTED', 'RECEIVED', 'QUOTED'], page);
  }

  getPostAccept = (page: number) => {
    return this.getPost(['ACCEPTED', 'WAITING'], page);
  }

  getPostComplete = (page: number) => {
    return this.getPost(['COMPLETED', 'FEEDBACK', 'CLOSED'], page);
  }

  getAllPosts = (page: number): Observable<Page<Post>> => {
    return this.getPost(['POSTED', 'RECEIVED', 'QUOTED', 'ACCEPTED', 'WAITING', 'COMPLETED', 'FEEDBACK', 'CLOSED'], page);
  };

  getActions(isRepairer: boolean, userId: number, status: string[], page: number): Observable<Page<any>> {
    return this.http.get<Page<Action>>(`${HOST}/posts/users/${userId}/histories?page=${page}&action=${status.join(',')}&repairer=${isRepairer}`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${HOST}/posts/${id}`);
  }

  getPostOfUser(id: number, status: string[], page: number): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${HOST}/posts/users/${id}?page=${page}&status=${status.join(',')}`);
  }

  getFeedback(id: number) {
    return this.http.get(`${HOST}/posts/users/${id}/feedback`);
  }

  getComments(id: number, action: string[]) {
    return this.http.get(`${HOST}/requests/${id}/histories/repairers?actions=${action.join(',')}`);
  }

  updateComment(id: number, hide: boolean) {
    return this.http.put(`${HOST}/histories/${id}?hide=${hide}`, {});
  }
}
