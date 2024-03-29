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

import { listAction } from "./list";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/pipeline/list.ts", () => {
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
        expand: "users",
    };
    const expandErrorOptions = {
        top: 1,
        skip: 1,
        expand: "NotValid",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAllowedValuesMock = ImportMock.mockFunction(parameters, "validateAllowedValues");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAllowedValuesMock.restore();
        executeAPICallMock.restore();
    });
    describe("listAction()", () => {
        it("list with --help", (done) => {
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            listAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with no options", (done) => {
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => emptyOptions,
            };
            listAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=5000")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=0")).to.greaterThan(-1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'top' options", (done) => {
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => topOptions,
            };
            listAction(topOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=0")).to.greaterThan(-1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'top' and 'skip' options", (done) => {
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => topskipOptions,
            };
            listAction(topskipOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'top' and 'skip' options with error", (done) => {
            validateAllowedValuesMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => topskipErrorOptions,
            };
            listAction(topskipErrorOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=5000")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(validateAllowedValuesMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'top', 'skip' and 'expand' options", (done) => {
            validateAllowedValuesMock.resolves(expandOptions.expand);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => expandOptions,
            };
            listAction(expandOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("top=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("skip=1")).to.greaterThan(-1);
                expect(request?.url?.indexOf("expand=users")).to.greaterThan(-1);
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'top', 'skip' and incorrect 'expand' options", (done) => {
            validateAllowedValuesMock.rejects(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => expandErrorOptions,
            };
            listAction(expandErrorOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAllowedValuesMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
    });
});
