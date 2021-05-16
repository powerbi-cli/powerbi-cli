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

import { Cluster, Workspace } from "./interface";
import { executeRequest } from "./request";

function getRequestBody(serverName: string): string {
    return JSON.stringify({
        serverName,
        premiumPublicXmlaEndpoint: true,
    });
}

export async function resolveCluster(workspace: Workspace, requestID: string): Promise<Cluster> {
    const clusterHostname = new URL(workspace.capacityUri as string).hostname;
    return (await executeRequest({
        url: `https://${clusterHostname}/webapi/clusterResolve`,
        method: "POST",
        headers: { "x-ms-parent-activity-id": requestID },
        body: getRequestBody(workspace.capacityObjectId as string),
    })) as Cluster;
}
