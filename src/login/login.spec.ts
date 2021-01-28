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

import { ImportMock } from "ts-mock-imports";
import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import { SinonStub } from "sinon";

import { ModuleCommand } from "../lib/command";
import * as auth from "../lib/auth";
import * as logging from "../lib/logging";
import * as config from "../lib/config";
import * as nodeauth from "@azure/ms-rest-nodeauth";

import { loginAction } from "./login";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("login/login.ts", () => {
    let storeAccessTokenMock: SinonStub<unknown[], unknown>;
    let getAccessTokenMock: SinonStub<unknown[], unknown>;
    let interactiveLoginWithAuthResponseMock: SinonStub<unknown[], unknown>;
    let loginWithServicePrincipalSecretWithAuthResponseMock: SinonStub<unknown[], unknown>;
    let AzureCliCredentialsMock: SinonStub<unknown[], unknown>;
    let getConfigMock: SinonStub<unknown[], unknown>;
    let verboseMock: SinonStub<unknown[], unknown>;
    let debugMock: SinonStub<unknown[], unknown>;
    let errorMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const interactive = {
        interactive: true,
    };
    const azurecli = {
        azurecli: true,
    };
    const principal = {
        servicePrincipal: true,
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        storeAccessTokenMock = ImportMock.mockFunction(auth, "storeAccessToken");
        getAccessTokenMock = ImportMock.mockFunction(auth, "getAccessToken");
        interactiveLoginWithAuthResponseMock = ImportMock.mockFunction(nodeauth, "interactiveLoginWithAuthResponse");
        loginWithServicePrincipalSecretWithAuthResponseMock = ImportMock.mockFunction(
            nodeauth,
            "loginWithServicePrincipalSecretWithAuthResponse"
        );
        AzureCliCredentialsMock = ImportMock.mockFunction(nodeauth.AzureCliCredentials, "create");
        getConfigMock = ImportMock.mockFunction(config, "getConfig");
        verboseMock = ImportMock.mockFunction(logging, "verbose").returns(true);
        debugMock = ImportMock.mockFunction(logging, "debug").returns(true);
        errorMock = ImportMock.mockFunction(console, "error").returns(true);
    });
    afterEach(() => {
        storeAccessTokenMock.restore();
        getAccessTokenMock.restore();
        interactiveLoginWithAuthResponseMock.restore();
        loginWithServicePrincipalSecretWithAuthResponseMock.restore();
        AzureCliCredentialsMock.restore();
        getConfigMock.restore();
        verboseMock.restore();
        debugMock.restore();
        errorMock.restore();
    });
    describe("logoutAction()", () => {
        it("login with --help", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => helpOptions,
            };
            loginAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with no options", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => emptyOptions,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --azurecli", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(1);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --azurecli, error", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.rejects();
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(1);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --azurecli, error getToken()", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.reject("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => azurecli,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(1);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --interactive", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(1);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --interactive, missing tentant", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns("");
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(1);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --interactive, error getToken()", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.reject("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(1);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --interactive, error", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.rejects();
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns("");
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => interactive,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(1);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAccessTokenMock.callCount).to.equal(1);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(1);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, no tenantID", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ principal: "principal", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, no principal", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, no secret", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", principal: "principal" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(0);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(0);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, error", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.rejects();
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(1);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(1);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, error getToken()", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.reject("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(storeAccessTokenMock.callCount).to.equal(0);
                expect(getAccessTokenMock.callCount).to.equal(1);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(1);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
        it("login with --service-principal, stored token", () => {
            storeAccessTokenMock.returns(true);
            getAccessTokenMock.returns("token");
            interactiveLoginWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            loginWithServicePrincipalSecretWithAuthResponseMock.resolves({
                credentials: { getToken: () => Promise.resolve("token") },
            });
            AzureCliCredentialsMock.resolves({ getToken: () => Promise.resolve("token") });
            getConfigMock.returns({ tenant: "tenant", principal: "principal", secret: "secret" });
            const cmdOptsMock: unknown = {
                name: () => "login",
                opts: () => principal,
            };
            loginAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(storeAccessTokenMock.callCount).to.equal(1);
                expect(getAccessTokenMock.callCount).to.equal(1);
                expect(interactiveLoginWithAuthResponseMock.callCount).to.equal(0);
                expect(loginWithServicePrincipalSecretWithAuthResponseMock.callCount).to.equal(1);
                expect(AzureCliCredentialsMock.callCount).to.equal(0);
                expect(errorMock.callCount).to.equal(0);
            });
        });
    });
});
