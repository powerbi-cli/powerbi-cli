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

import { ModuleCommand } from "../../../lib/command";
import * as parameters from "../../../lib/parameters";
import * as api from "../../../lib/api";

import { addAction } from "./add";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("gateway/datasource/add.ts", () => {
    let validateGatewayIdMock: SinonStub<unknown[], unknown>;
    let validateGatewayDatasourceIdMock: SinonStub<unknown[], unknown>;
    let validateParameterMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
    };
    const incorrectTypeOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
        accessRight: "App",
        principalType: "Viewer",
    };
    const allOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        email: "email",
        accessRight: "App",
        principalType: "Admin",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGatewayIdMock = ImportMock.mockFunction(parameters, "validateGatewayId");
        validateGatewayDatasourceIdMock = ImportMock.mockFunction(parameters, "validateGatewayDatasourceId");
        validateParameterMock = ImportMock.mockFunction(parameters, "validateParameter");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGatewayIdMock.restore();
        validateGatewayDatasourceIdMock.restore();
        validateParameterMock.restore();
        executeAPICallMock.restore();
    });
    describe("addAction()", () => {
        it("add with --help", (done) => {
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => helpOptions,
            };
            addAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGatewayIdMock.callCount).to.equal(0);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with no options", (done) => {
            validateGatewayIdMock.rejects();
            validateGatewayDatasourceIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => emptyOptions,
            };
            addAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(0);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with missing options", (done) => {
            validateGatewayIdMock.resolves(missingOptions.G);
            validateGatewayDatasourceIdMock.rejects(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => missingOptions,
            };
            addAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with incorrect options", (done) => {
            validateGatewayIdMock.resolves(incorrectTypeOptions.G);
            validateGatewayDatasourceIdMock.resolves(incorrectTypeOptions.D);
            validateParameterMock.onFirstCall().resolves(incorrectTypeOptions.accessRight);
            validateParameterMock.onSecondCall().rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => incorrectTypeOptions,
            };
            addAction(incorrectTypeOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add with all options", (done) => {
            validateGatewayIdMock.resolves(allOptions.G);
            validateGatewayDatasourceIdMock.resolves(allOptions.D);
            validateParameterMock.onFirstCall().resolves(allOptions.accessRight);
            validateParameterMock.onSecondCall().resolves(allOptions.principalType);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => allOptions,
            };
            addAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGatewayIdMock.callCount).to.equal(1);
                expect(validateGatewayDatasourceIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
