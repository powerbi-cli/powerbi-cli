/*
 * Copyright (c) 2020 Jan Pieter Posthuma / DataScenarios
 *
 * All rights reserved.
 *
 * MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

export class Token {
    token: string;
    authorizationScheme: string;

    constructor(token: string, authorizationScheme: string) {
        this.token = token;
        this.authorizationScheme = authorizationScheme;
    }

    get tokenHeader(): string {
        return `${this.authorizationScheme} ${this.token}`;
    }
}

export interface ASToken {
    Token: string;
}

export interface Workspace {
    id: string;
    name: string;
    type: string;
    capacitySku: string;
    capacityObjectId: string | null;
    capacityUri: string | null;
}

export interface Cluster {
    clusterFQDN: string;
    coreServerName: string;
}

export interface ExecuteRequestOptions {
    url: string;
    method: string;
    token?: Token;
    headers?: { [key: string]: unknown };
    body?: string;
}

export interface Row {
    [key: string]: unknown;
}

export interface Schema {
    friendlyName: string;
    columnName: string;
    dataType: string;
}
