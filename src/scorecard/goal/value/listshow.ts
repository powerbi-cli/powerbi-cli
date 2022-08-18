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
import { stringify, ParsedUrlQueryInput } from "querystring";

import { ModuleCommand } from "../../../lib/command";
import { debug } from "../../../lib/logging";
import { APICall, executeAPICall } from "../../../lib/api";
import {
    validateGroupId,
    validateScorecardId,
    validateScorecardGoalId,
    validateAllowedValues,
} from "../../../lib/parameters";
import { getGroupUrl } from "../../../lib/helpers";

export const expandGoalValue: string[] = ["notes"];

export async function listshowAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const groupId = await validateGroupId(options.W, false);
    const scorecardId = await validateScorecardId(groupId as string, options.S, true);
    const goalId = await validateScorecardGoalId(groupId as string, scorecardId as string, options.G, true);
    const timestamp = options.timestamp;
    const expand = options.expand;

    const query: ParsedUrlQueryInput = {};
    if (expand) query["$expand"] = await validateAllowedValues(expand, expandGoalValue, true);
    debug(`Retrieves goal (${goalId}) value check-ins of scorecard (${scorecardId}) in (${groupId})`);
    const request: APICall = {
        method: "GET",
        url: `${getGroupUrl(groupId)}/scorecards(${scorecardId})/goals(${goalId})/goalValues${
            timestamp ? `(${timestamp})` : ""
        }?${stringify(query)}`,
    };
    debug(`Retrieve Power BI scorecard (${scorecardId})`);
    await executeAPICall(request, cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}