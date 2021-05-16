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

import { datasourceAction } from "./datasource";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/dataset/datasource.ts", () => {
    let validateAdminObjectIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const allOptions = {
        D: "dataset",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAdminObjectIdMock = ImportMock.mockFunction(parameters, "validateAdminObjectId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAdminObjectIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("datasourceAction()", () => {
        it("datasource with --help", (done) => {
            validateAdminObjectIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => helpOptions,
            };
            datasourceAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("datasource with no options", (done) => {
            validateAdminObjectIdMock.rejects(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => emptyOptions,
            };
            datasourceAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminObjectIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("datasource with options", (done) => {
            validateAdminObjectIdMock.resolves("uuid");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "datasource",
                opts: () => allOptions,
            };
            datasourceAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("datasets/uuid/")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
