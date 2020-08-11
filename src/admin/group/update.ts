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

import { readFileSync } from "fs";

import { ModuleCommand } from "../../lib/command";
import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { validateAdminGroupId } from "../../lib/parameters";
import { checkUUID } from "../../lib/validate";

export async function updateAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;
    let groupId;
    const groupLookup = await validateAdminGroupId(options.G, true, false);
    if (checkUUID(groupLookup as string)) {
        groupId = groupLookup;
    } else {
        groupId = options.G;
    }
    if (options.updateDetails === undefined && options.updateDetailsFile === undefined)
        throw "error: missing option '--update-details' or '--update-details-file'";
    const body = options.updateDetails || readFileSync(options.updateDetailsFile);
    debug(`Updates the specified workspace properties`);
    const request: APICall = {
        method: "PATCH",
        url: `/admin/groups/${groupId}`,
        body,
        containsValue: false,
    };
    await executeAPICall(request, cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}
