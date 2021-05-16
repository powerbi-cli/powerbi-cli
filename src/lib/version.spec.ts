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
import { SinonStub } from "sinon";
import fetch from "node-fetch";

import { checkVersion, currentVersion } from "./version";

const expect = chai.expect;

describe("version.ts", () => {
    let fetchMock: SinonStub<unknown[], unknown>;
    let consoleInfoMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        fetchMock = ImportMock.mockFunction(fetch).resolves("");
        consoleInfoMock = ImportMock.mockFunction(console, "info", true);
    });
    afterEach(() => {
        fetchMock.restore();
        consoleInfoMock.restore();
    });
    describe("checkVersion", () => {
        it("normal check with '-v' argument", (done) => {
            const args = ["-v"];
            checkVersion(args).then(() => {
                expect(consoleInfoMock.callCount).equal(0);
                done();
            });
        });
    });
    describe("version validation", () => {
        it("check currentVersion with package.json", () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const version = require("../../package.json").version as string;
            expect(currentVersion).equal(version);
        });
        it("check currentVersion with package-lock.json", () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const version = require("../../package-lock.json").version as string;
            expect(currentVersion).equal(version);
        });
    });
});
