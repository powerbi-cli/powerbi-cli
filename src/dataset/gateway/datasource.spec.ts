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

import { datasourceGatewayAction } from "./datasource";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("dataset/gateway/datasource.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateDatasetIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "datasetName",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateDatasetIdMock = ImportMock.mockFunction(parameters, "validateDatasetId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateDatasetIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("datasourceGatewayAction()", () => {
        it("datasource with --help", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateDatasetIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => helpOptions,
            };
            datasourceGatewayAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateDatasetIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("datasource with no options", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateDatasetIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => emptyOptions,
            };
            datasourceGatewayAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("datasource with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateDatasetIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => oneOptions,
            };
            datasourceGatewayAction(oneOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("datasource with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateDatasetIdMock.resolves(allOptions.D);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => allOptions,
            };
            datasourceGatewayAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("show with no options", (done) => {
            validateGroupIdMock.rejects();
            validateDatasetIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => emptyOptions,
            };
            datasourceGatewayAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateDatasetIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => oneOptions,
            };
            datasourceGatewayAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateDatasetIdMock.resolves(allOptions.D);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => allOptions,
            };
            datasourceGatewayAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDatasetIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
