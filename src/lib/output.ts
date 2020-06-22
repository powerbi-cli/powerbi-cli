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

import { safeDump } from "js-yaml";
import { Parser } from "json2csv";
import jmespath from "jmespath";
import { writeFileSync } from "fs";

export enum OutputType {
    json = "json",
    tsv = "tsv",
    yml = "yml",
    raw = "raw",
}

export function formatAndPrintOutput(
    response: unknown,
    outputType: OutputType = OutputType.json,
    outputFile?: string,
    query?: string
): void {
    if (!response) return;
    if (outputType === OutputType.raw) {
        return;
    }
    let output = JSON.parse(JSON.stringify(response));
    if (query) {
        try {
            output = jmespath.search(output, query);
        } catch (err) {
            console.error(`Error parsing query: ${query} (${err})`);
            return;
        }
    }
    switch (outputType) {
        case OutputType.json:
        default:
            if (outputFile) {
                writeFileSync(outputFile, JSON.stringify(output, null, " "));
            } else {
                console.info(JSON.stringify(output, null, " "));
            }
            break;
        case OutputType.yml:
            console.info(safeDump(output));
            break;
        case OutputType.tsv:
            try {
                if (output === null) return;
                const json2csvParser = new Parser({ header: false, delimiter: "\t", quote: "" });
                console.info(json2csvParser.parse(output));
            } catch {
                console.error("Error parsing data to tsv format.");
            }
            break;
    }
}
