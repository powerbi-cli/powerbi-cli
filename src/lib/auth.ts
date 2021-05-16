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
import { Server } from "http";
import https from "https";
import open from "open";
import express from "express";
import { stringify } from "querystring";
import { exec } from "child_process";
import { yellow } from "chalk";

import { consts } from "./consts";

export enum AuthFlow {
    Unknown = -1,
    AuthCode,
    AzureCli,
    Credentials,
    DeviceCode,
    DeviceCodeToken,
    Polling,
    RefreshToken,
}

export enum TokenType {
    POWERBI = "powerbi",
    AZURE = "azure",
    XMLA = "xmla",
}

export interface TokenStore {
    flow: AuthFlow;
    powerbi: Token;
    azure?: Token;
    xmla?: Token;
}

export interface Token {
    accessToken: string;
    expiresOn: number;
    tenant?: string;
    refreshToken?: string;
}

export interface SilentTokenRequest {
    tokenType: TokenType;
    tenant?: string;
    refreshToken: string;
}

export interface AuthConfig {
    clientId?: string;
    scope?: string;
    clientSecret?: string;
    code?: string;
    device_code?: string;
    redirectUri?: string;
    refreshToken?: string;
}

export interface AccessTokenResponse {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token?: string;
    scope?: string;
}

export interface DeviceCodeResponse {
    user_code: string;
    device_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
    message: string;
}

export interface DeviceCodeTokenResponse {
    error: string;
    error_description: string;
    error_codes: number[];
    timestamp: string;
    trace_id: string;
    correlation_id: string;
    error_uri: string;
}

export function getDeviceCodeUrl(tenantId = "common", consts: consts): URL {
    return new URL(`${consts.authorityHost}/${tenantId}/oauth2/v2.0/devicecode`);
}

export function getTokenUrl(tenantId = "common", consts: consts): URL {
    return new URL(`${consts.authorityHost}/${tenantId}/oauth2/v2.0/token`);
}

// Code from: https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/identity/identity/samples/manual/authorizationCodeSample.ts
function getAuthorizeUrl(tenantId = "common", consts: consts): string {
    const queryParams = stringify({
        client_id: consts.adal_client_id,
        response_type: "code",
        redirect_uri: consts.redirectUri,
        scope: consts.pbiScope,
        prompt: "select_account",
        code_challenge: "DJQ3B7PD5j4IV7um6I6gR2UqgvjW6kJi8gxeWSfLhbM",
        code_challenge_method: "S256",
    });

    return `${consts.authorityHost}/${tenantId}/oauth2/v2.0/authorize?${queryParams}`;
}

export function getToken(response: AccessTokenResponse, tenant?: string): Token {
    return {
        accessToken: response.access_token,
        tenant,
        expiresOn: new Date().getTime() + response.expires_in * 1000,
        refreshToken: response.refresh_token,
    };
}

export function executeAuthRequest(url: URL, config: AuthConfig, flow: AuthFlow): Promise<unknown> {
    return new Promise<Token | undefined>((resolve, reject) => {
        try {
            let data = "";
            switch (flow) {
                case AuthFlow.AuthCode:
                    data = stringify({
                        client_id: config.clientId,
                        code: config.code,
                        redirect_uri: config.redirectUri,
                        grant_type: "authorization_code",
                        code_verifier: "LJXkTWAQm4bPeMI5YoeFGfkr-cXO-nXWfqdGzddZY4E",
                    });
                    break;
                case AuthFlow.Credentials:
                    data = stringify({
                        client_id: config.clientId,
                        client_secret: config.clientSecret,
                        scope: config.scope,
                        grant_type: "client_credentials",
                    });
                    break;
                case AuthFlow.DeviceCode:
                    data = stringify({
                        client_id: config.clientId,
                        scope: config.scope,
                    });
                    break;
                case AuthFlow.DeviceCodeToken:
                    data = stringify({
                        client_id: config.clientId,
                        device_code: config.device_code,
                        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                    });
                    break;
                case AuthFlow.RefreshToken:
                    data = stringify({
                        client_id: config.clientId,
                        refresh_token: config.refreshToken,
                        scope: config.scope,
                        grant_type: "refresh_token",
                    });
                    break;
            }
            const options = {
                method: "POST",
                host: url.host,
                path: url.pathname + url.search,
                headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": data.length },
            };
            const req = https.request(options, (res) => {
                if (res.statusCode === 200 || (res.statusCode === 400 && AuthFlow.DeviceCodeToken)) {
                    res.on("data", (data) => {
                        resolve(JSON.parse(data));
                    });
                } else {
                    reject("Unexpected error in authentication");
                }
            });
            req.on("error", (err) => {
                reject(err);
            });
            req.write(data);
            req.end();
        } catch (err) {
            reject(err);
        }
    });
}

export function getAuthConfig(authFlow: AuthFlow, tokenType: TokenType, consts: consts): AuthConfig {
    switch (tokenType) {
        case TokenType.XMLA:
            return {
                clientId:
                    authFlow === AuthFlow.Credentials || authFlow === AuthFlow.AzureCli
                        ? undefined
                        : consts.adomd_client_id,
                scope: authFlow === AuthFlow.AzureCli ? consts.pbiCLIScope : consts.pbiScope,
            };
        case TokenType.AZURE:
            return {
                clientId:
                    authFlow === AuthFlow.Credentials || authFlow === AuthFlow.AzureCli
                        ? undefined
                        : consts.adal_client_id,
                scope: authFlow === AuthFlow.AzureCli ? consts.azureCLIScope : consts.azureScope,
            };
        case TokenType.POWERBI:
        default:
            return {
                clientId:
                    authFlow === AuthFlow.Credentials || authFlow === AuthFlow.AzureCli
                        ? undefined
                        : consts.adal_client_id,
                scope: authFlow === AuthFlow.AzureCli ? consts.pbiCLIScope : consts.pbiScope,
            };
    }
}

