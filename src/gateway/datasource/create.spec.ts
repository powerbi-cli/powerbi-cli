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

import { createAction } from "./create";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("gateway/datasource/create.ts", () => {
    let validateGatewayIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        G: "gatewayName",
    };
    const allOptions = {
        G: "gatewayName",
        datasource: "{}",
    };
    const allOptionsFile = {
        G: "gatewayName",
        datasourceFile: "",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGatewayIdMock = ImportMock.mockFunction(parameters, "validateGatewayId");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGatewayIdMock.restore();
        readFileSyncMock.restore();
        executeAPICallMock.restore();
    });
    describe("createAction()", () => {
        it("create with --help", (done) => {
            validateGatewayIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "create",
                opts: () => helpOptions,
            };
            createAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGatewayIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("create with no options", (done) => {
            validateGatewayIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "create",
                opts: () => emptyOptions,
            };
            createAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("create with missing options", (done) => {
            validateGatewayIdMock.resolves(missingOptions.G);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "create",
                opts: () => missingOptions,
            };
            createAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("create with all options", (done) => {
            validateGatewayIdMock.resolves(allOptions.G);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "create",
                opts: () => allOptions,
            };
            createAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("create with all options (file)", (done) => {
            validateGatewayIdMock.resolves(allOptions.G);
            readFileSyncMock.returns("{}");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "create",
                opts: () => allOptionsFile,
            };
            createAction(allOptionsFile, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
