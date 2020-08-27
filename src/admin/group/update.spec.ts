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

import { updateAction } from "./update";

import fs from "fs";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("admin/group/update.ts", () => {
    let validateAdminGroupIdMock: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const groupOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const detailsOptions = {
        W: "name",
        updateDetails: {},
    };
    const fileOptions = {
        W: "name",
        updateDetailsFile: "file.json",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateAdminGroupIdMock = ImportMock.mockFunction(parameters, "validateAdminGroupId");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
    });
    afterEach(() => {
        validateAdminGroupIdMock.restore();
        executeAPICallMock.restore();
        readFileSyncMock.restore();
    });
    describe("updateAction()", () => {
        it("update with --help", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => helpOptions,
            };
            updateAction(cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with no options", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => emptyOptions,
            };
            updateAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with 'group' options", (done) => {
            validateAdminGroupIdMock.resolves(undefined);
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => groupOptions,
            };
            updateAction(cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("update with 'group' and 'details' options", (done) => {
            validateAdminGroupIdMock.resolves("c2a995d2-cd03-4b32-be5b-3bf93d211a56");
            readFileSyncMock.resolves({});
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => detailsOptions,
            };
            updateAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("update with 'group' and 'details file' options", (done) => {
            validateAdminGroupIdMock.resolves("c2a995d2-cd03-4b32-be5b-3bf93d211a56");
            readFileSyncMock.resolves({});
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "update",
                opts: () => fileOptions,
            };
            updateAction(cmdOptsMock as ModuleCommand).then(() => {
                expect(validateAdminGroupIdMock.callCount).to.equal(1);
                expect(readFileSyncMock.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
    });
});
