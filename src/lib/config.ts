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

import { existsSync, readFileSync, writeFileSync } from "fs";

import { HomeLocation } from "./consts";

type Scopes = "defaults" | "core";
type ConfigFile = {
    defaults: { [key: string]: string };
    core: {
        cloud: string;
        [key: string]: string;
    };
};

export const DefaultConfig: ConfigFile = {
    defaults: {},
    core: {
        cloud: "public",
    },
};

const file = "config.json";

const AuthorityHosts = {
    public: "login.microsoftonline.com",
    gcc: "login.microsoftonline.us",
    gcchigh: "login.microsoftonline.us",
    dod: "login.microsoftonline.us",
    germany: "login.microsoftonline.de",
    china: "login.chinacloudapi.cn",
};

const PowerBIScopes = {
    public: "analysis.windows.net",
    gcc: "analysis.usgovcloudapi.net",
    gcchigh: "high.analysis.usgovcloudapi.net",
    dod: "mil.analysis.usgovcloudapi.net",
    germany: "analysis.windows.net",
    china: "analysis.chinacloudapi.cn",
};

const AzureScopes = {
    public: "management.core.windows.net",
    gcc: "management.core.usgovcloudapi.net",
    gcchigh: "management.core.usgovcloudapi.net",
    dod: "management.core.usgovcloudapi.net",
    germany: "management.core.cloudapi.de",
    china: "management.core.chinacloudapi.cn",
};

const CloudPowerBIUrls = {
    public: "api.powerbi.com",
    gcc: "api.powerbigov.us",
    gcchigh: "api.high.powerbigov.us",
    dod: "api.mil.powerbigov.us",
    germany: "api.powerbi.de",
    china: "app.powerbi.cn",
};

const CloudAzureUrls = {
    public: "management.azure.com",
    gcc: "management.usgovcloudapi.net",
    gcchigh: "management.usgovcloudapi.net",
    dod: "management.usgovcloudapi.net",
    germany: "management.microsoftazure.de",
    china: "management.chinacloudapi.cn",
};

export interface config {
    principal: string;
    secret: string;
    tenant: string;
}

export function getConfig(options: { [key: string]: string }): config {
    const rcFile = ".pbiclirc";
    const rcConfig = (existsSync(rcFile) ? JSON.parse(readFileSync(rcFile).toString()) : {}) as config;
    const principal = process.env.PBICLI_PRINCIPAL;
    const secret = process.env.PBICLI_SECRET;
    const tenant = process.env.PBICLI_TENANT;
    rcConfig.principal = options.P || principal || rcConfig.principal;
    rcConfig.secret = options.S || secret || rcConfig.secret;
    rcConfig.tenant = options.T || tenant || rcConfig.tenant;
    return rcConfig;
}

export function displayConfig(scope: Scopes, key?: string): void {
    const config = getConfigFromFile();
    const keys = Object.keys(config[scope]);

    if (key) console.info(`${key}: ${config[scope][key]}`);
    else {
        const output: unknown[] = [];
        keys.forEach((key: string) => {
            output.push({ name: key, value: config[scope][key] });
        });
        console.info(JSON.stringify(output, null, " "));
    }
}

export function storeConfig(defs: string[], section: keyof ConfigFile = "defaults"): void {
    const config = getConfigFromFile();

    defs.forEach((def: string) => {
        const values = def.split("=");
        if (values[1] === "") delete config[section][values[0].toLowerCase()];
        else config[section][values[0].toLowerCase()] = values[1];
    });

    writeFileSync(getConfigFile(), JSON.stringify(config));
}

export function getDefault(value: string): string | undefined {
    const config = getConfigFromFile();
    return (config.defaults && config.defaults[value]) || undefined;
}

export function getAuthorityHostUrl(): string {
    return getUrl(AuthorityHosts as never);
}

export function getPowerBIUrl(): string {
    return getUrl(CloudPowerBIUrls as never);
}

export function getAzureUrl(): string {
    return getUrl(CloudAzureUrls as never);
}

export function getPowerBIScopeUrl(): string {
    return getUrl(PowerBIScopes as never);
}

export function getAzureScopeUrl(): string {
    return getUrl(AzureScopes as never);
}

function getUrl(urls: never): string {
    const config = getConfigFromFile();
    const cloud = config.core.cloud as string;
    return urls[cloud.toLowerCase()];
}

function getConfigFromFile(): ConfigFile {
    if (existsSync(getConfigFile())) {
        const config = readFileSync(getConfigFile(), "utf-8");
        try {
            return JSON.parse(config);
        } catch {
            return DefaultConfig;
        }
    } else return DefaultConfig;
}

function getConfigFile(): string {
    return `${HomeLocation}/${file}`;
}
