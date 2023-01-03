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
import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

import { verbose } from "./logging";
import { HomeLocation } from "./consts";

export const currentVersion = "1.3.3";
const versionUrl = "https://powerbicli.azureedge.net/version.json";
const file = "versionCheck.json";
const checkInterval = 1000 * 60 * 60 * 24; // 1 day

export interface LatestVersion {
    version: string;
}

export interface Version {
    "powerbi-cli": string;
    "powerbi-cli-latest"?: string;
}

interface VersionFile {
    versions: {
        "powerbi-cli": {
            local: string;
            remote: string;
        };
    };
    check_time: Date;
}

export async function checkVersion(): Promise<boolean> {
    const { valid } = cachedVersionValid();
    if (!valid) {
        try {
            const latestVersion: LatestVersion = await getLatestVersion();
            if (gt(latestVersion.version, currentVersion))
                console.info(
                    chalk.yellow(
                        `New version available: ${latestVersion.version}. Run 'npm i -g @powerbi-cli/powerbi-cli' to update\n`
                    )
                );
            storeVersionToFile({
                versions: {
                    "powerbi-cli": { local: currentVersion, remote: latestVersion.version },
                },
                check_time: new Date(),
            });
            return true;
        } catch (e) {
            verbose(`Error validating version: ${e}`);
        }
    }
    return false;
}

export async function getVersions(): Promise<Version> {
    const { valid, storedVersion } = cachedVersionValid();
    if (valid) {
        return await getVersionStructure(
            (storedVersion as VersionFile).versions["powerbi-cli"].local,
            (storedVersion as VersionFile).versions["powerbi-cli"].remote
        );
    }

    const latestVersion: LatestVersion = await getLatestVersion();
    const versions = await getVersionStructure(currentVersion, latestVersion.version);

    storeVersionToFile({
        versions: {
            "powerbi-cli": { local: currentVersion, remote: latestVersion.version },
        },
        check_time: new Date(),
    });

    return versions;
}

async function getLatestVersion(): Promise<LatestVersion> {
    const response = await fetch(versionUrl);
    const latestVersion = (await response.json()) as LatestVersion;
    return latestVersion;
}

function cachedVersionValid(): { valid: boolean; storedVersion?: VersionFile } {
    const storedVersion = getVersionFromFile();
    if (storedVersion) {
        const checkTime = new Date(storedVersion.check_time);
        return { valid: checkTime.getTime() + checkInterval > new Date().getTime(), storedVersion };
    }
    return { valid: false };
}

async function getVersionStructure(version: string, latestVersion: string) {
    const versions: Version = {
        "powerbi-cli": version,
    };
    if (gt(latestVersion, currentVersion)) {
        versions["powerbi-cli-latest"] = latestVersion;
    }
    return versions;
}

function storeVersionToFile(version: VersionFile): void {
    if (!existsSync(HomeLocation)) {
        mkdirSync(HomeLocation);
    }
    writeFileSync(getVersionFile(), JSON.stringify(version));
}

function getVersionFromFile(): VersionFile | undefined {
    if (existsSync(getVersionFile())) {
        const version = readFileSync(getVersionFile(), "utf-8");
        try {
            return JSON.parse(version);
        } catch {
            return;
        }
    } else return;
}

function getVersionFile(): string {
    return `${HomeLocation}/${file}`;
}
