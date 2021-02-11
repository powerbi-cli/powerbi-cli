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

import { ImportMock, MockManager } from "ts-mock-imports";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import { SinonStub } from "sinon";

import { ModuleCommand } from "../lib/command";
import * as token from "../lib/token";
import * as auth from "../lib/auth";
import * as logging from "../lib/logging";
import * as config from "../lib/config";
import { loginAction } from "./login";
import { getConsts } from "../lib/consts";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("login/login.ts", () => {
    let storeAccessTokenMock: SinonStub<unknown[], unknown>;

    let executeAuthRequestMock: SinonStub<unknown[], unknown>;
    let getDeviceCodeMock: SinonStub<unknown[], unknown>;
    let getAzureCLITokenMock: SinonStub<unknown[], unknown>;
    let getTokenUrlMock: SinonStub<unknown[], unknown>;
    let getTokenMock: SinonStub<unknown[], unknown>;
    let getAuthConfigMock: SinonStub<unknown[], unknown>;
    let getAuthCodeMock: SinonStub<unknown[], unknown>;
    let getConfigMock: SinonStub<unknown[], unknown>;

    let consoleInfoMock: SinonStub<unknown[], unknown>;
    let verboseMock: SinonStub<unknown[], unknown>;
    let debugMock: SinonStub<unknown[], unknown>;

    const emptyOptions = {};
    const interactive = {
        interactive: true,
    };
    const azurecli = {
        azurecli: true,
    };
    const devicecode = {
        useDeviceCode: true,
    };
    const principal = {
        servicePrincipal: true,
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        storeAccessTokenMock = ImportMock.mockFunction(token, "storeAccessToken");

        executeAuthRequestMock = ImportMock.mockFunction(auth, "executeAuthRequest");
        getDeviceCodeMock = ImportMock.mockFunction(auth, "getDeviceCode");
        getAzureCLITokenMock = ImportMock.mockFunction(auth, "getAzureCLIToken");
        getTokenUrlMock = ImportMock.mockFunction(auth, "getTokenUrl");
        getTokenMock = ImportMock.mockFunction(auth, "getToken");
        getAuthCodeMock = ImportMock.mockFunction(auth, "getAuthCode");
        getAuthConfigMock = ImportMock.mockFunction(auth, "getAuthConfig");
        getConfigMock = ImportMock.mockFunction(config, "getConfig");

        consoleInfoMock = ImportMock.mockFunction(console, "info", true);
        verboseMock = ImportMock.mockFunction(logging, "verbose").returns(true);
        debugMock = ImportMock.mockFunction(logging, "debug").returns(true);
    });
    afterEach(() => {
        storeAccessTokenMock.restore();

        executeAuthRequestMock.restore();
        getDeviceCodeMock.restore();
        getAzureCLITokenMock.restore();
        getTokenUrlMock.restore();
        getTokenMock.restore();
        getAuthCodeMock.restore();
        getAuthConfigMock.restore();
        getConfigMock.restore();

        consoleInfoMock.restore();
        verboseMock.restore();
        debugMock.restore();
    });
    describe("loginAction()", () => {
        it("login with --help", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => helpOptions,
            };
            loginAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getConfigMock.callCount).to.equal(0);
            });
        });
        it("login with no options", () => {
            storeAccessTokenMock.returns(true);
            getAuthCodeMock.returns("code");
            getTokenUrlMock.returns("");
            getConfigMock.returns({ tenant: "tenant" });
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => emptyOptions,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).then((token) => {
                expect(token).equal({ accessToken: "token" });
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
                expect(executeAuthRequestMock.callCount).to.equal(1);
                expect(getTokenMock.callCount).to.equal(1);
            });
        });
        it("login with --interactive", () => {
            storeAccessTokenMock.returns(true);
            getAuthCodeMock.returns("code");
            getTokenUrlMock.returns("");
            getConfigMock.returns({ tenant: "tenant" });
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).then((token) => {
                expect(token).equal({ accessToken: "token" });
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
                expect(executeAuthRequestMock.callCount).to.equal(1);
                expect(getTokenMock.callCount).to.equal(1);
            });
        });
        it("login with --interactive, error getAuthCode()", () => {
            storeAccessTokenMock.returns(true);
            getAuthCodeMock.throws();
            getTokenUrlMock.returns("");
            getConfigMock.returns({ tenant: "tenant" });
            executeAuthRequestMock.rejects();
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(token).equal({ accessToken: "token" });
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(0);
                expect(getConfigMock.callCount).to.equal(0);
                expect(executeAuthRequestMock.callCount).to.equal(0);
                expect(getTokenMock.callCount).to.equal(0);
            });
        });
        it("login with --interactive, error executeAuthRequest()", () => {
            storeAccessTokenMock.returns(true);
            getAuthCodeMock.returns("code");
            getTokenUrlMock.returns("");
            getConfigMock.returns({ tenant: "tenant" });
            executeAuthRequestMock.rejects();
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(token).equal({ accessToken: "token" });
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
                expect(executeAuthRequestMock.callCount).to.equal(1);
                expect(getTokenMock.callCount).to.equal(0);
            });
        });
        it("login with --azurecli", () => {
            storeAccessTokenMock.returns(true);
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getAzureCLITokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(azurecli, cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthConfigMock.callCount).to.equal(2);
                expect(getAzureCLITokenMock.callCount).to.equal(2);
            });
        });
        it("login with --azurecli, error accessToken", () => {
            storeAccessTokenMock.returns(true);
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getAzureCLITokenMock.throws();
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(azurecli, cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAuthConfigMock.callCount).to.equal(2);
                expect(getAzureCLITokenMock.callCount).to.equal(2);
            });
        });
        it("login with --azurecli, error accessToken on 2nd call (Azure)", () => {
            storeAccessTokenMock.returns(true);
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getAzureCLITokenMock.onCall(0).returns({ accessToken: "token" });
            getAzureCLITokenMock.onCall(1).throws();
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(azurecli, cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAuthConfigMock.callCount).to.equal(2);
                expect(getAzureCLITokenMock.callCount).to.equal(2);
            });
        });
        it("login with --use-device-code", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant" });
            getDeviceCodeMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => devicecode,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).then((token) => {
                expect(token).equal({ accessToken: "token" });
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getDeviceCodeMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
            });
        });
        it("login with --use-device-code, error empty accessToken", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant" });
            getDeviceCodeMock.throws();
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => devicecode,
            };
            loginAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getDeviceCodeMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
            });
        });
        it("login with --service-principal", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getTokenUrlMock.returns("");
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(principal, cmdOptsMock as ModuleCommand).then(() => {
                expect(token).equal({ accessToken: "token" });
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(1);
                expect(getConfigMock.callCount).to.equal(1);
                expect(executeAuthRequestMock.callCount).to.equal(1);
                expect(getTokenMock.callCount).to.equal(1);
                expect(storeAccessTokenMock.callCount).to.equal(1);
            });
        });
        it("login with --service-principal, no tenantID", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ principal: "principal", secret: "secret" });
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getTokenUrlMock.returns("");
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(principal, cmdOptsMock as ModuleCommand).catch(() => {
                expect(getConfigMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(0);
                expect(getTokenUrlMock.callCount).to.equal(0);
                expect(executeAuthRequestMock.callCount).to.equal(0);
                expect(getTokenMock.callCount).to.equal(0);
                expect(storeAccessTokenMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, no principal", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant", secret: "secret" });
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getTokenUrlMock.returns("");
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(principal, cmdOptsMock as ModuleCommand).catch(() => {
                expect(getConfigMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(0);
                expect(getTokenUrlMock.callCount).to.equal(0);
                expect(executeAuthRequestMock.callCount).to.equal(0);
                expect(getTokenMock.callCount).to.equal(0);
                expect(storeAccessTokenMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, no secret", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ principal: "principal", tenant: "tenant" });
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getTokenUrlMock.returns("");
            executeAuthRequestMock.resolves({
                token_type: "Bearer",
                expires_in: 3599,
                ext_expires_in: 3599,
                access_token: "token",
                refresh_token: "resfrehToken",
            });
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(principal, cmdOptsMock as ModuleCommand).catch(() => {
                expect(getConfigMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(0);
                expect(getTokenUrlMock.callCount).to.equal(0);
                expect(executeAuthRequestMock.callCount).to.equal(0);
                expect(getTokenMock.callCount).to.equal(0);
                expect(storeAccessTokenMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, error executeAuthRequest()", () => {
            storeAccessTokenMock.returns(true);
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            getAuthConfigMock.returns({ clientId: "clientid", scope: "powerbi" });
            getTokenUrlMock.returns("");
            executeAuthRequestMock.rejects();
            getTokenMock.returns({ accessToken: "token" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(principal, cmdOptsMock as ModuleCommand).catch(() => {
                expect(getConfigMock.callCount).to.equal(1);
                expect(getAuthCodeMock.callCount).to.equal(1);
                expect(getTokenUrlMock.callCount).to.equal(1);
                expect(executeAuthRequestMock.callCount).to.equal(1);
                expect(getTokenMock.callCount).to.equal(0);
                expect(storeAccessTokenMock.callCount).to.equal(0);
            });
        });
    });
});
