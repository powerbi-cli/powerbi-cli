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

import { cloneAction } from "./clone";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("dashboard/tile/clone.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateDashboardIdMock: SinonStub<unknown[], unknown>;
    let validateDashboardTileIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const twoOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const threeOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        T: "tileName",
    };
    const allOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        D: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        T: "tileName",
        destDashboard: "dashboard",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateDashboardIdMock = ImportMock.mockFunction(parameters, "validateDashboardId");
        validateDashboardTileIdMock = ImportMock.mockFunction(parameters, "validateDashboardTileId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateDashboardIdMock.restore();
        validateDashboardTileIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("cloneAction()", () => {
        it("clone with --help", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateDashboardIdMock.resolves(undefined);
            validateDashboardTileIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateDashboardIdMock.callCount).to.equal(0);
                expect(validateDashboardTileIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with no options", (done) => {
            validateGroupIdMock.rejects();
            validateDashboardIdMock.rejects();
            validateDashboardTileIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => emptyOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDashboardIdMock.callCount).to.equal(0);
                expect(validateDashboardTileIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateDashboardIdMock.rejects();
            validateDashboardTileIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => oneOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDashboardIdMock.callCount).to.equal(1);
                expect(validateDashboardTileIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with two options", (done) => {
            validateGroupIdMock.resolves(twoOptions.W);
            validateDashboardIdMock.resolves(twoOptions.D);
            validateDashboardTileIdMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => twoOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDashboardIdMock.callCount).to.equal(1);
                expect(validateDashboardTileIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with three options", (done) => {
            validateGroupIdMock.resolves(threeOptions.W);
            validateDashboardIdMock.resolves(threeOptions.D);
            validateDashboardTileIdMock.resolves(threeOptions.T);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => threeOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDashboardIdMock.callCount).to.equal(1);
                expect(validateDashboardTileIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with all options", (done) => {
            validateGroupIdMock.resolves(allOptions.W);
            validateDashboardIdMock.resolves(allOptions.D);
            validateDashboardTileIdMock.resolves(allOptions.T);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => allOptions,
            };
            cloneAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateDashboardIdMock.callCount).to.equal(1);
                expect(validateDashboardTileIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
