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
import { getGroupUrl, allowedExportFormat, pbiDownloads, pbiExports } from "../../lib/helpers";
import { validateGroupId, validateReportId, validateAllowedValues } from "../../lib/parameters";
import { readFileSync } from "fs";
import { OutputType } from "../../lib/output";

export async function startExportAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) return;
    const groupId = await validateGroupId(options.W, false);
    const reportId = await validateReportId(groupId as string, options.R, true);
    if (options.format === undefined) throw "error: missing option '--format'";
    const format = await validateAllowedValues((options.format as string).toUpperCase(), allowedExportFormat);
    const isPbix = pbiDownloads.some((f) => f === format);
    const isPbiExport = pbiExports.some((f) => f === format);
    const config = options.config ? JSON.parse(options.config) : JSON.parse(readFileSync(options.configFile, "utf8"));
    debug(
        `Start the export of a Power BI report (${reportId}) in workspace (${groupId || "my"}) to format (${format})`
    );
    const request: APICall = {
        method: isPbix ? "GET" : "POST",
        url: `${getGroupUrl(groupId)}/reports/${reportId}/${isPbix ? "Export" : "ExportTo"}`,
        body: isPbix
            ? undefined
            : {
                  format,
                  paginatedReportConfiguration: isPbiExport ? undefined : config,
                  powerBIReportConfiguration: isPbiExport ? config : undefined,
              },
    };
    await executeAPICall(request, isPbix ? OutputType.raw : cmd.outputFormat, cmd.outputFile, cmd.jmsePath);
}
