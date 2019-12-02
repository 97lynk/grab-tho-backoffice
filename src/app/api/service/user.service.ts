import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/User';
import {Observable} from 'rxjs/internal/Observable';
import {Page} from '../model/Page';
import { environment } from 'src/environments/environment';

const HOST = environment.host_be;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getAccounts(page: number,  accountType: string[]): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${HOST}/accounts?page=${page}&role=${accountType.join(',')}`);
  }

  getAccountById(id: number): Observable<User> {
    return this.http.get<User>(`${HOST}/accounts/${id}`);
  }

  updateProfile(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${HOST}/accounts/${id}`, user);
  }

  blockAccount(id: number): Observable<User> {
    return this.http.put<User>(`${HOST}/accounts/${id}/block`, null);
  }

  unBlockAccount(id: number): Observable<User> {
    return this.http.put<User>(`${HOST}/accounts/${id}/unblock`, null);
  }

  changePassword(id: number, newPassword: string): Observable<User> {
    return this.http.post<User>(`${HOST}/accounts/${id}/password`, null,
      {
        params: {
          password: newPassword,
        }
      });
  }

  registerAccount(account: any) {
    return this.http.post<any>(`${HOST}/accounts`, account);
  }

  uploadAvatar(id: number, avatar: any) {
    return this.http.put(`${HOST}/accounts/${id}/avatar`, avatar);
  }

  uploadImage(avatar: any) {
    return this.http.post(`${HOST}/requests/description-images`, avatar);
  }

  changeRole(id: number, role: string) {
    return this.http.put(`${HOST}/accounts/${id}/role`, [role]);
  }

}
