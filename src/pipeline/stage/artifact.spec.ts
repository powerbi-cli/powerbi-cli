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

import { artifactAction } from "./artifact";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("pipeline/stage/artifact.ts", () => {
    let validatepipelineIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        S: "0",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validatepipelineIdMock = ImportMock.mockFunction(parameters, "validatePipelineId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validatepipelineIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("artifactAction()", () => {
        it("artifact with --help", (done) => {
            validatepipelineIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "artifact",
                opts: () => helpOptions,
            };
            artifactAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validatepipelineIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("artifact with no options", (done) => {
            validatepipelineIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "artifact",
                opts: () => emptyOptions,
            };
            artifactAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with one options", (done) => {
            validatepipelineIdMock.resolves(oneOptions.P);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "artifact",
                opts: () => oneOptions,
            };
            artifactAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with all options", (done) => {
            validatepipelineIdMock.resolves(allOptions.S);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "artifact",
                opts: () => allOptions,
            };
            artifactAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validatepipelineIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
