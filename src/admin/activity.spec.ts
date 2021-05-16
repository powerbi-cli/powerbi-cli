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
import * as api from "../lib/api";

import { activityAction } from "./activity";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/activity.ts", () => {
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const filterOptions = {
        filter: "filter",
    };
    const dateOptions = {
        date: "1900-01-01",
    };
    const dateTimeOptions = {
        date: "1900-01-01",
        startTime: 22,
        endTime: 23,
    };
    const tokenOptions = {
        continuationToken: "token",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        executeAPICallMock.restore();
    });
    describe("activityAction()", () => {
        it("activity with --help", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => helpOptions,
            };
            activityAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("activity with no options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => emptyOptions,
            };
            activityAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("activity with 'filterOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => filterOptions,
            };
            activityAction(filterOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("activity with 'dateOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => dateOptions,
            };
            activityAction(dateOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("startDateTime='1900-01-01T00%3A00%3A00.000Z'")).to.greaterThan(-1);
                expect(request?.url?.indexOf("endDateTime='1900-01-01T23%3A59%3A59.999Z'")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("activity with 'dateTimeOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => dateTimeOptions,
            };
            activityAction(dateTimeOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("startDateTime='1900-01-01T22%3A00%3A00.000Z'")).to.greaterThan(-1);
                expect(request?.url?.indexOf("endDateTime='1900-01-01T23%3A00%3A00.000Z'")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("activity with 'tokenOptions' options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "activity",
                opts: () => tokenOptions,
            };
            activityAction(tokenOptions, cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.url?.indexOf("continuationToken=token")).to.greaterThan(-1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
