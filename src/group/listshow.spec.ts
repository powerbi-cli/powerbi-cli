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

import { listshowAction } from "./listshow";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("group/listshow.ts", () => {
    let validateParameterMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const myOptions = {
        W: "my",
    };
    const guidOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateParameterMock = ImportMock.mockFunction(parameters, "validateParameter");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateParameterMock.restore();
        executeAPICallMock.restore();
    });
    describe("listshowAction()", () => {
        it("list with --help", (done) => {
            validateParameterMock.resolves(guidOptions.W);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            listshowAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateParameterMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("list with no options", (done) => {
            validateParameterMock.resolves(guidOptions.W);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => emptyOptions,
            };
            listshowAction(emptyOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'my' options", (done) => {
            validateParameterMock.resolves(guidOptions.W);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => myOptions,
            };
            listshowAction(myOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("list with 'guid' options", (done) => {
            validateParameterMock.resolves(guidOptions.W);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => guidOptions,
            };
            listshowAction(guidOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("show with no options", (done) => {
            validateParameterMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => emptyOptions,
            };
            listshowAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("show with 'my' options", (done) => {
            validateParameterMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => myOptions,
            };
            listshowAction(myOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("show with 'guid' options", (done) => {
            validateParameterMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "show",
                opts: () => guidOptions,
            };
            listshowAction(guidOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateParameterMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
