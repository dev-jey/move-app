// All of the code contained in this file is not the work of Tembea or any Andela developer for that matter.
// We had issues using the ngx-cookie-service package from npm with jest, and had to pull the code directly for use.
// Please find the original source here https://github.com/7leads/ngx-cookie-service/blob/master/lib/cookie-service/cookie.service.ts

// Copyright (c) 2017 7leads GmbH


// This service is based on the `ng2-cookies` package which sadly is not a service and does
// not use `DOCUMENT` injection and therefore doesn't work well with AoT production builds.
// Package: https://github.com/BCJTI/ng2-cookies

import { Injectable, Inject, PLATFORM_ID, InjectionToken } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable()
export class CookieService {
  private readonly documentIsAccessible: boolean;

  constructor(
    // The type `Document` may not be used here. Although a fix is on its way,
    // we will go with `any` for now to support Angular 2.4.x projects.
    // Issue: https://github.com/angular/angular/issues/12631
    // Fix: https://github.com/angular/angular/pull/14894
    @Inject(DOCUMENT) private document: any,
    // Get the `PLATFORM_ID` so we can check if we're in a browser.
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  /**
   * @param name Cookie name
   * @returns true if the cookie exists
   */
  check(name: string): boolean {
    if (!this.documentIsAccessible) {
      return false;
    }

    name = encodeURIComponent(name);

    const regExp: RegExp = this.getCookieRegExp(name);
    const exists: boolean = regExp.test(this.document.cookie);

    return exists;
  }

  /**
   * @param name Cookie name
   * @returns returns decoded uri from the cookie
   */
  get(name: string): string {
    if (this.documentIsAccessible && this.check(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = this.getCookieRegExp(name);
      const result: RegExpExecArray = regExp.exec(this.document.cookie);

      return decodeURIComponent(result[1]);
    } else {
      return '';
    }
  }

  /**
   * @returns all stored cookies
   */
  getAll(): {} {
    if (!this.documentIsAccessible) {
      return {};
    }

    const cookies: {} = {};
    const document: any = this.document;

    if (document.cookie && document.cookie !== '') {
      const split: Array<string> = document.cookie.split(';');

      for (let i = 0; i < split.length; i += 1) {
        const currentCookie: Array<string> = split[i].split('=');

        currentCookie[0] = currentCookie[0].replace(/^ /, '');
        cookies[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
      }
    }

    return cookies;
  }

  /**
   * @param name     Cookie name
   * @param value    Cookie value
   * @param expires  Number of days until the cookies expires or an actual `Date`
   * @param path     Cookie path
   * @param domain   Cookie domain
   * @param secure   Secure flag
   * @param sameSite OWASP samesite token `Lax` or `Strict`
   */
  set(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: 'Lax' | 'Strict'
  ): void {
    if (!this.documentIsAccessible) {
      return;
    }

    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (expires) {
      if (typeof expires === 'number') {
        const dateExpires: Date = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);

        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + expires.toUTCString() + ';';
      }
    }

    cookieString += this.addPath(path);
    cookieString += this.addDomain(domain);
    cookieString += this.addSecure(secure);
    cookieString += this.addSameSite(sameSite);

    this.document.cookie = cookieString;
  }

  addPath(path) {
    if (path) {
      return 'path=' + path + ';';
    }
    return '';
  }

  addDomain(domain) {
    if (domain) {
      return 'domain=' + domain + ';';
    }
    return '';
  }

  addSecure(secure) {
    if (secure) {
      return 'secure;';
    }
    return '';
  }

  addSameSite(sameSite) {
    if (sameSite) {
      return 'sameSite=' + sameSite + ';';
    }
    return '';
  }

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name: string, path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }

    this.set(name, '', new Date('Thu, 01 Jan 1970 00:00:01 GMT'), path, domain);
  }

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path?: string, domain?: string): void {
    if (!this.documentIsAccessible) {
      return;
    }

    const cookies: any = this.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain);
      }
    }
  }

  /**
   * @param name Cookie name
   * @returns regex for the validating cookie name
   */
  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');

    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }
}
