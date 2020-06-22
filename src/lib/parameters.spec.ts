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
import chaiAsPromise from "chai-as-promised";
import { ImportMock } from "ts-mock-imports";
import { SinonSpy } from "sinon";

import * as helpers from "./helpers";

import {
    validateAllowedValues,
    validateGroupId,
    validateParameter,
    validateDatasetId,
    validateAppId,
    validateDashboardId,
    validateDashboardTileId,
    validateDataflowId,
    validateReportId,
    validateGatewayId,
    validateGatewayDatasourceId,
    validateImportId,
} from "./parameters";

chai.use(chaiAsPromise);
const expect = chai.expect;

const uuid = "62b72ecd-65de-4b3e-9b3e-4db2d8c3571b";

describe("parameters.ts", () => {
    const allowedValues = ["string 1", "string 2"];
    describe("validateAllowedValues()", () => {
        it("correct value 1", () => {
            validateAllowedValues("string 1", allowedValues).should.eventually.be.equal("string 1");
        });
        it("correct value 2", () => {
            validateAllowedValues("string 2", allowedValues).should.eventually.be.equal("string 2");
        });
        it("incorrect value 3", () => {
            validateAllowedValues("string 3", allowedValues).should.be.rejected;
        });
    });

    describe("validateParameter()", () => {
        it("group, required", () => {
            const parameter = {
                name: "group",
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--group'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("id");
        });
        it("group, not required", () => {
            const parameter = {
                name: "group",
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--group'",
                isRequired: false,
            };
            validateParameter(parameter).should.eventually.be.equal("id");
        });
        it("empty group, required", () => {
            const parameter = {
                name: undefined,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--group'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.rejectedWith("error: missing option '--group'");
        });
        it("empty group, required", () => {
            const parameter = {
                name: undefined,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--group'",
                isRequired: false,
            };
            validateParameter(parameter).should.eventually.be.equal(undefined);
        });
        it("uuid group, required", () => {
            const parameter = {
                name: uuid,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--group'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal(uuid);
        });
        it("group, no lookup", () => {
            const parameter = {
                name: "group",
                missing: "error: missing option '--group'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("group");
        });
        it("uuid, lookup", () => {
            const parameter = {
                name: uuid,
                isId: () => Promise.resolve("group"),
                missing: "error: missing option '--group'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("group");
        });
    });
    describe("validateGroupId()", () => {
        let mockGetGroupId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetGroupId = ImportMock.mockFunction(helpers, "getGroupID").resolves(uuid);
        });
        afterEach(() => {
            mockGetGroupId.restore();
        });
        it("group, required", () => {
            validateGroupId("group", true).should.eventually.be.equal(uuid);
            expect(mockGetGroupId.callCount).equal(1);
        });
        it("empty group, required", () => {
            validateGroupId(undefined, true).should.eventually.be.rejectedWith("error: missing option '--group'");
            expect(mockGetGroupId.callCount).equal(0);
        });
        it("empty group, not required", () => {
            validateGroupId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetGroupId.callCount).equal(0);
        });
    });
    describe("validateDatasetId()", () => {
        let mockGetDatasetId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetDatasetId = ImportMock.mockFunction(helpers, "getDatasetID").resolves(uuid);
        });
        afterEach(() => {
            mockGetDatasetId.restore();
        });
        it("group, dataset, required", () => {
            validateDatasetId("group", "dataset", true).should.eventually.be.equal(uuid);
            expect(mockGetDatasetId.callCount).equal(1);
        });
        it("group, no dataset, required", () => {
            validateDatasetId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dataset'"
            );
            expect(mockGetDatasetId.callCount).equal(0);
        });
        it("empty group, dataset, required", () => {
            validateDatasetId(undefined, "dataset", true).should.eventually.be.equal(uuid);
            expect(mockGetDatasetId.callCount).equal(1);
        });
        it("empty group, no dataset, required", () => {
            validateDatasetId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dataset'"
            );
            expect(mockGetDatasetId.callCount).equal(0);
        });
    });
    describe("validateReportId()", () => {
        let mockGetReportId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetReportId = ImportMock.mockFunction(helpers, "getReportID").resolves(uuid);
        });
        afterEach(() => {
            mockGetReportId.restore();
        });
        it("group, report, required", () => {
            validateReportId("group", "report", true).should.eventually.be.equal(uuid);
            expect(mockGetReportId.callCount).equal(1);
        });
        it("group, no report, required", () => {
            validateReportId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--report'"
            );
            expect(mockGetReportId.callCount).equal(0);
        });
        it("empty group, report, required", () => {
            validateReportId(undefined, "report", true).should.eventually.be.equal(uuid);
            expect(mockGetReportId.callCount).equal(1);
        });
        it("empty group, no report, required", () => {
            validateReportId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--report'"
            );
            expect(mockGetReportId.callCount).equal(0);
        });
    });
    describe("validateDataflowId()", () => {
        let mockGetDataflowId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetDataflowId = ImportMock.mockFunction(helpers, "getDataflowID").resolves(uuid);
        });
        afterEach(() => {
            mockGetDataflowId.restore();
        });
        it("group, dataflow, required", () => {
            validateDataflowId("group", "dataflow", true).should.eventually.be.equal(uuid);
            expect(mockGetDataflowId.callCount).equal(1);
        });
        it("group, no dataflow, required", () => {
            validateDataflowId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dataflow'"
            );
            expect(mockGetDataflowId.callCount).equal(0);
        });
    });
    describe("validateDashboardId()", () => {
        let mockGetDashboardId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetDashboardId = ImportMock.mockFunction(helpers, "getDashboardID").resolves(uuid);
        });
        afterEach(() => {
            mockGetDashboardId.restore();
        });
        it("group, dashboard, required", () => {
            validateDashboardId("group", "dashboard", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardId.callCount).equal(1);
        });
        it("group, no dashboard, required", () => {
            validateDashboardId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dashboard'"
            );
            expect(mockGetDashboardId.callCount).equal(0);
        });
        it("empty group, dashboard, required", () => {
            validateDashboardId(undefined, "dashboard", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardId.callCount).equal(1);
        });
        it("empty group, no dashboard, required", () => {
            validateDashboardId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dashboard'"
            );
            expect(mockGetDashboardId.callCount).equal(0);
        });
    });
    describe("validateDashboardTileId()", () => {
        let mockGetDashboardTileId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetDashboardTileId = ImportMock.mockFunction(helpers, "getDashboardTileID").resolves(uuid);
        });
        afterEach(() => {
            mockGetDashboardTileId.restore();
        });
        it("group, dashboard, required", () => {
            validateDashboardTileId("group", "dashboard", "tile", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardTileId.callCount).equal(1);
        });
        it("group, dashboard, no tile required", () => {
            validateDashboardTileId("group", "dashboard", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--tile'"
            );
            expect(mockGetDashboardTileId.callCount).equal(0);
        });
        it("empty group, dashboard, required", () => {
            validateDashboardTileId(undefined, "dashboard", "tile", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardTileId.callCount).equal(1);
        });
        it("empty group, no dashboard, required", () => {
            validateDashboardTileId(undefined, undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--tile'"
            );
            expect(mockGetDashboardTileId.callCount).equal(0);
        });
    });
    describe("validateAppId()", () => {
        let mockGetAppId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetAppId = ImportMock.mockFunction(helpers, "getAppID").resolves(uuid);
        });
        afterEach(() => {
            mockGetAppId.restore();
        });
        it("app, required", () => {
            validateAppId("group", true).should.eventually.be.equal(uuid);
            expect(mockGetAppId.callCount).equal(1);
        });
        it("empty app, required", () => {
            validateAppId(undefined, true).should.eventually.be.rejectedWith("error: missing option '--app'");
            expect(mockGetAppId.callCount).equal(0);
        });
        it("empty app, not required", () => {
            validateAppId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetAppId.callCount).equal(0);
        });
    });
    describe("validateGatewayId()", () => {
        let mockGetGatewayId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetGatewayId = ImportMock.mockFunction(helpers, "getGatewayID").resolves(uuid);
        });
        afterEach(() => {
            mockGetGatewayId.restore();
        });
        it("gateway, required", () => {
            validateGatewayId("group", true).should.eventually.be.equal(uuid);
            expect(mockGetGatewayId.callCount).equal(1);
        });
        it("empty gateway, required", () => {
            validateGatewayId(undefined, true).should.eventually.be.rejectedWith("error: missing option '--gateway'");
            expect(mockGetGatewayId.callCount).equal(0);
        });
        it("empty gateway, not required", () => {
            validateGatewayId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetGatewayId.callCount).equal(0);
        });
    });
    describe("validateGatewayDatasourceId()", () => {
        let mockGetGatewayDatasourceID: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetGatewayDatasourceID = ImportMock.mockFunction(helpers, "getGatewayDatasourceID").resolves(uuid);
        });
        afterEach(() => {
            mockGetGatewayDatasourceID.restore();
        });
        it("gateway, datasource, required", () => {
            validateGatewayDatasourceId("group", "datasource", true).should.eventually.be.equal(uuid);
            expect(mockGetGatewayDatasourceID.callCount).equal(1);
        });
        it("gateway, no datasource, required", () => {
            validateGatewayDatasourceId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--datasource'"
            );
            expect(mockGetGatewayDatasourceID.callCount).equal(0);
        });
    });
    describe("validateImportId()", () => {
        let mockGetImportId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetImportId = ImportMock.mockFunction(helpers, "getImportID").resolves(uuid);
        });
        afterEach(() => {
            mockGetImportId.restore();
        });
        it("group, import, required", () => {
            validateImportId("group", "import", true).should.eventually.be.equal(uuid);
            expect(mockGetImportId.callCount).equal(1);
        });
        it("group, no import, required", () => {
            validateImportId("group", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--import'"
            );
            expect(mockGetImportId.callCount).equal(0);
        });
        it("empty group, import, required", () => {
            validateImportId(undefined, "import", true).should.eventually.be.equal(uuid);
            expect(mockGetImportId.callCount).equal(1);
        });
        it("empty group, no import, required", () => {
            validateImportId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--import'"
            );
            expect(mockGetImportId.callCount).equal(0);
        });
    });
});
