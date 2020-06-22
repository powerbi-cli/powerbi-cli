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

import { existsSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { homedir } from "os";
import { decode } from "jsonwebtoken";
import { verbose } from "./logging";

const location = homedir() + "/.powerbi-cli";
const file = "accesstoken.key";

function getKeyTempFile(): string {
    return `${location}/${file}`;
}

function writeToken(accessToken: string) {
    if (!existsSync(location)) {
        return;
    }
    writeFileSync(getKeyTempFile(), accessToken);
}

function wipeToken() {
    try {
        if (!existsSync(getKeyTempFile())) return;
        const currentLength = readFileSync(getKeyTempFile()).toString().length;
        writeToken("a".repeat(currentLength));
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

export function storeAccessToken(accessToken: string): void {
    writeToken(accessToken);
}

export function getAccessToken(): string {
    if (!existsSync(getKeyTempFile())) return "";
    const fileToken = readFileSync(getKeyTempFile()).toString();
    if (fileToken === "") return "";
    try {
        verbose("Check if stored token is not expired");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = decode(fileToken) as any;
        const exp: Date = new Date(0);
        exp.setUTCSeconds(Number.parseInt(token.exp));
        if (exp > new Date()) return fileToken;
    } catch {
        removeAccessToken();
        return "";
    }
    return "";
}

export function removeAccessToken(): void {
    wipeToken();
    deleteToken();
}
