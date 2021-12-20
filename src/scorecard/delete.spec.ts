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

import { deleteAction } from "./delete";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("scorecard/delete.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateScorecardIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateScorecardIdMock = ImportMock.mockFunction(parameters, "validateScorecardId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateScorecardIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("deleteAction()", () => {
        it("delete with --help", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateScorecardIdMock.resolves(allOptions.S);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => helpOptions,
            };
            deleteAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateScorecardIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with no options", (done) => {
            validateGroupIdMock.rejects();
            validateScorecardIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => emptyOptions,
            };
            deleteAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with no scorecard options", (done) => {
            validateGroupIdMock.resolves(missingOptions.W);
            validateScorecardIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => missingOptions,
            };
            deleteAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("delete with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateScorecardIdMock.resolves(allOptions.S);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "delete",
                opts: () => allOptions,
            };
            deleteAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateScorecardIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
