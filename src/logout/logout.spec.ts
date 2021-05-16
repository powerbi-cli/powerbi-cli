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
import * as token from "../lib/token";
import * as logging from "../lib/logging";

import { logoutAction } from "./logout";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("logout/logout.ts", () => {
    let removeAccessTokenMock: SinonStub<unknown[], unknown>;
    let debugMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const helpOptions = { H: true };
    beforeEach(() => {
        removeAccessTokenMock = ImportMock.mockFunction(token, "removeAccessToken");
        debugMock = ImportMock.mockFunction(logging, "debug").returns(true);
    });
    afterEach(() => {
        removeAccessTokenMock.restore();
        debugMock.restore();
    });
    describe("logoutAction()", () => {
        it("logout with --help", () => {
            removeAccessTokenMock.returns(true);
            const cmdOptsMock: unknown = {
                name: () => "logout",
                opts: () => helpOptions,
            };
            expect(logoutAction(helpOptions, cmdOptsMock as ModuleCommand)).not.to.throw;
            expect(removeAccessTokenMock.callCount).to.equal(0);
        });
        it("logout with no options", () => {
            removeAccessTokenMock.returns(true);
            const cmdOptsMock: unknown = {
                name: () => "logout",
                opts: () => emptyOptions,
            };
            expect(logoutAction(emptyOptions, cmdOptsMock as ModuleCommand)).not.to.throw;
            expect(removeAccessTokenMock.callCount).to.equal(1);
        });
    });
});
