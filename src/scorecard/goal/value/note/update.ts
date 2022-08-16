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

import { debug } from "../../../../lib/logging";
import { APICall, executeAPICall } from "../../../../lib/api";
import { validateGroupId, validateScorecardGoalId, validateScorecardId } from "../../../../lib/parameters";
import { getGroupUrl } from "../../../../lib/helpers";
import { getOptionContent } from "../../../../lib/options";

export async function updateAction(...args: unknown[]): Promise<void> {
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const groupId = await validateGroupId(options.W, false);
    const scorecardId = await validateScorecardId(groupId as string, options.S, true);
    const goalId = await validateScorecardGoalId(groupId as string, scorecardId as string, options.G, true);
    if (options.timestamp === undefined) throw "error: missing option '--timestamp'";
    const timestamp = options.timestamp;
    if (options.note === undefined) throw "error: missing option '--note'";
    const noteId = options.note;
    if (options.text === undefined) throw "error: missing option '--text'";
    const text = getOptionContent(options.text);
    debug(
        `Updates a goal check-in in a Power BI scorecard (${scorecardId}) in workspace (${
            groupId || "my"
        }) with name (${goalId})`
    );
    const request: APICall = {
        method: "PATCH",
        url: `${getGroupUrl(
            groupId
        )}/scorecards(${scorecardId})/goals(${goalId})/goalValues(${timestamp})/notes(${noteId})`,
        body: JSON.parse(`{ "body": "${text}" }`),
    };
    await executeAPICall(request);
}
