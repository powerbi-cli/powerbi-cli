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

import { ModuleCommand } from "../lib/command";
import { debug } from "../lib/logging";
import { APICall, executeAPICall } from "../lib/api";
import { getGroupUrl } from "../lib/helpers";
import { validateGroupId, validateReportId } from "../lib/parameters";

export async function cloneAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;
    const groupId = await validateGroupId(options.W, false);
    const reportId = await validateReportId(groupId as string, options.R, true);
    if (options.name === undefined) throw "error: missing option '--name'";
    const name = options.name;
    const targetModelId = options.targetDataset;
    const targetWorkspaceId =
        options.targetGroup === true ? "00000000-0000-0000-0000-000000000000" : options.targetGroup;
    debug(`Clone Power BI report (${reportId}) in group ${groupId}`);
    const request: APICall = {
        method: "POST",
        url: `${getGroupUrl(groupId)}/reports/${reportId}/Clone`,
        body: {
            name,
            targetModelId,
            targetWorkspaceId,
        },
    };
    await executeAPICall(request);
}
