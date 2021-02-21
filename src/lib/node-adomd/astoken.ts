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

import { Connection } from "./connectionstring";
import { ASToken, Token, Workspace } from "./interface";
import { executeRequest } from "./request";

function getRequestBody(capacityId: string, workspaceId: string): string {
    return JSON.stringify({
        capacityObjectId: capacityId,
        workspaceObjectId: workspaceId,
    });
}

export async function getAsToken(connection: Connection, workspace: Workspace): Promise<Token> {
    const astoken = (await executeRequest({
        url: `https://${connection.rootUrl}/metadata/v201606/generateastoken`,
        method: "POST",
        token: connection.token as Token,
        body: getRequestBody(workspace.capacityObjectId as string, workspace.id),
    })) as ASToken;
    return new Token(astoken.Token, "MwcToken");
}
