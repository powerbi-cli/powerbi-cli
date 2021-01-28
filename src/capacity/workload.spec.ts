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

import { workloadAction } from "./workload";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("capacity/workload.ts", () => {
    let validateCapacityIdMock: SinonStub<unknown[], unknown>;
    let validateAllowedValuesMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const capacityOptions = {
        C: "capacity",
    };
    const workloadOptions = {
        C: "capacity",
        workload: "dataflows",
    };
    const disableOptions = {
        C: "capacity",
        workload: "dataflows",
        state: "disabled",
    };
    const enableOptions = {
        C: "capacity",
        workload: "dataflows",
        state: "enabled",
        memory: "40",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateCapacityIdMock = ImportMock.mockFunction(parameters, "validateCapacityId");
        validateAllowedValuesMock = ImportMock.mockFunction(parameters, "validateAllowedValues");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateCapacityIdMock.restore();
        validateAllowedValuesMock.restore();
        executeAPICallMock.restore();
    });
    describe("workloadAction()", () => {
        it("workload with --help", (done) => {
            validateCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => helpOptions,
            };
            workloadAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateCapacityIdMock.callCount).to.equal(0);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("workload with no options", (done) => {
            validateCapacityIdMock.rejects(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => emptyOptions,
            };
            workloadAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("workload with 'capacity' options", (done) => {
            validateCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => capacityOptions,
            };
            workloadAction(capacityOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid")).to.greaterThan(-1);
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("workload with 'capacity' and 'workload' options", (done) => {
            validateCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => workloadOptions,
            };
            workloadAction(workloadOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid")).to.greaterThan(-1);
                expect(request?.url?.indexOf("/dataflows")).to.greaterThan(-1);
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("workload with 'capacity', 'workload' and 'state' options", (done) => {
            validateCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(disableOptions.state);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => disableOptions,
            };
            workloadAction(disableOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid")).to.greaterThan(-1);
                expect(request?.url?.indexOf("/dataflows")).to.greaterThan(-1);
                expect(request.body.state).to.equal("Disabled");
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("workload with 'capacity', 'workload', 'state' and 'memory' options", (done) => {
            validateCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(enableOptions.state);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "workload",
                opts: () => enableOptions,
            };
            workloadAction(enableOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid")).to.greaterThan(-1);
                expect(request?.url?.indexOf("/dataflows")).to.greaterThan(-1);
                expect(request.body.state).to.equal("Enabled");
                expect(request.body.maxMemoryPercentageSetByUser).to.equal("40");
                expect(validateCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
