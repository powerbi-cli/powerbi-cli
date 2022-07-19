/*
 * ToDo: Create better Serialize Token logic
 */

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
import { existsSync, writeFileSync, readFileSync, unlinkSync, mkdirSync } from "fs";
import { homedir } from "os";
import { verbose } from "./logging";
import { AuthFlow, Token, TokenStore, TokenType } from "./auth";
import { loginSilent } from "../login/login";
import { OptionValues } from "commander";
import { getConsts } from "./consts";

const location = homedir() + "/.powerbi-cli";
const file = "accessTokens.json";

function getKeyTempFile(): string {
    return `${location}/${file}`;
}

function writeToken(accessToken: TokenStore) {
    if (!existsSync(location)) {
        mkdirSync(location);
    }
    writeFileSync(getKeyTempFile(), JSON.stringify(accessToken));
}

function wipeToken() {
    try {
        if (!existsSync(getKeyTempFile())) return;
        const currentLength = readFileSync(getKeyTempFile()).toString().length;
        writeToken({
            flow: AuthFlow.Unknown,
            powerbi: {
                accessToken: "a".repeat(currentLength),
                tenant: "",
                expiresOn: 0,
            },
        });
    } catch {
        console.debug(
            `Error while wipping the stored access token file. To be sure, please check manual if the file ${getKeyTempFile()} exist`
        );
    }
}

function deleteToken() {
    try {
        if (!existsSync(getKeyTempFile())) return;
        unlinkSync(getKeyTempFile());
    } catch {
        console.debug(
            `Error while deleting the stored access token file. To be sure, please check manual if the file ${getKeyTempFile()} exist`
        );
    }
}

export function storeAccessToken(accessToken: TokenStore): void {
    writeToken(accessToken);
}

export function readToken(): TokenStore | undefined {
    if (!existsSync(getKeyTempFile())) return;
    const token = readFileSync(getKeyTempFile()).toString();
    try {
        return JSON.parse(token);
    } catch {
        return;
    }
}

export async function getAccessToken(tokenType: TokenType): Promise<string> {
    const storedToken = readToken();
    if (!storedToken) return "";
    try {
        verbose("Check if stored token is not expired");
        const token = await validateToken(tokenType, storedToken[tokenType]);
        if (token) {
            if (!storedToken[tokenType] || token.expiresOn != storedToken[tokenType]?.expiresOn) {
                storedToken[tokenType] = token;
                storeAccessToken(storedToken);
            }
            return token.accessToken;
        }
    } catch (err) {
        console.log(err);
        removeAccessToken();
        return "";
    }
    return "";
}

export async function getFullAccessToken(tokenType: TokenType): Promise<Token | undefined> {
    const storedToken = readToken();
    if (!storedToken) return;
    return storedToken[tokenType] as Token;
}

export function removeAccessToken(): void {
    wipeToken();
    deleteToken();
}

async function validateToken(tokenType: TokenType, token?: Token): Promise<Token | undefined> {
    if (!token) return;
    if (token.expiresOn - Math.floor(new Date().getTime() / 1000) > 0) return token;
    if (token.refreshToken) {
        verbose("Trying to get new token...");
        return await loginSilent({} as OptionValues, getConsts(), {
            tokenType,
            refreshToken: token.refreshToken as string,
            tenant: token.tenant,
        });
    }
    return;
}
