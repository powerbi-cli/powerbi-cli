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
import * as api from "../../lib/api";

import { addAction } from "./add";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/key/add.ts", () => {
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const missingKVOptions = {
        name: "key",
    };
    const correctOptions = {
        name: "key",
        keyVaultURI: "uri",
    };
    const defaultOptions = {
        name: "key",
        keyVaultURI: "uri",
        default: true,
    };
    const allOptions = {
        name: "key",
        keyVaultURI: "uri",
        default: true,
        active: true,
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        executeAPICallMock.restore();
    });
    describe("addAction()", () => {
        it("add user with --help", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => helpOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with no options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => emptyOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with missing options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => missingKVOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("add user with minimal options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => correctOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request.body.name.indexOf(correctOptions.name)).to.greaterThan(-1);
                expect(request.body.keyVaultKeyIdentifier.indexOf(correctOptions.keyVaultURI)).to.greaterThan(-1);
                expect(request.body.activate).to.equal(false);
                expect(request.body.isDefault).to.equal(false);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("add user with default options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => defaultOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request.body.name.indexOf(defaultOptions.name)).to.greaterThan(-1);
                expect(request.body.keyVaultKeyIdentifier.indexOf(defaultOptions.keyVaultURI)).to.greaterThan(-1);
                expect(request.body.activate).to.equal(false);
                expect(request.body.isDefault).to.equal(true);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("add user with all options", (done) => {
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "add",
                opts: () => allOptions,
            };
            addAction(cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request.body.name.indexOf(allOptions.name)).to.greaterThan(-1);
                expect(request.body.keyVaultKeyIdentifier.indexOf(allOptions.keyVaultURI)).to.greaterThan(-1);
                expect(request.body.activate).to.equal(true);
                expect(request.body.isDefault).to.equal(true);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
