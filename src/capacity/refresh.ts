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

import { stringify, ParsedUrlQueryInput } from "querystring";

import { ModuleCommand } from "../lib/command";
import { debug } from "../lib/logging";
import { APICall, executeAPICall } from "../lib/api";
import { validateAllowedValues, validateCapacityId } from "../lib/parameters";
import { expandRefreshes } from "../lib/helpers";

export async function refreshAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;
    const capacityId = await validateCapacityId(options.C, false);
    const refreshableId = options.refreshableId;
    const filter = options.filter;
    const expand = options.expand;
    const top = Number.parseInt(options.top) || 5000;
    const skip = Number.parseInt(options.skip) || 0;
    const query: ParsedUrlQueryInput = refreshableId ? {} : { $top: top, $skip: skip };
    if (expand)
        query["$expand"] = (await validateAllowedValues(expand, expandRefreshes, true)).replace("workspace", "group"); // Only groups is supported at this time by API
    if (filter && refreshableId) query["$filter"] = filter;
    debug(`Returns a list of refreshables for all capacities of which the user has access to`);
    const request: APICall = {
        method: "GET",
        url: `/capacities${capacityId ? "/" + capacityId : ""}/refreshables${
            refreshableId ? "/" + refreshableId : ""
        }?${stringify(query)}`,
        containsValue: true,
    };
    await executeAPICall(request, cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}
