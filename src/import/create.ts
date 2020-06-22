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

import { parse } from "path";
import { ModuleCommand } from "../lib/command";
import { debug } from "../lib/logging";
import { APICall, executeAPICall } from "../lib/api";
import { validateGroupId, validateParameter, validateAllowedValues } from "../lib/parameters";
import {
    getGroupUrl,
    datasetNamingConflictPBIX,
    datasetNamingConflictRDL,
    datasetNamingConflictDF,
} from "../lib/helpers";

export async function createAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;
    const groupId = await validateGroupId(options.G, false);
    let file;
    let name;
    let url;
    let conflict;
    let skipReport;
    const searchParams = [];
    switch (cmd.name()) {
        case "pbix":
            if (options.file === undefined) throw "error: missing option '--file'";
            file = options.file;
            name = options.name === undefined ? parse(file).name : options.name;
            conflict = await validateParameter({
                name: options.conflict,
                isName: () => validateAllowedValues(options.conflict, datasetNamingConflictPBIX),
                missing: "error: missing option '--conflict'",
                isRequired: false,
            });
            skipReport = options.skipReport !== undefined;
            break;
        case "pbix-large":
            if (options.url === undefined) throw "error: missing option '--url'";
            if (options.name === undefined) throw "error: missing option '--name'";
            url = options.url;
            name = options.name;
            conflict = await validateParameter({
                name: options.conflict,
                isName: () => validateAllowedValues(options.conflict, datasetNamingConflictPBIX),
                missing: "error: missing option '--conflict'",
                isRequired: false,
            });
            skipReport = options.skipReport !== undefined;
            break;
        case "rdl":
            if (options.file === undefined) throw "error: missing option '--file'";
            file = options.file;
            name = options.name === undefined ? parse(file).name : options.name;
            conflict = await validateParameter({
                name: options.conflict,
                isName: () => validateAllowedValues(options.conflict, datasetNamingConflictRDL),
                missing: "error: missing option '--conflict'",
                isRequired: false,
            });
            break;
        case "dataflow":
            if (options.file === undefined) throw "error: missing option '--file'";
            file = options.file;
            name = "model.json";
            conflict = await validateParameter({
                name: options.conflict,
                isName: () => validateAllowedValues(options.conflict, datasetNamingConflictDF),
                missing: "error: missing option '--conflict'",
                isRequired: false,
            });
            break;
    }
    searchParams.push(["datasetDisplayName", `${parse(file).name}${parse(file).ext}`]);
    if (conflict) searchParams.push(["nameConflict", conflict]);
    if (skipReport) searchParams.push(["skipReport", "true"]);
    debug(`Upload a Power BI import (${file || name})`);
    const request: APICall = {
        method: "POST",
        url: `${getGroupUrl(groupId)}/imports?${new URLSearchParams(searchParams).toString()}`,
        body:
            cmd.name() === "pbix-large"
                ? {
                      fileUrl: url,
                  }
                : undefined,

        uploadFile: file,
    };
    await executeAPICall(request);
}
