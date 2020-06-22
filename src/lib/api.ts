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

import { RequestPrepareOptions } from "@azure/ms-rest-js";

import { formatAndPrintOutput, OutputType } from "./output";
import { executeRestCall, executeDownloadCall, executeUploadCall } from "./rest";

export const rootUrl = "https://api.powerbi.com/v1.0/myorg";

export interface APICall extends RequestPrepareOptions {
    containsValue?: boolean;
    uploadFile?: string;
}

export function executeAPICall(
    apiRequest: APICall,
    outputFormat?: OutputType,
    outputFile?: string,
    jmsePath?: string
): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const request: RequestPrepareOptions = {
            method: apiRequest.method,
            headers: apiRequest.headers,
            url: `${rootUrl}${apiRequest.url}`,
            body: apiRequest.body,
        };
        try {
            if (outputFormat === OutputType.raw && outputFile === undefined)
                reject("Downloading files require the option '--output--file'");
            if (outputFormat === OutputType.raw) {
                executeDownloadCall(request, outputFile as string)
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => reject(err));
            }
            if (apiRequest.uploadFile) {
                executeUploadCall(request, apiRequest.uploadFile)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((err) => reject(err));
            } else {
                executeRestCall(request, apiRequest.containsValue as boolean)
                    .then((response) => {
                        formatAndPrintOutput(response, outputFormat, outputFile, jmsePath);
                        resolve();
                    })
                    .catch((err) => reject(err));
            }
        } catch (err) {
            reject(err);
        }
    });
}
