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

import rc from "rc";
import { EncodeOptions, parse, stringify } from "ini";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";

const location = homedir() + "/.powerbi-cli";
const file = "config";

const cloudPowerBIUrls = {
    public: "api.powerbi.com",
    gcc: "api.powerbigov.us",
    gcchigh: "api.high.powerbigov.us",
    dod: "api.mil.powerbigov.us",
    germany: "api.powerbi.de",
    china: "app.powerbi.cn",
};

export enum cloudAzureUrls {
    public = "management.azure.com",
    gcc = "management.usgovcloudapi.net",
    gcchigh = "management.usgovcloudapi.net",
    dod = "management.usgovcloudapi.net",
    germany = "management.microsoftazure.de",
    china = "management.chinacloudapi.cn",
}

export interface config {
    principal: string;
    secret: string;
    tenant: string;
}

// eslint-disable-next-line
export function getConfig(options: any): config {
    const rcConfig = rc("pbicli", {}) as config;
    const principal = process.env.PBICLI_PRINCIPAL;
    const secret = process.env.PBICLI_SECRET;
    const tenant = process.env.PBICLI_TENANT;
    rcConfig.principal = options.P || principal || rcConfig.principal;
    rcConfig.secret = options.S || secret || rcConfig.secret;
    rcConfig.tenant = options.T || tenant || rcConfig.tenant;
    return rcConfig;
}

export function displayConfig(scope: string, key?: string): void {
    const config = getConfigFromFile();
    const keys = Object.keys(config[scope] || {});

    if (key) console.info(`${key}: ${config[scope][key]}`);
    else {
        const output: unknown[] = [];
        keys.forEach((key: string) => {
            output.push({ name: key, value: config[scope][key] });
        });
        console.info(JSON.stringify(output, null, " "));
    }
}

export function storeConfig(defs: string[], scope: string): void {
    const config = getConfigFromFile();
    if (!config.defaults) config.defaults = {};

    defs.forEach((d: string) => {
        const values = d.split("=");
        if (values[1] === "") delete config.defaults[values[0]];
        else config.defaults[values[0]] = values[1];
    });

    writeFileSync(getConfigFile(), stringify(config));
}

export function getDefault(value: string): string | undefined {
    const config = getConfigFromFile();
    return (config.defaults && config.defaults[value]) || undefined;
}

export function getPowerBIUrl(): string {
    return getUrl(cloudPowerBIUrls as never);
}

export function getAzureUrl(): string {
    return getUrl(cloudAzureUrls as never);
}

function getUrl(urls: never): string {
    const config = getConfigFromFile();
    const cloud = config.core.cloud as string;
    return urls[cloud.toLowerCase()];
}

function getConfigFromFile() {
    if (!existsSync(getConfigFile()))
        writeFileSync(getConfigFile(), stringify({ cloud: "Public" }, { section: "core" } as EncodeOptions));
    const config = parse(readFileSync(getConfigFile(), "utf-8"));
    return config;
}

function getConfigFile(): string {
    return `${location}/${file}`;
}
