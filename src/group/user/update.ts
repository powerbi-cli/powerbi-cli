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

import { ModuleCommand } from "../../lib/command";
import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { principalTypes, accessRights } from "../../lib/helpers";
import { validateParameter, validateAllowedValues, validateGroupId } from "../../lib/parameters";

export async function updateUserAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;

    const groupId = await validateGroupId(options.W, true);
    if (!(options.email || options.identifier)) throw "error: missing option '--email' or '--identifier'";
    const accessRight = await validateParameter({
        name: options.accessRight,
        isName: () => validateAllowedValues(options.accessRight, accessRights),
        missing: "error: missing option '--access-right'",
        isRequired: true,
    });
    const principalType = await validateParameter({
        name: options.principalType,
        isName: () => validateAllowedValues(options.principalType, principalTypes),
        missing: "error: missing option '--principal-type'",
        isRequired: true,
    });
    debug(`Update access of a user or service pricipal to the Power BI workspace: ${options.W}`);
    const request: APICall = {
        method: "PUT",
        url: `/groups/${groupId}/users`,
        body: {
            emailAddress: options.email,
            identifier: options.identifier || options.email,
            groupUserAccessRight: accessRight,
            principalType: principalType,
        },
    };
    await executeAPICall(request);
}
