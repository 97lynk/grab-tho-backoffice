import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '../model/Action';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../model/Page';
import { Post } from '../model/Post';
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

  private getPostsWithApprove(page: number, approved: boolean): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${HOST}/api/posts/approved/${approved}?page=${page}`);
  }

  getWaitingPosts = (page: number): Observable<Page<Post>> => {
    return this.http.get<Page<Post>>(`${HOST}/api/posts/waiting?page=${page}`);
  };

  getBlockedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, false);
  };

  getApprovedPosts = (page: number): Observable<Page<Post>> => {
    return this.getPostsWithApprove(page, true);
  };


  getAllPostsByUserId = (page: number, userId: number): Observable<Page<Post>> => {
    return this.http.get<Post[]>(`/api/post/user/${userId}`)
      .pipe(map((v: Post[]) => {
        let p = new Page<Post>();
        p.content = v;
        return p;
      }));
  };

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${HOST}/posts/${id}`);
  }

  blockPostById(id: number) {
    return this.http.put(`/api/post/${id}/approve/false`, null);
  }

  approvePostById(id: number) {
    return this.http.put(`/api/post/${id}/approve/true`, null);
  }

  getPostOfUser(id: number, status: string[], page: number): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${HOST}/posts/users/${id}?page=${page}&status=${status.join(',')}`);
  }

  getFeedback(id: number) {
    return this.http.get(`${HOST}/posts/users/${id}/feedback`);
  }
}
