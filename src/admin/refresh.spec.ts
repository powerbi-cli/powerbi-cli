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

import { refreshAction } from "./refresh";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/refresh.ts", () => {
    let validateAdminCapacityIdMock: SinonStub<unknown[], unknown>;
    let validateAllowedValuesMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const topOptions = {
        top: 1,
    };
    const topskipOptions = {
        top: 1,
        skip: 1,
    };
    const topskipErrorOptions = {
        top: "NA",
        skip: 1,
    };
    const expandOptions = {
        top: 1,
        skip: 1,
        expand: "workspaces",
    };
    const expandErrorOptions = {
        top: 1,
        skip: 1,
        expand: "NotValid",
    };
    const capacityOptions = {
        C: "capacity",
    };
    const allOptions = {
        C: "capacity",
        refreshableId: "62b72ecd-65de-4b3e-9b3e-4db2d8c3571b",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAdminCapacityIdMock = ImportMock.mockFunction(parameters, "validateAdminCapacityId");
        validateAllowedValuesMock = ImportMock.mockFunction(parameters, "validateAllowedValues");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAdminCapacityIdMock.restore();
        validateAllowedValuesMock.restore();
        executeAPICallMock.restore();
    });
    describe("refreshAction()", () => {
        it("refresh with --help", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => helpOptions,
            };
            refreshAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAdminCapacityIdMock.callCount).to.equal(0);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("refresh with no options", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => emptyOptions,
            };
            refreshAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=5000")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=0")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'top' options", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => topOptions,
            };
            refreshAction(topOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=0")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'top' and 'skip' options", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => topskipOptions,
            };
            refreshAction(topskipOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'top' and 'skip' options with error", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => topskipErrorOptions,
            };
            refreshAction(topskipErrorOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=5000")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'top', 'skip' and 'expand' options", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.resolves(expandOptions.expand);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => expandOptions,
            };
            refreshAction(expandOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("expand=groups")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'top', 'skip' and incorrect 'expand' options", (done) => {
            validateAdminCapacityIdMock.resolves(undefined);
            validateAllowedValuesMock.rejects(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => expandErrorOptions,
            };
            refreshAction(expandErrorOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("refresh with 'capacity' options", (done) => {
            validateAdminCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => capacityOptions,
            };
            refreshAction(capacityOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid/")).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("refresh with 'capacity' and 'refeshableId' options", (done) => {
            validateAdminCapacityIdMock.resolves("uuid");
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "refresh",
                opts: () => allOptions,
            };
            refreshAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("/uuid/")).to.greaterThan(-1);
                expect(request?.url?.indexOf(`/${allOptions.refreshableId}`)).to.greaterThan(-1);
                expect(validateAdminCapacityIdMock.callCount).to.equal(1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
