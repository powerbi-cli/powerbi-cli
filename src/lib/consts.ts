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

import { getAzureUrl, getPowerBIUrl } from "./config";

const scopesRequestPBI = ["https://analysis.windows.net/powerbi/api/.default", "offline_access"];
const scopesRequestAzure = ["https://management.core.windows.net/.default", "offline_access"];

export class consts {
    port: number = Number.parseInt(process.env.PORT as string) || 8080;
    redirectUriPath = `/`;
    adal_client_id = "04b07795-8ddb-461a-bbee-02f9e1bf7b46";
    adomd_client_id = "cf710c6e-dfcc-4fa8-a093-d47294e44c66";
    authorityHost = "https://login.microsoftonline.com";

    okResult = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="10;url=https://powerbi-cli.github.io/">
    <title>Login successfully</title>
</head>
<body>
    <h4>You have logged into Microsoft Power BI!</h4>
    <p>You can close this window, or we will redirect you to the <a href="https://powerbi-cli.github.io/">Power BI CLI documents</a> in 10 seconds.</p>
</body>
</html>`;
    errorResult = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Login failed</title>
</head>
<body>
    <h4>Some failures occurred during the authentication</h4>
    <p>You can log an issue at <a href="https://github.com/powerbi-cli/powerbi-cli/issues">Power BI CLI GitHub Repository</a> and we will assist you in resolving it.</p>
</body>
</html>`;
    public get powerBIRestURL(): string {
        const powerBIRootUrl = getPowerBIUrl();
        return `https://${powerBIRootUrl}/v1.0/myorg`;
    }
    public get azureRestURL(): string {
        const azureRootUrl = getAzureUrl();
        return `https://${azureRootUrl}`;
    }
    public get azureScope(): string {
        return scopesRequestAzure.join(" ");
    }
    public get azureCLIScope(): string {
        return scopesRequestAzure
            .filter((scope) => scope !== "offline_access")
            .map((scope) => scope.replace(/\/.default$/, ""))
            .join(" ");
    }
    public get pbiScope(): string {
        return scopesRequestPBI.join(" ");
    }
    public get pbiCLIScope(): string {
        return scopesRequestPBI
            .filter((scope) => scope !== "offline_access")
            .map((scope) => scope.replace(/\/.default$/, ""))
            .join(" ");
    }
    public get redirectUri(): string {
        return `http://localhost:${this.port}${this.redirectUriPath}`;
    }
}

export function getConsts(): consts {
    return new consts();
}
