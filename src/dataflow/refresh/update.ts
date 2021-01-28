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
import { OptionValues } from "commander";

import { ModuleCommand } from "../../lib/command";
import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { getGroupUrl } from "../../lib/helpers";
import { readFileSync } from "fs";
import { validateGroupId, validateDataflowId } from "../../lib/parameters";

export async function updateAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const groupId = await validateGroupId(options.W, true);
    const dataflowId = await validateDataflowId(groupId as string, options.F, true);
    if (options.refreshSchedule === undefined && options.refreshScheduleFile === undefined)
        throw "error: missing option '--refresh-schedule' or '--refresh-schedule-file'";
    const refreshSchedule = options.refreshSchedule || readFileSync(options.refreshScheduleFile);
    debug(`Update the refresch schedule of a Power BI dataflow (${dataflowId}) in workspace (${groupId})`);
    const request: APICall = {
        method: "PATCH",
        url: `${getGroupUrl(groupId)}/dataflows/${dataflowId}/refreshSchedule`,
        body: refreshSchedule,
    };
    await executeAPICall(request);
}
