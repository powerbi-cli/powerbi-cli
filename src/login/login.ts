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
import yellow from "chalk";
import { decode } from "jsonwebtoken";

import { getConfig } from "../lib/config";
import {
    executeAuthRequest,
    getAuthCode,
    getTokenUrl,
    Token,
    AuthConfig,
    AuthFlow,
    getAuthConfig,
    getDeviceCode,
    AccessTokenResponse,
    SilentTokenRequest,
    getToken,
    getAzureCLIToken,
    TokenStore,
    TokenType,
} from "../lib/auth";
import { debug } from "../lib/logging";
import { consts, getConsts } from "../lib/consts";
import { storeAccessToken } from "../lib/token";

export async function loginAction(...args: unknown[]): Promise<void> {
    const options = args[args.length - 2] as OptionValues;
    if (options.H) {
        delete options.H;
        return;
    }
    debug("Login in to Power BI and retrieve an access token");
    const { tenant } = getConfig(options);
    const consts = getConsts();
    let accessToken: TokenStore | undefined = undefined;
    if (options.azurecli) {
        accessToken = {
            flow: AuthFlow.AzureCli,
            powerbi: (await loginAzureCLI(consts, TokenType.POWERBI)) as Token,
            azure: options.azure ? ((await loginAzureCLI(consts, TokenType.AZURE)) as Token) : undefined,
        };
        const decodeToken = decode(accessToken.powerbi.accessToken) as { [key: string]: unknown };
        if (decodeToken !== null && decodeToken.appid !== consts.adal_client_id) accessToken.xmla = accessToken.powerbi;
    } else if (options.servicePrincipal) {
        accessToken = {
            flow: AuthFlow.Credentials,
            powerbi: (await loginWithServicePrincipal(options, consts, TokenType.POWERBI)) as Token,
            azure: options.azure
                ? ((await loginWithServicePrincipal(options, consts, TokenType.AZURE)) as Token)
                : undefined,
        };
        // We can reuse the SP token for the XMLA commands
        accessToken.xmla = options.xmla ? accessToken.powerbi : undefined;
    } else if (options.useDeviceCode) {
        accessToken = {
            flow: AuthFlow.DeviceCode,
            powerbi: (await loginWithDeviceCode(options, consts, TokenType.POWERBI)) as Token,
        };
        // We can use the refreshToken to silent get a token for the embedded commands
        accessToken.azure = options.azure
            ? ((await loginWithRefreshToken(
                  {
                      refreshToken: accessToken.powerbi.refreshToken as string,
                      tenant: tenant,
                      tokenType: TokenType.AZURE,
                  },
                  consts
              )) as Token)
            : undefined;
        console.info(
            yellow(`Currently the access token for the XMLA command cannot be retrieved 'silent' and 
can be retrived via a new request.`)
        );
        accessToken.xmla = options.xmla
            ? ((await loginWithDeviceCode(options, consts, TokenType.XMLA)) as Token)
            : undefined;
    } else {
        accessToken = {
            flow: AuthFlow.AuthCode,
            powerbi: (await loginInteractive(options, consts)) as Token,
        };
        accessToken.azure = options.azure
            ? ((await loginWithRefreshToken(
                  {
                      refreshToken: accessToken.powerbi.refreshToken as string,
                      tenant: tenant,
                      tokenType: TokenType.AZURE,
                  },
                  consts
              )) as Token)
            : undefined;
        if (options.xmla) {
            console.info(
                yellow(`Currently the access token for the XMLA command cannot be retrieved 'silent' and 
can be retrived via the 'device code' flow.`)
            );
            accessToken.xmla = (await loginWithDeviceCode(options, consts, TokenType.XMLA)) as Token;
        }
    }

    if (!accessToken) throw "Error empty access token";
    storeAccessToken(accessToken);
}

export async function loginSilent(
    options: OptionValues,
    consts: consts,
    silentTokenRequest: SilentTokenRequest
): Promise<Token | undefined> {
    if (options.servicePrincipal) {
        return loginWithServicePrincipal(options, consts, silentTokenRequest.tokenType);
    } else {
        return await loginWithRefreshToken(silentTokenRequest, consts);
    }
}

async function loginAzureCLI(consts: consts, tokenType: TokenType): Promise<Token | undefined> {
    const config = getAuthConfig(AuthFlow.AzureCli, tokenType, consts);
    return getAzureCLIToken(consts, config);
}

async function loginWithRefreshToken(
    refreshTokenRequest: SilentTokenRequest,
    consts: consts
): Promise<Token | undefined> {
    let clientId, scope;
    switch (refreshTokenRequest.tokenType) {
        case TokenType.XMLA:
            clientId = consts.adomd_client_id;
            scope = consts.pbiScope;
            break;
        case TokenType.AZURE:
            clientId = consts.adal_client_id;
            scope = consts.azureScope;
            break;
        case TokenType.POWERBI:
        default:
            clientId = consts.adal_client_id;
            scope = consts.pbiScope;
            break;
    }
    const config: AuthConfig = {
        clientId,
        scope,
        refreshToken: refreshTokenRequest.refreshToken,
    };
    const tokenResponse = (await executeAuthRequest(
        getTokenUrl(refreshTokenRequest.tenant, consts),
        config,
        AuthFlow.RefreshToken
    )) as AccessTokenResponse;
    return getToken(tokenResponse, refreshTokenRequest.tenant);
}

async function loginWithDeviceCode(
    options: OptionValues,
    consts: consts,
    tokenType: TokenType
): Promise<Token | undefined> {
    const { tenant } = getConfig(options);
    return await getDeviceCode(tenant, consts, tokenType);
}

async function loginInteractive(options: OptionValues, consts: consts): Promise<Token | undefined> {
    const { tenant } = getConfig(options);
    const code = await getAuthCode(tenant, consts);
    const config: AuthConfig = {
        clientId: consts.adal_client_id,
        code: code,
        scope: consts.pbiScope,
        redirectUri: consts.redirectUri,
    };
    const tokenResponse = (await executeAuthRequest(
        getTokenUrl(tenant, consts),
        config,
        AuthFlow.AuthCode
    )) as AccessTokenResponse;
    return getToken(tokenResponse, tenant);
}

async function loginWithServicePrincipal(
    options: OptionValues,
    consts: consts,
    tokenType: TokenType
): Promise<Token | undefined> {
    const { principal, secret, tenant } = getConfig(options);

    if (!principal) throw "error: missing option '--principal'";
    if (!secret) throw "error: missing option '--secret'";
    if (!tenant) throw "error: missing option '--tenant'";

    const config = getAuthConfig(AuthFlow.Credentials, tokenType, consts);
    config.clientId = principal;
    config.clientSecret = secret;

    const tokenResponse = (await executeAuthRequest(
        getTokenUrl(tenant, consts),
        config,
        AuthFlow.Credentials
    )) as AccessTokenResponse;
    return getToken(tokenResponse, tenant);
}
