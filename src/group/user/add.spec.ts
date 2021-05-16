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

import { addUserAction } from "./add";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("group/user/add.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateParameterMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
    };
    const incorrectTypeOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
        accessRight: "App",
        principalType: "Viewer",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
        accessRight: "App",
        principalType: "Admin",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateParameterMock = ImportMock.mockFunction(parameters, "validateParameter");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateParameterMock.restore();
        executeAPICallMock.restore();
    });
    describe("addUserAction()", () => {
        it("add with --help", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => helpOptions,
            };
            addUserAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with no options", (done) => {
            validateGroupIdMock.rejects();
            validateParameterMock.resolves(true);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => emptyOptions,
            };
            addUserAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with missing options", (done) => {
            validateGroupIdMock.resolves(missingOptions.W);
            validateParameterMock.onFirstCall().rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => missingOptions,
            };
            addUserAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with incorrect type options", (done) => {
            validateGroupIdMock.resolves(incorrectTypeOptions.W);
            validateParameterMock.onFirstCall().resolves(incorrectTypeOptions.accessRight);
            validateParameterMock.onSecondCall().rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => incorrectTypeOptions,
            };
            addUserAction(incorrectTypeOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateParameterMock.onFirstCall().resolves(allOptions.accessRight);
            validateParameterMock.onSecondCall().resolves(allOptions.principalType);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => allOptions,
            };
            addUserAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
