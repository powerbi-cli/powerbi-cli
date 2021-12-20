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
import * as api from "../../lib/api";

import { scanAction } from "./scan";

import fs from "fs";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/group/scan.ts", () => {
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const allOptions = {
        datasetExpressions: true,
        datasetSchema: true,
        datasourceDetails: true,
        artifactUsers: true,
        lineage: true,
        workspaceFile: "",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
    });
    afterEach(() => {
        executeAPICallMock.restore();
        readFileSyncMock.restore();
    });
    describe("scanAction()", () => {
        it("scan with --help", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "scan",
                opts: () => helpOptions,
            };
            scanAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("scan with no options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "scan",
                opts: () => emptyOptions,
            };
            scanAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("scan with 'tokenOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            readFileSyncMock.returns("{}");
            const cmdOptsMock: unknown = {
                name: () => "scan",
                opts: () => allOptions,
            };
            scanAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("datasetExpressions=true")).to.greaterThan(-1);
                expect(request?.url?.indexOf("datasetSchema=true")).to.greaterThan(-1);
                expect(request?.url?.indexOf("datasourceDetails=true")).to.greaterThan(-1);
                expect(request?.url?.indexOf("getArtifactUsers=true")).to.greaterThan(-1);
                expect(request?.url?.indexOf("lineage=true")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
