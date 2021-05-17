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
    validateCapacityId,
    validateDashboardId,
    validateDashboardTileId,
    validateDataflowId,
    validateReportId,
    validateGatewayId,
    validateGatewayDatasourceId,
    validateImportId,
    validateAdminGroupId,
    validateAdminCapacityId,
    validateAdminObjectId,
    capitalize,
    validateScorecardId,
    validateScorecardGoalId,
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
        it("correct value 1 & 2", () => {
            validateAllowedValues("string 1, string 2", allowedValues, true).should.eventually.be.equal(
                "string 1, string 2"
            );
        });
        it("incorrect value 1 & 3", () => {
            validateAllowedValues("string 1, string 3", allowedValues, true).should.be.rejected;
        });
    });

    describe("validateParameter()", () => {
        it("workspace, required", () => {
            const parameter = {
                name: "workspace",
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--workspace'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("id");
        });
        it("workspace, not required", () => {
            const parameter = {
                name: "workspace",
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--workspace'",
                isRequired: false,
            };
            validateParameter(parameter).should.eventually.be.equal("id");
        });
        it("empty workspace, required", () => {
            const parameter = {
                name: undefined,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--workspace'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.rejectedWith("error: missing option '--workspace'");
        });
        it("empty workspace, required", () => {
            const parameter = {
                name: undefined,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--workspace'",
                isRequired: false,
            };
            validateParameter(parameter).should.eventually.be.equal(undefined);
        });
        it("uuid workspace, required", () => {
            const parameter = {
                name: uuid,
                isName: () => Promise.resolve("id"),
                missing: "error: missing option '--workspace'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal(uuid);
        });
        it("workspace, no lookup", () => {
            const parameter = {
                name: "workspace",
                missing: "error: missing option '--workspace'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("workspace");
        });
        it("uuid, lookup", () => {
            const parameter = {
                name: uuid,
                isId: () => Promise.resolve("workspace"),
                missing: "error: missing option '--workspace'",
                isRequired: true,
            };
            validateParameter(parameter).should.eventually.be.equal("workspace");
        });
    });
    describe("validateAdminWorkspaceId()", () => {
        let mockGetWorkspaceId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetWorkspaceId = ImportMock.mockFunction(helpers, "getAdminGroupInfo").resolves([uuid, "name"]);
        });
        afterEach(() => {
            mockGetWorkspaceId.restore();
        });
        it("workspace, required", () => {
            validateAdminGroupId("workspace", true, "Deleted").should.eventually.be.equal(uuid);
            expect(mockGetWorkspaceId.callCount).equal(1);
        });
        it("empty workspace, required", () => {
            validateAdminGroupId(undefined, true, "Deleted").should.eventually.be.rejectedWith(
                "error: missing option '--workspace'"
            );
            expect(mockGetWorkspaceId.callCount).equal(0);
        });
        it("empty workspace, not required", () => {
            validateAdminGroupId(undefined, false, "Deleted").should.eventually.be.equal(undefined);
            expect(mockGetWorkspaceId.callCount).equal(0);
        });
    });
    describe("validateAdminObjectId()", () => {
        let mockGetWorkspaceId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetWorkspaceId = ImportMock.mockFunction(helpers, "getAdminObjectInfo").resolves(uuid);
        });
        afterEach(() => {
            mockGetWorkspaceId.restore();
        });
        it("object, required", () => {
            validateAdminObjectId("dashboard", true, "dashboard", "name").should.eventually.be.equal(uuid);
            expect(mockGetWorkspaceId.callCount).equal(1);
        });
        it("empty object, required", () => {
            validateAdminObjectId(undefined, true, "report", "name").should.eventually.be.rejectedWith(
                "error: missing option '--report'"
            );
            expect(mockGetWorkspaceId.callCount).equal(0);
        });
        it("empty object, not required", () => {
            validateAdminObjectId(undefined, false, "dataflow", "name").should.eventually.be.equal(undefined);
            expect(mockGetWorkspaceId.callCount).equal(0);
        });
    });
    describe("validateAdminCapacityId()", () => {
        let mockGetAdminCapacityId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetAdminCapacityId = ImportMock.mockFunction(helpers, "getAdminCapacityID").resolves(uuid);
        });
        afterEach(() => {
            mockGetAdminCapacityId.restore();
        });
        it("capacity, required", () => {
            validateAdminCapacityId("capacity", true).should.eventually.be.equal(uuid);
            expect(mockGetAdminCapacityId.callCount).equal(1);
        });
        it("empty capacity, required", () => {
            validateAdminCapacityId(undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--capacity'"
            );
            expect(mockGetAdminCapacityId.callCount).equal(0);
        });
        it("empty capacity, not required", () => {
            validateAdminCapacityId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetAdminCapacityId.callCount).equal(0);
        });
    });
    describe("validateCapacityId()", () => {
        let mockGetCapacityId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetCapacityId = ImportMock.mockFunction(helpers, "getCapacityID").resolves(uuid);
        });
        afterEach(() => {
            mockGetCapacityId.restore();
        });
        it("capacity, required", () => {
            validateCapacityId("capacity", true).should.eventually.be.equal(uuid);
            expect(mockGetCapacityId.callCount).equal(1);
        });
        it("empty capacity, required", () => {
            validateCapacityId(undefined, true).should.eventually.be.rejectedWith("error: missing option '--capacity'");
            expect(mockGetCapacityId.callCount).equal(0);
        });
        it("empty capacity, not required", () => {
            validateCapacityId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetCapacityId.callCount).equal(0);
        });
    });
    describe("validateWorkspaceId()", () => {
        let mockGetWorkspaceId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetWorkspaceId = ImportMock.mockFunction(helpers, "getGroupID").resolves(uuid);
        });
        afterEach(() => {
            mockGetWorkspaceId.restore();
        });
        it("workspace, required", () => {
            validateGroupId("workspace", true).should.eventually.be.equal(uuid);
            expect(mockGetWorkspaceId.callCount).equal(1);
        });
        it("empty workspace, required", () => {
            validateGroupId(undefined, true).should.eventually.be.rejectedWith("error: missing option '--workspace'");
            expect(mockGetWorkspaceId.callCount).equal(0);
        });
        it("empty workspace, not required", () => {
            validateGroupId(undefined, false).should.eventually.be.equal(undefined);
            expect(mockGetWorkspaceId.callCount).equal(0);
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
        it("workspace, dataset, required", () => {
            validateDatasetId("workspace", "dataset", true).should.eventually.be.equal(uuid);
            expect(mockGetDatasetId.callCount).equal(1);
        });
        it("workspace, no dataset, required", () => {
            validateDatasetId("workspace", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dataset'"
            );
            expect(mockGetDatasetId.callCount).equal(0);
        });
        it("empty workspace, dataset, required", () => {
            validateDatasetId(undefined, "dataset", true).should.eventually.be.equal(uuid);
            expect(mockGetDatasetId.callCount).equal(1);
        });
        it("empty workspace, no dataset, required", () => {
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
        it("workspace, report, required", () => {
            validateReportId("workspace", "report", true).should.eventually.be.equal(uuid);
            expect(mockGetReportId.callCount).equal(1);
        });
        it("workspace, no report, required", () => {
            validateReportId("workspace", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--report'"
            );
            expect(mockGetReportId.callCount).equal(0);
        });
        it("empty workspace, report, required", () => {
            validateReportId(undefined, "report", true).should.eventually.be.equal(uuid);
            expect(mockGetReportId.callCount).equal(1);
        });
        it("empty workspace, no report, required", () => {
            validateReportId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--report'"
            );
            expect(mockGetReportId.callCount).equal(0);
        });
    });
    describe("validateScorecardId()", () => {
        let mockGetScorecardId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetScorecardId = ImportMock.mockFunction(helpers, "getScorecardID").resolves(uuid);
        });
        afterEach(() => {
            mockGetScorecardId.restore();
        });
        it("workspace, scorecard, required", () => {
            validateScorecardId("workspace", "scorecard", true).should.eventually.be.equal(uuid);
            expect(mockGetScorecardId.callCount).equal(1);
        });
        it("workspace, no scorecard, required", () => {
            validateScorecardId("workspace", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--scorecard'"
            );
            expect(mockGetScorecardId.callCount).equal(0);
        });
        it("no workspace, no scorecard, required", () => {
            validateScorecardId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--workspace'"
            );
            expect(mockGetScorecardId.callCount).equal(0);
        });
    });
    describe("validateScorecardGoalId()", () => {
        let mockGetScorecardGoalId: SinonSpy<unknown[], unknown>;
        beforeEach(() => {
            mockGetScorecardGoalId = ImportMock.mockFunction(helpers, "getScorecardGoalID").resolves(uuid);
        });
        afterEach(() => {
            mockGetScorecardGoalId.restore();
        });
        it("workspace, scorecard, required", () => {
            validateScorecardGoalId("workspace", "scorecard", "goal", true).should.eventually.be.equal(uuid);
            expect(mockGetScorecardGoalId.callCount).equal(1);
        });
        it("workspace, scorecard, no goal required", () => {
            validateScorecardGoalId("workspace", "scorecard", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--goal'"
            );
            expect(mockGetScorecardGoalId.callCount).equal(0);
        });
        it("empty workspace, scorecard, required", () => {
            validateScorecardGoalId(undefined, "scorecard", "goal", true).should.eventually.be.equal(uuid);
            expect(mockGetScorecardGoalId.callCount).equal(1);
        });
        it("empty workspace, no scorecard, required", () => {
            validateScorecardGoalId(undefined, undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--goal'"
            );
            expect(mockGetScorecardGoalId.callCount).equal(0);
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
        it("workspace, dataflow, required", () => {
            validateDataflowId("workspace", "dataflow", true).should.eventually.be.equal(uuid);
            expect(mockGetDataflowId.callCount).equal(1);
        });
        it("workspace, no dataflow, required", () => {
            validateDataflowId("workspace", undefined, true).should.eventually.be.rejectedWith(
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
        it("workspace, dashboard, required", () => {
            validateDashboardId("workspace", "dashboard", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardId.callCount).equal(1);
        });
        it("workspace, no dashboard, required", () => {
            validateDashboardId("workspace", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--dashboard'"
            );
            expect(mockGetDashboardId.callCount).equal(0);
        });
        it("empty workspace, dashboard, required", () => {
            validateDashboardId(undefined, "dashboard", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardId.callCount).equal(1);
        });
        it("empty workspace, no dashboard, required", () => {
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
        it("workspace, dashboard, required", () => {
            validateDashboardTileId("workspace", "dashboard", "tile", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardTileId.callCount).equal(1);
        });
        it("workspace, dashboard, no tile required", () => {
            validateDashboardTileId("workspace", "dashboard", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--tile'"
            );
            expect(mockGetDashboardTileId.callCount).equal(0);
        });
        it("empty workspace, dashboard, required", () => {
            validateDashboardTileId(undefined, "dashboard", "tile", true).should.eventually.be.equal(uuid);
            expect(mockGetDashboardTileId.callCount).equal(1);
        });
        it("empty workspace, no dashboard, required", () => {
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
            validateAppId("workspace", true).should.eventually.be.equal(uuid);
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
            validateGatewayId("workspace", true).should.eventually.be.equal(uuid);
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
            validateGatewayDatasourceId("workspace", "datasource", true).should.eventually.be.equal(uuid);
            expect(mockGetGatewayDatasourceID.callCount).equal(1);
        });
        it("gateway, no datasource, required", () => {
            validateGatewayDatasourceId("workspace", undefined, true).should.eventually.be.rejectedWith(
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
        it("workspace, import, required", () => {
            validateImportId("workspace", "import", true).should.eventually.be.equal(uuid);
            expect(mockGetImportId.callCount).equal(1);
        });
        it("workspace, no import, required", () => {
            validateImportId("workspace", undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--import'"
            );
            expect(mockGetImportId.callCount).equal(0);
        });
        it("empty workspace, import, required", () => {
            validateImportId(undefined, "import", true).should.eventually.be.equal(uuid);
            expect(mockGetImportId.callCount).equal(1);
        });
        it("empty workspace, no import, required", () => {
            validateImportId(undefined, undefined, true).should.eventually.be.rejectedWith(
                "error: missing option '--import'"
            );
            expect(mockGetImportId.callCount).equal(0);
        });
    });
    describe("capitalize()", () => {
        it("string 1", () => {
            expect(capitalize("string 1")).to.equal("String 1");
        });
    });
});
