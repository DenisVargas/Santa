/*
  Santa.ts

  Developer: Denis Vargas Rivero
  Version: 1.0.0
  Description: This script provides a Cookies manager utility for handling browser cookies for your front-end.
  @mail:denis.vargasrivero@outlook.com

  Usage:
  - Include this script in your HTML file using a <script> tag.
  - Create an instance of the `Cookies` class to manage cookies.

  Example:
  const cookieManager = new Cookies();
  cookieManager.set('cookieName', 'cookieValue');

  Note: This script requires JavaScript ES6 or higher.

  ---

  MIT License
  (c) 2023 Denis Vargas Rivero
  See LICENSE file for details.
*/

/**
 * Represents a cookie as a string with its properties.
 * @interface CookieString
 */
interface CookieString {
    /**
     * The name of the cookie.
     * @member {string} CookieString#name
     */
    name: string;
    /**
     * The value of the cookie.
     * @member {string} CookieString#value
     */
    value: string;
    /**
     * The expiration date of the cookie, or undefined if not set.
     * @member {Date | undefined} CookieString#expires
     */
    expires: Date | undefined;
    /**
     * The path of the cookie, or undefined if not set.
     * @member {string | undefined} CookieString#path
     */
    path: string | undefined;
    /**
     * The domain of the cookie, or undefined if not set.
     * @member {string | undefined} CookieString#domain
     */
    domain: string | undefined;
    /**
     * Indicates if the cookie should only be sent over secure connections, or undefined if not set.
     * @member {boolean | undefined} CookieString#secure
     */
    secure: boolean | undefined;
}

/**
 * Represents a Cookie.
 * @class Cookie
 * @implements {CookieString}
 */
class Cookie implements CookieString {
    name: string;
    value: string;
    expires: Date | undefined;
    path: string | undefined;
    domain: string | undefined;
    secure: boolean | undefined;
    constructor(){
        this.name = '';
        this.value = '';
        this.secure = false;
        this.expires = undefined;
        this.path = undefined;
        this.domain = undefined;
    }
    toString(): string {
        let cookieString: string = `${this.name}=${this.value}`;
        cookieString += this.expires? `; expires=${this.expires}`: '';
        cookieString += this.path ? `; path=${this.path}` : '';
        cookieString += this.domain ? `; domain=${this.domain}`: '';
        cookieString += this.secure ? `; secure=${this.secure}`: '';
        return cookieString;
    }
}

/**
 * Represents a Cookies manager.
 * @class Cookies
 */
class Cookies {
    cookies: Cookie[];

     /**
     * Creates an instance of Cookies and parses the document's cookies.
     * @constructor
     */
    constructor() {
        this.cookies = Cookies.parse(document.cookie);
    }

    /**
     * Parses the given cookie string and returns an array of cookies.
     * @param cookies - The cookie string to parse.
     * @returns An array of parsed cookies.
     */
    static parse(cookies:string): Array<Cookie> {
        const cookieParts: string[] = cookies.split(';');
        const Cookies: Cookie[] = [];
        let currentCookie: Cookie = new Cookie();

        for (let part of cookieParts) {
            const keyvalue = part.split('=');
            const key = keyvalue[0].trim();
            const value = keyvalue[1] ? keyvalue[1].trim() : '';

            if (key === 'expires') {
                currentCookie.expires = value.match(/\W{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \w+$/g) ? new Date(value) : undefined;
                continue;
            }

            if(key === 'domain') {
                currentCookie.domain = value;
                continue;
            }

            if(key === 'path') {
                currentCookie.path = value.match(/^\/([a-z0-9-._~%!$&'()*+,;=:@\/]*)?$/i) ? value : undefined;
                continue;
            }

            if(key === 'secure') {
                currentCookie.secure = true;
                continue;
            }

            if (currentCookie.name !== '') {
                Cookies.push(currentCookie);
                currentCookie = new Cookie();
            }
        }

        return Cookies;
    }

    /**
     * Retrieves the value of the cookie with the specified name.
     * @param name - The name of the cookie to retrieve.
     * @returns The value of the cookie, or undefined if not found.
     */
    get(name: string): string | undefined {
        if (this.has(name)) {
            return this.cookies.find(cookie => cookie.name === name)?.value;
        }
        return undefined;
    }

    /**
     * Sets a cookie with the specified name, value, and optional attributes.
     * @param name - The name of the cookie.
     * @param value - The value of the cookie.
     * @param expires - Optional. The expiration date of the cookie.
     * @param path - Optional. The path of the cookie.
     * @param domain - Optional. The domain of the cookie.
     * @param secure - Optional. Indicates if the cookie should only be sent over secure connections.
     * @returns True if the cookie was successfully set, false otherwise.
     */
    set(name: string, value: string, expires?: Date, path?: string, domain?: string, secure?: boolean): boolean {
        //If the cookie already exists, update it
        if (this.has(name)) {
            const cookie: Cookie | undefined = this.cookies.find(cookie => cookie.name === name);
            if (cookie) {
                cookie.value = value;
                cookie.expires = expires;
                cookie.path = path;
                cookie.domain = domain;
                cookie.secure = secure ? true : false;
                document.cookie = cookie.toString();
            }
            return true;
        }

        //If the cookie doesn't exist, create it
        const cookie: Cookie = new Cookie();
        cookie.name = name;
        cookie.value = value;
        cookie.expires = expires;
        cookie.path = path;
        cookie.domain = domain;
        cookie.secure = secure ? true : false;
        this.cookies.push(cookie);
        document.cookie = cookie.toString();
        return false;
    }

    /**
     * Removes the cookie with the specified name.
     * @param name - The name of the cookie to remove.
     * @returns True if the cookie was successfully removed, false otherwise.
     */
    remove(name: string): boolean {
        if (this.has(name)) {
            const cookie: Cookie | undefined = this.cookies.find(cookie => cookie.name === name);
            if (cookie) {
                cookie.value = '';
                cookie.expires = new Date(0);
                document.cookie = cookie.toString();
            }
            return true;
        }
        //The cookie doesn't exist, cant remove it
        return false;
    }

    /**
     * Clears all cookies.
     * @returns True if any cookies were cleared, false if there were no cookies to clear.
     */
    clear(): boolean {
        if (this.cookies.length > 0) {
            for (let cookie of this.cookies) {
                cookie.value = '';
                cookie.expires = new Date(0);
                document.cookie = cookie.toString();
            }
            return true;
        }
        //There are no cookies to clear
        return false;
    }

    /**
     * Checks if a cookie with the specified name exists.
     * @param name - The name of the cookie to check.
     * @returns True if the cookie exists, false otherwise.
     */
    has(name: string): boolean {
        return name in this.cookies;
    }

    /**
     * Returns an array of all cookie names.
     * @returns An array of cookie names as strings.
     */
    keys(): string[] {
        return this.cookies.map(cookie => cookie.name);
    }
}

module.exports = {
    Cookies,
    Cookie
}