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

import { Token } from "./interface";

export enum ConnectionType {
    powerbi = "powerbi",
    asazure = "asazure",
}

export interface Connection {
    dataSource?: string;
    rootUrl?: string;
    database?: string;
    connectionType?: ConnectionType;
    catalog?: string;
    password?: string;
    token?: Token;
    locale: string;
}

export function parse(connectionString: string): Connection | undefined {
    const parts: string[][] = [];
    const rConnectionString: Connection = { locale: "1033" };
    connectionString.split(";").forEach((part) => {
        const split = part.split("=");
        if (split.length === 2) parts.push(split);
    });
    parts.forEach((part) => {
        switch (part[0]) {
            case "Data Source":
                // eslint-disable-next-line no-case-declarations
                const url = new URL(part[1]);
                rConnectionString.dataSource = part[1];
                rConnectionString.rootUrl = url.hostname;
                rConnectionString.database = url.pathname.split("/").reverse()[0];
                rConnectionString.connectionType = url.protocol.replace(":", "") as ConnectionType;
                break;
            case "Catalog":
                rConnectionString.catalog = part[1];
                break;
            case "Password":
                rConnectionString.token = new Token(part[1], "Bearer");
                break;
            case "LocaleIdentifier":
                rConnectionString.locale = part[1];
                break;
        }
    });
    return rConnectionString as Connection;
}
