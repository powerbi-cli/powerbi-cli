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

import { TokenCredentials, RequestPrepareOptions, HttpOperationResponse } from "@azure/ms-rest-js";
import { AzureServiceClient } from "@azure/ms-rest-azure-js";
import { createWriteStream, unlink, readFileSync } from "fs";
import https from "https";
import FormData from "form-data";

import { getAccessToken } from "./token";
import { debug } from "./logging";
import { TokenType } from "./auth";

const silentMethods: string[] = ["DELETE", "PUT", "POST", "PATCH"];

export function executeRestCall(request: RequestPrepareOptions, containsValue: boolean): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
        getAccessToken(TokenType.POWERBI).then((token) => {
            if (token === "") {
                reject("Not authenticated. Please run 'pbicli login' to login to Power BI.");
                return;
            }
            const creds = new TokenCredentials(token);
            try {
                const client = new AzureServiceClient(creds);
                client
                    .sendRequest(request)
                    .then((response: HttpOperationResponse) => {
                        if (response.status === 401) {
                            reject("Not authenticated. Please run 'pbicli login' to login to Power BI.");
                        } else if (response.status === 403) {
                            reject(
                                "Authorisation error. Please validate the API rights of the user / service principal."
                            );
                        } else if (silentMethods.some((silentMethod: string) => silentMethod === request.method)) {
                            //if (response.status === 202 && request.method === "POST")
                            if (response.parsedBody) resolve(JSON.parse(JSON.stringify(response.parsedBody)));
                            else resolve(undefined);
                        } else if (response.status === 404) {
                            resolve([]);
                        } else if (response.status === 200) {
                            const body = JSON.parse(JSON.stringify(response.parsedBody));
                            const content = containsValue ? body.value : body;
                            const callNextLink = async (link?: string) => {
                                if (!link) return;
                                const nextRequest = request;
                                nextRequest.url = link;
                                const nextResponse = await executeNextLink(client, nextRequest);
                                const nextBody = JSON.parse(JSON.stringify(nextResponse.parsedBody));
                                content.concat(nextBody.value);
                                callNextLink(nextBody["@odata.nextLink"]);
                            };
                            callNextLink(body["@odata.nextLink"]);
                            resolve(content);
                        } else {
                            reject(
                                `Error while calling the Power BI REST API: ${response.status} (${response.bodyAsText})`
                            );
                        }
                    })
                    .catch((err) => reject(err));
            } catch (err) {
                reject(err);
            }
        });
    });
}

export function executeDownloadCall(request: RequestPrepareOptions, outputFile: string): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
        getAccessToken(TokenType.POWERBI).then((token) => {
            if (token === "") {
                reject("Not authenticated. Please run 'pbicli login' to login to Power BI.");
                return;
            }
            try {
                const options: https.RequestOptions = {
                    headers: { authorization: `Bearer ${token}` },
                };
                const file = createWriteStream(outputFile);
                const req = https.get(request.url as string, options, (response) => {
                    if (response.statusCode === 404) {
                        reject("Download this report is not supported");
                        return;
                    }
                    if (response.statusCode !== 200) {
                        reject("Error downloading the report");
                        return;
                    }
                    response.pipe(file);
                });
                file.on("finish", () => resolve(undefined));
                req.on("error", (err) => {
                    unlink(outputFile, () => reject(`Error while calling the Power BI REST API: ${err}`));
                });
                req.end();
            } catch (err) {
                reject(err);
            }
        });
    });
}

export function executeUploadCall(request: RequestPrepareOptions, inputFile: string): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
        getAccessToken(TokenType.POWERBI).then((token) => {
            if (token === "") {
                reject("Not authenticated. Please run 'pbicli login' to login to Power BI.");
                return;
            }
            try {
                const form = new FormData();
                form.append("file0", readFileSync(inputFile));
                const url = new URL(request.url as string);
                const options = {
                    method: "POST",
                    host: url.host,
                    path: url.pathname + url.search,
                    headers: Object.assign(
                        { authorization: `Bearer ${token}`, "Content-Length": form.getLengthSync() },
                        form.getHeaders()
                    ),
                };
                const req = https.request(options);
                form.pipe(req);
                req.on("response", (response) => {
                    if (response.statusCode !== 200 && response.statusCode !== 202) {
                        debug(response.headers["x-powerbi-error-details"] as string);
                        reject("Error uploading the report");
                        return;
                    }
                    resolve(undefined);
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function executeNextLink(client: AzureServiceClient, request: RequestPrepareOptions): Promise<HttpOperationResponse> {
    return new Promise<HttpOperationResponse>((resolve, reject) => {
        client
            .sendRequest(request)
            .then((response: HttpOperationResponse) => {
                resolve(response);
            })
            .catch(() => reject());
    });
}
