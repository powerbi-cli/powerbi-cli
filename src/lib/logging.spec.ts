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
import { SinonSpy } from "sinon";
import { debug, verbose } from "./logging";

const expect = chai.expect;

describe("logging.ts", () => {
    let mock: SinonSpy<unknown[], unknown>;
    beforeEach(() => {
        mock = ImportMock.mockFunction(console, "debug", "txt");
    });
    afterEach(() => {
        mock.restore();
        process.env.DEBUG = undefined;
        process.env.VERBOSE = undefined;
    });
    describe("debug()", () => {
        it("DEBUG none, VERBOSE none", () => {
            process.env.DEBUG = undefined;
            process.env.VERBOSE = undefined;
            debug("");
            expect(mock.callCount).equal(0);
        });
        it("DEBUG none, VERBOSE false", () => {
            process.env.DEBUG = undefined;
            process.env.VERBOSE = "false";
            debug("");
            expect(mock.callCount).equal(0);
        });
        it("DEBUG none, VERBOSE true", () => {
            process.env.DEBUG = undefined;
            process.env.VERBOSE = "true";
            debug("");
            expect(mock.callCount).equal(1);
        });
        it("DEBUG false, VERBOSE none", () => {
            process.env.DEBUG = "false";
            process.env.VERBOSE = undefined;
            debug("");
            expect(mock.callCount).equal(0);
        });
        it("DEBUG false, VERBOSE false", () => {
            process.env.DEBUG = "false";
            process.env.VERBOSE = "false";
            debug("");
            expect(mock.callCount).equal(0);
        });
        it("DEBUG false, VERBOSE true", () => {
            process.env.DEBUG = "false";
            process.env.VERBOSE = "true";
            debug("");
            expect(mock.callCount).equal(1);
        });
        it("DEBUG true, VERBOSE none", () => {
            process.env.DEBUG = "true";
            process.env.VERBOSE = undefined;
            debug("");
            expect(mock.callCount).equal(1);
        });
        it("DEBUG true, VERBOSE false", () => {
            process.env.DEBUG = "true";
            process.env.VERBOSE = "false";
            debug("");
            expect(mock.callCount).equal(1);
        });
        it("DEBUG true, VERBOSE true", () => {
            process.env.DEBUG = "true";
            process.env.VERBOSE = "false";
            debug("");
            expect(mock.callCount).equal(1);
        });
    });
    describe("verbose()", () => {
        it("VERBOSE none", () => {
            process.env.VERBOSE = undefined;
            verbose("");
            expect(mock.callCount).equal(0);
        });
        it("VERBOSE false", () => {
            process.env.VERBOSE = "false";
            verbose("");
            expect(mock.callCount).equal(0);
        });
        it("VERBOSE true", () => {
            process.env.VERBOSE = "true";
            verbose("");
            expect(mock.callCount).equal(1);
        });
    });
});
