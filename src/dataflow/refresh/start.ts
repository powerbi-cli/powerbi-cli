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

import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { getGroupUrl, refreshNotify } from "../../lib/helpers";
import { validateGroupId, validateDataflowId, validateParameter, validateAllowedValues } from "../../lib/parameters";

export async function startAction(...args: unknown[]): Promise<void> {
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const groupId = await validateGroupId(options.W, true);
    const dataflowId = await validateDataflowId(groupId as string, options.F, true);

    const notify =
        (await validateParameter({
            name: options.notify,
            isName: () => validateAllowedValues(options.notify, refreshNotify),
            missing: "error: missing option '--notify'",
            isRequired: false,
        })) || "MailOnFailure";

    const notifyOption =
        notify === "always" ? "MailOnCompletion" : notify === "none" ? "NoNotification" : "MailOnFailure";

    debug(`Start a refresh of a Power BI dataflow (${dataflowId}) in workspace (${groupId})`);
    const request: APICall = {
        method: "POST",
        url: `${getGroupUrl(groupId)}/dataflows/${dataflowId}/refreshes`,
        body: {
            notifyOption: notifyOption,
        },
    };
    await executeAPICall(request);
}
