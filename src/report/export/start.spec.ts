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

import { startExportAction } from "./start";

chai.use(chaiAsPromise);
const expect = chai.expect;

describe("report/export/start.ts", () => {
    let validateGroupIdMock: SinonStub<unknown[], unknown>;
    let validateReportIdMock: SinonStub<unknown[], unknown>;
    let validateAllowedValues: SinonStub<unknown[], unknown>;
    let executeAPICallMock: SinonStub<unknown[], unknown>;
    const emptyOptions = {};
    const oneOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const twoOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
    };
    const pbixOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        format: "pbix",
    };
    const pptxOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        format: "pptx",
    };
    const xlsxOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        format: "pptx",
        config: "{}",
    };
    const xlsxOptionsFile = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        format: "pptx",
        configFile: "",
    };
    const zipOptions = {
        W: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        R: "c2a995d2-cd03-4b32-be5b-3bf93d211a56",
        format: "zip",
    };
    const helpOptions = { H: true };
    beforeEach(() => {
        validateGroupIdMock = ImportMock.mockFunction(parameters, "validateGroupId");
        validateReportIdMock = ImportMock.mockFunction(parameters, "validateReportId");
        validateAllowedValues = ImportMock.mockFunction(parameters, "validateAllowedValues");
        executeAPICallMock = ImportMock.mockFunction(api, "executeAPICall");
    });
    afterEach(() => {
        validateGroupIdMock.restore();
        validateReportIdMock.restore();
        validateAllowedValues.restore();
        executeAPICallMock.restore();
    });
    describe("startExportAction()", () => {
        it("start with --help", (done) => {
            validateGroupIdMock.resolves(undefined);
            validateReportIdMock.resolves(undefined);
            validateAllowedValues.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "list",
                opts: () => helpOptions,
            };
            startExportAction(helpOptions, cmdOptsMock as ModuleCommand).finally(() => {
                expect(validateGroupIdMock.callCount).to.equal(0);
                expect(validateReportIdMock.callCount).to.equal(0);
                expect(validateAllowedValues.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("start with no options", (done) => {
            validateGroupIdMock.rejects();
            validateReportIdMock.rejects();
            validateAllowedValues.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => emptyOptions,
            };
            startExportAction(emptyOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(0);
                expect(validateAllowedValues.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("start with one options", (done) => {
            validateGroupIdMock.resolves(oneOptions.W);
            validateReportIdMock.rejects();
            validateAllowedValues.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => oneOptions,
            };
            startExportAction(oneOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("start with two options", (done) => {
            validateGroupIdMock.resolves(twoOptions.W);
            validateReportIdMock.resolves(twoOptions.R);
            validateAllowedValues.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => twoOptions,
            };
            startExportAction(twoOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(0);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
        it("start with PBIX options", (done) => {
            validateGroupIdMock.resolves(pbixOptions.W);
            validateReportIdMock.resolves(pbixOptions.R);
            validateAllowedValues.resolves("PBIX");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => pbixOptions,
            };
            startExportAction(pbixOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("start with PPTX options", (done) => {
            validateGroupIdMock.resolves(pptxOptions.W);
            validateReportIdMock.resolves(pptxOptions.R);
            validateAllowedValues.resolves("PPTX");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => pptxOptions,
            };
            startExportAction(pptxOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("start with XLSX options", (done) => {
            validateGroupIdMock.resolves(xlsxOptions.W);
            validateReportIdMock.resolves(xlsxOptions.R);
            validateAllowedValues.resolves("XLSX");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => xlsxOptions,
            };
            startExportAction(xlsxOptions, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("start with XLSX options and config file", (done) => {
            validateGroupIdMock.resolves(xlsxOptionsFile.W);
            validateReportIdMock.resolves(xlsxOptionsFile.R);
            validateAllowedValues.resolves("XLSX");
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => xlsxOptionsFile,
            };
            startExportAction(xlsxOptionsFile, cmdOptsMock as ModuleCommand).then(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(1);
                done();
            });
        });
        it("start with ZIP options", (done) => {
            validateGroupIdMock.resolves(pbixOptions.W);
            validateReportIdMock.resolves(pbixOptions.R);
            validateAllowedValues.rejects();
            executeAPICallMock.resolves(true);
            const cmdOptsMock: unknown = {
                name: () => "start",
                opts: () => zipOptions,
            };
            startExportAction(zipOptions, cmdOptsMock as ModuleCommand).catch(() => {
                expect(validateGroupIdMock.callCount).to.equal(1);
                expect(validateReportIdMock.callCount).to.equal(1);
                expect(validateAllowedValues.callCount).to.equal(1);
                expect(executeAPICallMock.callCount).to.equal(0);
                done();
            });
        });
    });
});
