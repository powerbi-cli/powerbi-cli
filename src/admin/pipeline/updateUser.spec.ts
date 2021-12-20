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

import { updateUserAction } from "./updateUser";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/pipeline/updateUser.ts", () => {
    let validateAdminObjectIdMock: SinonStub<unknown[], unknown>;
    let validateParameterMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        identifier: "email",
    };
    const incorrectTypeOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        identifier: "email",
        accessRight: "App",
        principalType: "Viewer",
    };
    const allOptions = {
        P: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        identifier: "email",
        accessRight: "App",
        principalType: "Admin",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAdminObjectIdMock = ImportMock.mockFunction(parameters, "validateAdminObjectId");
        validateParameterMock = ImportMock.mockFunction(parameters, "validateParameter");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAdminObjectIdMock.restore();
        validateParameterMock.restore();
        executeAPICallMock.restore();
    });
    describe("addUserAction()", () => {
        it("add user with --help", (done) => {
            validateAdminObjectIdMock.resolves(undefined);
            validateParameterMock.resolves(true);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => helpOptions,
            };
            updateUserAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(0);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with no options", (done) => {
            validateAdminObjectIdMock.resolves(undefined);
            validateParameterMock.resolves(true);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => emptyOptions,
            };
            updateUserAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with missing options", (done) => {
            validateAdminObjectIdMock.resolves(missingOptions.P);
            validateParameterMock.onFirstCall().rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => missingOptions,
            };
            updateUserAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with incorrect type options", (done) => {
            validateAdminObjectIdMock.resolves(incorrectTypeOptions.P);
            validateParameterMock.onFirstCall().resolves(incorrectTypeOptions.accessRight);
            validateParameterMock.onSecondCall().rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => incorrectTypeOptions,
            };
            updateUserAction(incorrectTypeOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with options", (done) => {
            validateAdminObjectIdMock.resolves(allOptions.P);
            validateParameterMock.onFirstCall().resolves(allOptions.accessRight);
            validateParameterMock.onSecondCall().resolves(allOptions.principalType);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => allOptions,
            };
            updateUserAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
