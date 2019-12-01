import { NbAuthOAuth2JWTToken, NbOAuth2ClientAuthMethod, NbOAuth2GrantType } from '@nebular/auth';
import { NbOAuth2AuthStrategyOptions } from '@nebular/auth/strategies/oauth2/oauth2-strategy.options';
import { HttpRequest } from '@angular/common/http';
import { NbAclOptions } from '@nebular/security';
import { environment } from 'src/environments/environment';

export const authConfig: NbOAuth2AuthStrategyOptions = {
  name: 'userpass',
  baseEndpoint: environment.host_be + '/',
  clientId: 'managementClient',
  clientSecret: '333',
  clientAuthMethod: NbOAuth2ClientAuthMethod.BASIC,
  defaultErrors: ['Login is failed'],
  token: {
    endpoint: 'oauth/token',
    grantType: NbOAuth2GrantType.PASSWORD,
    class: NbAuthOAuth2JWTToken,
    scope: 'read',
    requireValidToken: true
  },
  refresh: {
    endpoint: 'oauth/token',
    grantType: NbOAuth2GrantType.REFRESH_TOKEN,
    requireValidToken: true
  },
  redirect: {
    success: '/',
    failure: '/login'
  }
};

export const formLoginConfig = {
  login: {
    redirectDelay: 0,
    strategy: 'userpass',
    rememberMe: true,
    showMessages: {
      success: true,
      error: true,
    }
  },
  logout: {
    redirect: '/login',
    redirectDelay: 10,
    strategy: 'userpass'
  },
  validation: {
    password: {
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    username: {
      required: true
    }
  }
};

export const aclConfig: NbAclOptions = {
  accessControl: {
    ROLE_MOD: {
      view: ['list_posts', 'post'],
      edit: ['post']
    },
    ROLE_ADMIN: {
      view: ['list_posts', 'post', 'list_users', 'user'],
      edit: ['post', 'user'],
    },
  },
};

export function filterRefreshTokenReq(req: HttpRequest<any>) {
  return (req.url.indexOf('oauth/token') >= 0 && req.body != null
    && JSON.stringify(req.body).indexOf('grant_type=') >= 0);
}

export const defaultAvatar = './assets/avatar.svg';
