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

import { restoreAction } from "./restore";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/group/restore.ts", () => {
    let validateAdminGroupIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const groupOptions = {
        G: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const groupOwnerOptions = {
        G: "name",
        owner: "owner@contoso.com",
    };
    const allOptions = {
        G: "name",
        owner: "owner@contoso.com",
        name: "other",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAdminGroupIdMock = ImportMock.mockFunction(parameters, "validateAdminGroupId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateAdminGroupIdMock.restore();
        executeAPICallMock.restore();
    });
    describe("restoreAction()", () => {
        it("restore with --help", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "restore",
                opts: () => helpOptions,
            };
            restoreAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("restore with no options", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "restore",
                opts: () => emptyOptions,
            };
            restoreAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("restore with 'group' options", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "restore",
                opts: () => groupOptions,
            };
            restoreAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("restore with 'group' and 'owner' options", (done) => {
            validateAdminGroupIdMock.resolves("c2a995d2-cd03-4b32-be5b-3bf93d211a56");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "restore",
                opts: () => groupOwnerOptions,
            };
            restoreAction(cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.body.name).to.equal(groupOwnerOptions.G);
                expect(request?.body.emailAddress).to.equal(groupOwnerOptions.owner);
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("restore with 'group', 'owner' and 'name' options", (done) => {
            validateAdminGroupIdMock.resolves("c2a995d2-cd03-4b32-be5b-3bf93d211a56");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "restore",
                opts: () => allOptions,
            };
            restoreAction(cmdOptsMock as ModuleCommand).then(() => {
                const request = executeAPICallMock.args[0][0] as api.APICall;
                expect(request?.body.name).to.equal(allOptions.name);
                expect(request?.body.emailAddress).to.equal(allOptions.owner);
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
