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

import fetch from "node-fetch";
import { gt } from "semver";
import { yellow } from "chalk";

import { verbose } from "./logging";

export const currentVersion = "1.2.0";
const versionUrl = "https://powerbicli.azureedge.net/version.json";

interface version {
    version: string;
}

export async function checkVersion(args: string[]): Promise<void> {
    if (!args.some((arg: string) => arg === "version")) return;
    try {
        const latestVersion: version = await getVersion();
        if (gt(latestVersion.version, currentVersion))
            console.info(
                yellow(
                    `New version available: ${latestVersion.version}. Run 'npm i -g @powerbi-cli/powerbi-cli' to update\n`
                )
            );
    } catch (e) {
        verbose(`Error validating version: ${e}`);
    }
}

async function getVersion(): Promise<version> {
    const response = await fetch(versionUrl);
    const latestVersion = (await response.json()) as version;
    return latestVersion;
}
