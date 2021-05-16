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

import { startstopAction } from "./startstop";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("embedded/startstop.ts", () => {
    let validateSubscriptionMock: SinonStub<unknown[], unknown>;
    let validateResourceGroupMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const missingtwoOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const missingOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
    };
    const allOptions = {
        S: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "resourcegroup",
        C: "capacity",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateSubscriptionMock = ImportMock.mockFunction(parameters, "validateSubscriptionId");
        validateResourceGroupMock = ImportMock.mockFunction(parameters, "validateResourceGroupId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateSubscriptionMock.restore();
        validateResourceGroupMock.restore();
        executeAPICallMock.restore();
    });
    describe("startstopAction()", () => {
        ["start", "stop"].forEach((cmd) => {
            it(`${cmd} with --help`, (done) => {
                validateSubscriptionMock.rejects();
                validateResourceGroupMock.rejects();
                executeAPICallMock.resolves(true);
                const cmdOptsMock: unknown = {
                    name: () => cmd,
                    opts: () => helpOptions,
                };
                startstopAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                    expect(validateSubscriptionMock.callCount).to.equal(0);
                    expect(validateResourceGroupMock.callCount).to.equal(0);
                    expect(executeAPICallMock.callCount).to.equal(0);
                    done();
                });
            });
            it(`${cmd} with two option missing`, (done) => {
                validateSubscriptionMock.resolves(missingtwoOptions.S);
                validateResourceGroupMock.rejects();
                executeAPICallMock.resolves(true);
                const cmdOptsMock: unknown = {
                    name: () => cmd,
                    opts: () => missingtwoOptions,
                };
                startstopAction(missingtwoOptions, cmdOptsMock as ModuleCommand).catch(() => {
                    expect(validateSubscriptionMock.callCount).to.equal(1);
                    expect(validateResourceGroupMock.callCount).to.equal(1);
                    expect(executeAPICallMock.callCount).to.equal(0);
                    done();
                });
            });
            it(`${cmd} with one option missing`, (done) => {
                validateSubscriptionMock.resolves(missingOptions.S);
                validateResourceGroupMock.resolves(missingOptions.R);
                executeAPICallMock.resolves(true);
                const cmdOptsMock: unknown = {
                    name: () => cmd,
                    opts: () => missingOptions,
                };
                startstopAction(missingOptions, cmdOptsMock as ModuleCommand).catch(() => {
                    expect(validateSubscriptionMock.callCount).to.equal(1);
                    expect(validateResourceGroupMock.callCount).to.equal(1);
                    expect(executeAPICallMock.callCount).to.equal(0);
                    done();
                });
            });
            it(`${cmd} with no options missing`, (done) => {
                validateSubscriptionMock.resolves(missingOptions.S);
                validateResourceGroupMock.resolves(missingOptions.R);
                executeAPICallMock.resolves(true);
                const cmdOptsMock: unknown = {
                    name: () => cmd,
                    opts: () => allOptions,
                };
                startstopAction(allOptions, cmdOptsMock as ModuleCommand).then(() => {
                    expect(validateSubscriptionMock.callCount).to.equal(1);
                    expect(validateResourceGroupMock.callCount).to.equal(1);
                    expect(executeAPICallMock.callCount).to.equal(1);
                    done();
                });
            });
        });
    });
});
