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
import { OutgoingHttpHeaders } from "http";
import { request, RequestOptions } from "https";
import { Readable } from "stream";
import { verbose } from "../logging";

import { ExecuteRequestOptions } from "./interface";

export function executeRequest(executeRequestOptions: ExecuteRequestOptions): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
        if (!executeRequestOptions.headers || !executeRequestOptions.headers["Content-Type"]) {
            executeRequestOptions.headers = Object.assign(
                { "Content-Type": "application/json" },
                executeRequestOptions.headers
            );
        }
        const isJsonRequest = executeRequestOptions.headers["Content-Type"] === "application/json";
        const options: RequestOptions = {
            method: executeRequestOptions.method,
            headers: Object.assign(
                {
                    "Content-Length": executeRequestOptions.body ? executeRequestOptions.body.length : 0,
                },
                executeRequestOptions.headers
            ) as OutgoingHttpHeaders,
        };
        if (executeRequestOptions.token) {
            options.headers = Object.assign(
                { Authorization: executeRequestOptions.token.tokenHeader },
                options.headers
            );
        }
        let data = "";
        const req = request(executeRequestOptions.url, options, (res) => {
            verbose(`Result from XMLA endpoint with status ${res.statusCode}`);
            if (res.statusCode !== 200) {
                reject("Internal error during post request");
                return;
            }
            res.on("error", (err) => {
                reject(`Response: ${err}`);
            });
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", (): void => {
                if (isJsonRequest) resolve(JSON.parse(data));
                else resolve(data);
            });
        });
        req.on("error", (err) => {
            verbose(`Error triggered during XMLA request`);
            reject(`Request: ${err}`);
        });
        if (executeRequestOptions.body) req.write(executeRequestOptions.body);
        req.end();
    });
}

export function executeRequestStream(executeRequestOptions: ExecuteRequestOptions): Promise<Readable> {
    return new Promise<Readable>((resolve, reject) => {
        if (!executeRequestOptions.headers || !executeRequestOptions.headers["Content-Type"]) {
            executeRequestOptions.headers = Object.assign(
                { "Content-Type": "application/json" },
                executeRequestOptions.headers
            );
        }
        const options: RequestOptions = {
            method: executeRequestOptions.method,
            headers: Object.assign(
                {
                    "Content-Length": executeRequestOptions.body ? executeRequestOptions.body.length : 0,
                },
                executeRequestOptions.headers
            ) as OutgoingHttpHeaders,
        };
        if (executeRequestOptions.token) {
            options.headers = Object.assign(
                { Authorization: executeRequestOptions.token.tokenHeader },
                options.headers
            );
        }
        const req = request(executeRequestOptions.url, options, (res) => {
            if (res.statusCode !== 200) {
                reject("Internal error during post request");
                return;
            }
            resolve(res);
        });
        req.on("error", (err) => {
            reject(`Request: ${err}`);
        });
        if (executeRequestOptions.body) req.write(executeRequestOptions.body);
        req.end();
    });
}
