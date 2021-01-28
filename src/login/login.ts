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

import {
    interactiveLoginWithAuthResponse,
    AuthResponse,
    loginWithServicePrincipalSecretWithAuthResponse,
    AzureCliCredentials,
} from "@azure/ms-rest-nodeauth";
import { TokenResponse } from "@azure/ms-rest-nodeauth/dist/lib/credentials/tokenClientCredentials";
import { OptionValues } from "commander";

import { getConfig } from "../lib/config";
import { storeAccessToken, getAccessToken } from "../lib/auth";
import { ModuleCommand } from "../lib/command";
import { debug, verbose } from "../lib/logging";

export async function loginAction(...args: unknown[]): Promise<void> {
    const cmd = args[args.length - 1] as ModuleCommand;
    const options = args[args.length - 2] as OptionValues;
    if (options.H) {
        delete options.H;
        return;
    }
    if (!(options.interactive || options.servicePrincipal || options.azurecli))
        throw "error: missing option '--interactive' or '--azurecli' or '--service-principal'";
    debug("Login in to Power BI and retrieve an access token");
    let accessToken = "";
    if (options.azurecli) {
        accessToken = await loginAzureCLI();
    } else if (options.interactive) {
        accessToken = await loginInteractive(cmd, options);
    } else if (options.servicePrincipal) {
        accessToken = await loginWithServicePrincipal(cmd, options);
    }
    if (accessToken === "") return;
    storeAccessToken(accessToken);
}

async function loginAzureCLI(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        AzureCliCredentials.create({ resource: "https://analysis.windows.net/powerbi/api" })
            .then((value: AzureCliCredentials) => {
                value
                    .getToken()
                    .then((value: TokenResponse) => {
                        resolve(value.accessToken);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch(() => {
                reject("Authentication error. Please login via Azure CLI with command `az login`");
            });
    });
}

async function loginInteractive(cmd: ModuleCommand, options: unknown): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const { tenant } = getConfig(options);
        interactiveLoginWithAuthResponse({
            tokenAudience: "https://analysis.windows.net/powerbi/api",
            domain: tenant,
        })
            .then((authres: AuthResponse) => {
                authres.credentials
                    .getToken()
                    .then((value: TokenResponse) => {
                        resolve(value.accessToken);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

async function loginWithServicePrincipal(cmd: ModuleCommand, options: unknown): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const { principal, secret, tenant } = getConfig(options);
        if (!principal) return reject("error: missing option '--principal'");
        if (!secret) return reject("error: missing option '--secret'");
        if (!tenant) return reject("error: missing option '--tenant'");
        const storedToken = getAccessToken();
        if (storedToken !== "") {
            verbose("Used stored access token");
            return storedToken;
        }
        loginWithServicePrincipalSecretWithAuthResponse(principal, secret, tenant, {
            tokenAudience: "https://analysis.windows.net/powerbi/api",
        })
            .then((authres: AuthResponse) => {
                authres.credentials
                    .getToken()
                    .then((value: TokenResponse) => {
                        resolve(value.accessToken);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}
