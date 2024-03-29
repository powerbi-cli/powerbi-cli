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
import * as parameters from "../lib/parameters";
import * as api from "../lib/api";

import { setOwnerAction } from "./set-owner";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("report/set-owner.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateReportIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const myOptions = {
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateReportIdMock = ImportMock.mockFunction(parameters, "validateReportId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateReportIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("setOwnerAction()", () => {
        it("setOwner with --help", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateReportIdMock.resolves(allOptions.R);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "setOwner",
                opts: () => helpOptions,
            };
            setOwnerAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateReportIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("setOwner with no options", (done) => {
            validateGroupIdMock.rejects();
            validateReportIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "setOwner",
                opts: () => emptyOptions,
            };
            setOwnerAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("setOwner with no report options ('my')", (done) => {
            validateGroupIdMock.resolves("my");
            validateReportIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "setOwner",
                opts: () => myOptions,
            };
            setOwnerAction(myOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("setOwner with no report options ('groupId')", (done) => {
            validateGroupIdMock.resolves(missingOptions.W);
            validateReportIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "setOwner",
                opts: () => missingOptions,
            };
            setOwnerAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("setOwner with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateReportIdMock.resolves(allOptions.R);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "setOwner",
                opts: () => allOptions,
            };
            setOwnerAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