export async function getAuthCode(tenantId: string, consts: consts): Promise<string> {
    let server: Server | undefined = undefined;
    let authenticateUrl: URL | undefined = undefined;

    // Set up a temporary local endpoint that can wait for the authentication redirect to be sent to the local redirect URI.
    const authCodePromise = new Promise<string>((resolve, reject) => {
        const app = express();

        app.get(consts.redirectUriPath, (req, res) => {
            // Close the temporary server once we've received the redirect.
            if (server) {
                server.close();
            }

            // The redirect will either contain a "code" or an "error"
            const authorizationCode = req.query["code"];
            if (authorizationCode) {
                res.send(consts.okResult);
                resolve(authorizationCode.toString());
            } else {
                res.send(consts.errorResult);
                reject(new Error(`Authentication Error "${req.query["error"]}":\n\n${req.query["error_description"]}`));
            }
        });

        server = app.listen(consts.port);
        server.on("error", () => {
            reject(
                new Error(
                    `Error opening internal webserver: port ${consts.port} already in use. Please use use device code flow with 'pbicli login --use-device-code'`
                )
            );
            return;
        });
        server.setTimeout(1000);

        // Direct the user to the authentication URI either by opening a browser (desktop and mobile apps) or redirecting their browser using a Location header (web apps and APIs).
        authenticateUrl = new URL(getAuthorizeUrl(tenantId, consts));
        server.on("listening", async () => {
            try {
                await open((authenticateUrl as URL).href);
            } catch {
                if (server) {
                    (server as Server).close();
                }
                throw new Error(
                    `Error opening default web browser. Please use use device code flow with 'pbicli login --use-device-code'`
                );
            }
        });
    });
    const url = authenticateUrl ? `${(authenticateUrl as URL).origin}${(authenticateUrl as URL).pathname}` : ``;
    console.info(
        yellow(`The default web browser has been opened at ${url}. Please continue the login in the web browser.
If no web browser is available or if the web browser fails to open, use device code flow 
with 'pbicli login --use-device-code'`)
    );

    // Wait for the authorization response to be send to the redirect URI
    return await authCodePromise;
}

export async function getDeviceCode(
    tenantId: string,
    consts: consts,
    tokenType: TokenType
): Promise<Token | undefined> {
    const config: AuthConfig = getAuthConfig(AuthFlow.DeviceCode, tokenType, consts);
    const pollingUrl: DeviceCodeResponse = (await executeAuthRequest(
        getDeviceCodeUrl(tenantId, consts),
        config,
        AuthFlow.DeviceCode
    )) as DeviceCodeResponse;
    if (!pollingUrl.message) return;
    console.log(pollingUrl.message);
    const interval = pollingUrl.interval * 1000;
    config.device_code = pollingUrl.device_code;
    return new Promise<Token>((resolve, reject) => {
        const intervalId: ReturnType<typeof setTimeout> = setInterval(async () => {
            try {
                const polling = await executeAuthRequest(
                    getTokenUrl(tenantId, consts),
                    config,
                    AuthFlow.DeviceCodeToken
                );
                if (!(polling as DeviceCodeTokenResponse).error) {
                    clearInterval(intervalId);
                    resolve(getToken(polling as AccessTokenResponse, tenantId));
                }
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, interval);
    });
}

function getSafeWorkingDir(): string {
    if (process.platform === "win32") {
        if (!process.env.SystemRoot) {
            throw new Error("Azure CLI credential expects a 'SystemRoot' environment variable");
        }
        return process.env.SystemRoot;
    } else {
        return "/bin";
    }
}

// Azure CLI based on: https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/identity/identity/src/credentials/azureCliCredential.ts
async function getAzureCliAccessToken(
    resource: string
): Promise<{ stdout: string; stderr: string; error: Error | null }> {
    return new Promise((resolve, reject) => {
        try {
            exec(
                `az account get-access-token --output json --resource ${resource}`,
                { cwd: getSafeWorkingDir() },
                (error, stdout, stderr) => {
                    resolve({ stdout: stdout, stderr: stderr, error });
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

export async function getAzureCLIToken(consts: consts, config: AuthConfig): Promise<Token | undefined> {
    return new Promise((resolve, reject) => {
        let responseData = "";

        getAzureCliAccessToken(config.scope as string)
            .then((obj: { stdout: string; stderr: string; error: Error | null }) => {
                if (obj.stderr) {
                    const isLoginError = obj.stderr.match("(.*)az login(.*)");
                    const isNotInstallError =
                        obj.stderr.match("az:(.*)not found") || obj.stderr.startsWith("'az' is not recognized");
                    if (isNotInstallError) {
                        reject(
                            "Azure CLI could not be found.  Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'."
                        );
                        return;
                    } else if (isLoginError) {
                        reject(
                            "Please run 'az login' from a command prompt to authenticate before using this credential."
                        );
                    }
                    reject(obj.stderr);
                    return;
                } else {
                    responseData = obj.stdout;
                    const response: { accessToken: string; expiresOn: string; tenant: string } = JSON.parse(
                        responseData
                    );
                    const returnValue = {
                        accessToken: response.accessToken,
                        expiresOn: new Date(response.expiresOn).getTime(),
                        tenant: response.tenant,
                    };
                    resolve(returnValue);
                    return returnValue;
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}
