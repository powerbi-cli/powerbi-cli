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

import { ModuleCommand } from "../../lib/command";
import * as parameters from "../../lib/parameters";
import * as api from "../../lib/api";

import fs from "fs";

import { updateAction } from "./update";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("gateway/datasource/update.ts", () => {
    let validateGatewayIdMock: SinonStub<unknown[], unknown>;
    let validateGatewayDatasourceIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        G: "gatewayName",
    };
    const missingCredsOptions = {
        G: "gatewayName",
        D: "datasourceName",
    };
    const allOptions = {
        G: "gatewayName",
        D: "datasourceName",
        credential: "",
    };
    const allOptionsFile = {
        G: "gatewayName",
        D: "datasourceName",
        credentialFile: "",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGatewayIdMock = ImportMock.mockFunction(parameters, "validateGatewayId");
        validateGatewayDatasourceIdMock = ImportMock.mockFunction(parameters, "validateGatewayDatasourceId");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGatewayIdMock.restore();
        validateGatewayDatasourceIdMock.restore();
        readFileSyncMock.restore();
        executeAPICallMock.restore();
    });
    describe("updateAction()", () => {
        it("update with --help", (done) => {
            validateGatewayIdMock.resolves(undefined);
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => helpOptions,
            };
            updateAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGatewayIdMock.callCount).to.equal(0);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with no options", (done) => {
            validateGatewayIdMock.rejects();
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => emptyOptions,
            };
            updateAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with missing options", (done) => {
            validateGatewayIdMock.resolves(missingOptions.G);
            validateGatewayDatasourceIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => missingOptions,
            };
            updateAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with missing credentials", (done) => {
            validateGatewayIdMock.resolves(missingCredsOptions.G);
            validateGatewayDatasourceIdMock.resolves(missingCredsOptions.D);
            readFileSyncMock.returns("");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => missingCredsOptions,
            };
            updateAction(missingCredsOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with all options", (done) => {
            validateGatewayIdMock.resolves(allOptions.G);
            validateGatewayDatasourceIdMock.resolves(allOptions.D);
            readFileSyncMock.returns("");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => allOptions,
            };
            updateAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("update with all options (file)", (done) => {
            validateGatewayIdMock.resolves(allOptionsFile.G);
            validateGatewayDatasourceIdMock.resolves(allOptionsFile.D);
            readFileSyncMock.returns("");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => allOptionsFile,
            };
            updateAction(allOptionsFile, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
