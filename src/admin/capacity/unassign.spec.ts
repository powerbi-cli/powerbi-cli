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

import { assignAction } from "./assign";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/capacity/assign.ts", () => {
    let validateCapacityIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const noWorkspaceOptions = {
        C: "capacity",
    };
    const allOptions = {
        C: "capacity",
        W: "62b72ecd-65de-4b3e-9b3e-4db2d8c3571b",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateCapacityIdMock = ImportMock.mockFunction(parameters, "validateCapacityId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateCapacityIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("assignAction()", () => {
        it("assign with --help", (done) => {
            validateCapacityIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "assign",
                opts: () => helpOptions,
            };
            assignAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateCapacityIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("assign with no options", (done) => {
            validateCapacityIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "assign",
                opts: () => emptyOptions,
            };
            assignAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("assign with missing options", (done) => {
            validateCapacityIdMock.resolves(noWorkspaceOptions.C);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "assign",
                opts: () => noWorkspaceOptions,
            };
            assignAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("assign with correct options", (done) => {
            validateCapacityIdMock.resolves(noWorkspaceOptions.C);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "assign",
                opts: () => allOptions,
            };
            assignAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
