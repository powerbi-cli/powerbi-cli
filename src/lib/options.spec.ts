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

import fs from "fs";
import { getOptionContent } from "./options";

const expect = chai.expect;

describe("options.ts", () => {
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
        readFileSyncMock.returns("{}");
    });
    afterEach(() => {
        readFileSyncMock.restore();
    });
    describe("getOptionContent()", () => {
        it("no option", () => {
            expect(getOptionContent()).be.undefined;
        });
        it("regular option", () => {
            expect(getOptionContent("regular")).be.equal("regular");
        });
        it("file option", () => {
            expect(getOptionContent("@file")).be.equal("{}");
        });
    });
});
