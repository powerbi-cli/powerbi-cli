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

import { APICall, executeAPICall } from "./api";

import * as rest from "./rest";
import * as output from "./output";

const expect = chai.expect;

describe("api.ts", () => {
    let executeRestCallMock: SinonStub<unknown[], unknown>;
    let formatAndPrintOutputMock: SinonStub<unknown[], unknown>;
    let request: APICall;
    beforeEach(() => {
        executeRestCallMock = ImportMock.mockFunction(rest, "executeRestCall");
        formatAndPrintOutputMock = ImportMock.mockFunction(output, "formatAndPrintOutput");
        request = {
            method: "GET",
            url: "",
        };
    });
    afterEach(() => {
        executeRestCallMock.restore();
        formatAndPrintOutputMock.restore();
    });
    describe("executeAPICall()", () => {
        it("correct execution", (done) => {
            executeRestCallMock.resolves("");
            formatAndPrintOutputMock.returns(null);
            executeAPICall(request).then(() => {
                expect(executeRestCallMock.callCount).equal(1);
                expect(formatAndPrintOutputMock.callCount).equal(1);
                done();
            });
        });
        it("formatAndPrintOutput error", (done) => {
            executeRestCallMock.resolves("");
            formatAndPrintOutputMock.throws();
            executeAPICall(request).catch(() => {
                expect(executeRestCallMock.callCount).equal(1);
                expect(formatAndPrintOutputMock.callCount).equal(1);
                done();
            });
        });
        it("executeRestCall reject", (done) => {
            executeRestCallMock.rejects("");
            formatAndPrintOutputMock.returns(null);
            executeAPICall(request).catch(() => {
                expect(executeRestCallMock.callCount).equal(1);
                expect(formatAndPrintOutputMock.callCount).equal(0);
                done();
            });
        });
        it("executeRestCall error", (done) => {
            executeRestCallMock.throws();
            formatAndPrintOutputMock.returns(null);
            executeAPICall(request).catch(() => {
                expect(executeRestCallMock.callCount).equal(1);
                expect(formatAndPrintOutputMock.callCount).equal(0);
                done();
            });
        });
    });
});
