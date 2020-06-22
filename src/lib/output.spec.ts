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

import chai from "chai";
import { ImportMock } from "ts-mock-imports";
import { formatAndPrintOutput, OutputType } from "./output";
import { SinonSpy } from "sinon";

import yml from "js-yaml";
import jmespath from "jmespath";
import fs from "fs";

const expect = chai.expect;

describe("output.ts", () => {
    const response = [
        {
            name: "name 2",
            id: 1,
        },
        {
            name: "name 2",
            id: 2,
        },
    ];
    const responseStr = JSON.stringify(response);
    const responseJson = JSON.parse(responseStr);
    const responseYml = yml.safeDump(responseJson);
    let writeFileSyncMock: SinonSpy<unknown[], unknown>;
    let jsonStringifyMock: SinonSpy<unknown[], unknown>;
    let safeDumpMock: SinonSpy<unknown[], unknown>;
    let jmespathMock: SinonSpy<unknown[], unknown>;
    let consoleInfoMock: SinonSpy<unknown[], unknown>;
    let consoleErrorMock: SinonSpy<unknown[], unknown>;
    beforeEach(() => {
        writeFileSyncMock = ImportMock.mockFunction(fs, "writeFileSync");
        jsonStringifyMock = ImportMock.mockFunction(JSON, "stringify").returns(responseStr);
        safeDumpMock = ImportMock.mockFunction(yml, "safeDump").returns(responseYml);
        jmespathMock = ImportMock.mockFunction(jmespath, "search").returns({ id: "1" });
        consoleInfoMock = ImportMock.mockFunction(console, "info", true);
        consoleErrorMock = ImportMock.mockFunction(console, "error", true);
    });
    afterEach(() => {
        writeFileSyncMock.restore();
        jsonStringifyMock.restore();
        safeDumpMock.restore();
        jmespathMock.restore();
        consoleInfoMock.restore();
        consoleErrorMock.restore();
    });
    describe("formatAndPrintOutput()", () => {
        it("output-file", () => {
            formatAndPrintOutput(responseJson, OutputType.json, "file");
            expect(writeFileSyncMock.callCount).equal(1);
            expect(jsonStringifyMock.callCount).equal(2);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(0);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output JSON", () => {
            formatAndPrintOutput(responseJson, OutputType.json);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(2);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output YML", () => {
            formatAndPrintOutput(responseJson, OutputType.yml);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(1);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(1);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output TSV", () => {
            formatAndPrintOutput(responseJson, OutputType.tsv);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(1);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output RAW", () => {
            formatAndPrintOutput(responseJson, OutputType.raw, "file.pbix");
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(0);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(0);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output JSON, query '[?name=='name 1'].{id:id}'", () => {
            formatAndPrintOutput(responseJson, OutputType.json, undefined, "[?name=='name 1'].{id:id}");
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(2);
            expect(jmespathMock.callCount).equal(1);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output TSV, query '[?name=='name 3'].{id:id}' => no result", () => {
            formatAndPrintOutput(responseJson, OutputType.tsv, undefined, "[?name=='name 3'].{id:id}");
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(1);
            expect(jmespathMock.callCount).equal(1);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("output JSON, error in query", () => {
            formatAndPrintOutput(responseJson, OutputType.json, undefined, "[?name==name 1'].{id:id}");
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(2);
            expect(jmespathMock.callCount).equal(1);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(1);
            expect(consoleErrorMock.callCount).equal(0);
        });
        it("no response", () => {
            formatAndPrintOutput("", OutputType.json);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(jsonStringifyMock.callCount).equal(0);
            expect(jmespathMock.callCount).equal(0);
            expect(safeDumpMock.callCount).equal(0);
            expect(consoleInfoMock.callCount).equal(0);
            expect(consoleErrorMock.callCount).equal(0);
        });
    });
});
