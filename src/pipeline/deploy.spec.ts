/*
 * Copyright (c) 2021 Jan Pieter Posthuma / DataScenarios
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
import * as parameters from "../lib/parameters";
import * as api from "../lib/api";

import { deployAction } from "./deploy";

import fs from "fs";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("pipeline/deploy.ts", () => {
    let validatepipelineIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        options: "{}",
    };
    const allFileOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        optionsFile: "",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validatepipelineIdMock = ImportMock.mockFunction(parameters, "validatePipelineId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
    });
    afterEach(() => {
        validatepipelineIdMock.restore();
        executeAPICallMock.restore();
        readFileSyncMock.restore();
    });
    describe("deployAction()", () => {
        it("deploy with --help", (done) => {
            validatepipelineIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "deploy",
                opts: () => helpOptions,
            };
            deployAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validatepipelineIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("deploy with no options", (done) => {
            validatepipelineIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "deploy",
                opts: () => emptyOptions,
            };
            deployAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("deploy with missing options", (done) => {
            validatepipelineIdMock.resolves(missingOptions.P);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "deploy",
                opts: () => missingOptions,
            };
            deployAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("deploy with all options", (done) => {
            validatepipelineIdMock.resolves(allOptions.P);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "deploy",
                opts: () => allOptions,
            };
            deployAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(0);
                done();
            });
        });
        it("deploy with all options (file)", (done) => {
            validatepipelineIdMock.resolves(allOptions.P);
            executeAPICallMock.resolves(true);
            readFileSyncMock.returns("{}");
            const cmdOptsMock: unknown = {
                name: () => "deploy",
                opts: () => allFileOptions,
            };
            deployAction(allFileOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
