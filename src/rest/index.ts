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

import { restAction, requestMethods } from "./rest";

export function getCommands(): ModuleCommand {
    const restCommand = new ModuleCommand("rest")
        .description("Invoke a custom Power BI REST API request")
        .action(restAction)
        .option(
            "--uri <uri>",
            "Request URL. If it doesn't start with a host, CLI prefixes it with the current cloud endpoint."
        )
        .option("--body -b <body>", "Request body. Use @{file} to load from a file")
        .option("--headers <headers>", "Space-separated headers in KEY=VALUE format or JSON string")
        .option("--method -m <method>", `HTTP request method, accepted values: ${requestMethods.join(", ")}`);
    restCommand.addGlobalOptions();
    return restCommand;
}
