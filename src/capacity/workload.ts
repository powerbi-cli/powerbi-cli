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

import { ModuleCommand } from "../lib/command";
import { debug } from "../lib/logging";
import { APICall, executeAPICall } from "../lib/api";
import { capitalize, validateAllowedValues, validateCapacityId } from "../lib/parameters";
import { workloadState } from "../lib/helpers";

export async function workloadAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    let state;
    const capacityId = await validateCapacityId(options.C, true);
    const workloadName = options.workload;
    const maxMemoryPercentageSetByUser = options.memory;
    state = options.state;
    if (state) state = capitalize(await validateAllowedValues(state, workloadState));
    const method = state ? "PATCH" : "GET";
    debug(`Returns a list of refreshables for all capacities of which the user has access to`);
    const request: APICall = {
        method: method,
        url: `/capacities/${capacityId}/Workloads${workloadName ? `/${workloadName}` : ""}`,
        containsValue: state === undefined,
        body: state
            ? {
                  state,
                  maxMemoryPercentageSetByUser,
              }
            : undefined,
    };
    await executeAPICall(request, cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}
