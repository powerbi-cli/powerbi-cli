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

import { listshowTileAction } from "./listshowtile";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("app/dashboard/listshow.ts", () => {
    let validateAppIdMock: SinonStub<unknown[], unknown>;
    let validateParameterMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        A: "appName",
    };
    const twoOptions = {
        A: "appName",
        D: "dashboardName",
    };
    const allOptions = {
        A: "appName",
        D: "dashboardName",
        T: "tileName",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAppIdMock = ImportMock.mockFunction(parameters, "validateAppId");
        validateParameterMock = ImportMock.mockFunction(parameters, "validateParameter");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAppIdMock.restore();
        validateParameterMock.restore();
        executeAPICallMock.restore();
    });
    describe("listshowTileAction()", () => {
        it("list with --help", (done) => {
            validateAppIdMock.resolves(undefined);
            validateParameterMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            listshowTileAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAppIdMock.callCount).to.equal(0);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with no options", (done) => {
            validateAppIdMock.resolves(undefined);
            validateParameterMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => emptyOptions,
            };
            listshowTileAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with one options", (done) => {
            validateAppIdMock.resolves(oneOptions.A);
            validateParameterMock.onCall(0).resolves(undefined);
            validateParameterMock.onCall(1).resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => oneOptions,
            };
            listshowTileAction(oneOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with two options", (done) => {
            validateAppIdMock.resolves(twoOptions.A);
            validateParameterMock.onCall(0).resolves(twoOptions.D);
            validateParameterMock.onCall(1).resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => twoOptions,
            };
            listshowTileAction(twoOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with all options", (done) => {
            validateAppIdMock.resolves(allOptions.A);
            validateParameterMock.onCall(0).resolves(allOptions.D);
            validateParameterMock.onCall(1).resolves(allOptions.T);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => allOptions,
            };
            listshowTileAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("show with no options", (done) => {
            validateAppIdMock.rejects();
            validateParameterMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => emptyOptions,
            };
            listshowTileAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with one options", (done) => {
            validateAppIdMock.resolves(oneOptions.A);
            validateParameterMock.onCall(0).rejects();
            validateParameterMock.onCall(1).rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => oneOptions,
            };
            listshowTileAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with two options", (done) => {
            validateAppIdMock.resolves(twoOptions.A);
            validateParameterMock.onCall(0).resolves(twoOptions.D);
            validateParameterMock.onCall(1).rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => twoOptions,
            };
            listshowTileAction(twoOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with all options", (done) => {
            validateAppIdMock.resolves(allOptions.A);
            validateParameterMock.onCall(0).resolves(allOptions.D);
            validateParameterMock.onCall(1).resolves(allOptions.T);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => allOptions,
            };
            listshowTileAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAppIdMock.callCount).to.equal(1);
                expect(validateParameterMock.callCount).to.equal(2);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
