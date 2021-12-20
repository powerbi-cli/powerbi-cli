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

import { updateAction } from "./update";

import fs from "fs";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("embedded/update.ts", () => {
    let validateSubscriptionMock: SinonStub<unknown[], unknown>;
    let validateResourceGroupMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const missingtwoOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
    };
    const missingOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
        C: "capacity",
    };
    const allOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
        C: "capacity",
        parameter: "{}",
    };
    const allFileOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
        C: "capacity",
        parameterFile: "",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateSubscriptionMock = ImportMock.mockFunction(parameters, "validateSubscriptionId");
        validateResourceGroupMock = ImportMock.mockFunction(parameters, "validateResourceGroupId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
    });
    afterEach(() => {
        validateSubscriptionMock.restore();
        validateResourceGroupMock.restore();
        executeAPICallMock.restore();
        readFileSyncMock.restore();
    });
    describe("updateAction()", () => {
        it("update with --help", (done) => {
            validateSubscriptionMock.resolves(undefined);
            validateResourceGroupMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => helpOptions,
            };
            updateAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateSubscriptionMock.callCount).to.equal(0);
                expect(validateResourceGroupMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with no options", (done) => {
            validateSubscriptionMock.rejects();
            validateResourceGroupMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => emptyOptions,
            };
            updateAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with one options", (done) => {
            validateSubscriptionMock.resolves(oneOptions.S);
            validateResourceGroupMock.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => oneOptions,
            };
            updateAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with two missing options", (done) => {
            validateSubscriptionMock.resolves(missingOptions.S);
            validateResourceGroupMock.resolves(missingOptions.R);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => missingtwoOptions,
            };
            updateAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with one missing options", (done) => {
            validateSubscriptionMock.resolves(missingOptions.S);
            validateResourceGroupMock.resolves(missingOptions.R);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => missingOptions,
            };
            updateAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with all options", (done) => {
            validateSubscriptionMock.resolves(allOptions.S);
            validateResourceGroupMock.resolves(allOptions.R);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => allOptions,
            };
            updateAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with all options (file)", (done) => {
            validateSubscriptionMock.resolves(allOptions.S);
            validateResourceGroupMock.resolves(allOptions.R);
            executeAPICallMock.resolves(true);
            readFileSyncMock.returns("{}");
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => allFileOptions,
            };
            updateAction(allFileOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateSubscriptionMock.callCount).to.equal(1);
                expect(validateResourceGroupMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
