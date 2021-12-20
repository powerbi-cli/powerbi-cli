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
import {
    getGroupUrl,
    getGroupID,
    getDatasetID,
    getAppID,
    getCapacityID,
    getGatewayID,
    getAppContentID,
    getAppDashboardTileID,
    getDashboardID,
    getDashboardTileID,
    getDataflowID,
    getReportID,
    getGatewayDatasourceID,
    getImportID,
    getAdminGroupInfo,
    getAdminCapacityID,
    getAdminObjectInfo,
    getScorecardID,
    getScorecardGoalID,
    getPipelineID,
} from "./helpers";

chai.use(chaiAsPromise);
const expect = chai.expect;

import * as rest from "./rest";

const uuid = "62b72ecd-65de-4b3e-9b3e-4db2d8c3571b";

describe("helpers.ts", () => {
    let executeRestCallMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        executeRestCallMock = ImportMock.mockFunction(rest, "executeRestCall");
    });
    afterEach(() => {
        executeRestCallMock.restore();
    });
    describe("getAdminGroupInfo()", () => {
        it("group found ", () => {
            executeRestCallMock.resolves([{ id: uuid, name: "name" }]);
            getAdminGroupInfo("groupName", "Deleted").then((result: string[]) => {
                expect(result[0]).to.equal(uuid);
                expect(result[1]).to.equal("name");
            });
        });
        it("group not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAdminGroupInfo("groupName", "Deleted")).eventually.to.rejectedWith(
                "No workspace found with name 'groupName' and state 'Deleted'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAdminGroupInfo("groupName", "Deleted")).eventually.to.rejected;
        });
    });
    describe("getAdminObjectInfo()", () => {
        it("object found ", () => {
            executeRestCallMock.resolves([{ id: uuid }]);
            getAdminObjectInfo("reportName", "report", "name").then((result: string) => {
                expect(result).to.equal(uuid);
            });
        });
        it("object not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAdminObjectInfo("datasetName", "dataset", "name")).eventually.to.rejectedWith(
                "No dataset found with name 'datasetName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAdminObjectInfo("dataflowName", "dataflow", "name")).eventually.to.rejected;
        });
    });
    describe("getAdminCapacityID()", () => {
        it("capacity found ", () => {
            executeRestCallMock.resolves([{ displayName: "capacity", id: uuid }]);
            expect(getAdminCapacityID("capacity")).eventually.to.equal(uuid);
        });
        it("capacity not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAdminCapacityID("capacity")).eventually.to.rejectedWith("No capacity found with name 'capacity'");
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAdminCapacityID("capacity")).eventually.to.rejected;
        });
    });
    describe("getGroupID()", () => {
        it("group found ", () => {
            executeRestCallMock.resolves([{ id: uuid }]);
            expect(getGroupID("groupName")).eventually.to.equal(uuid);
        });
        it("group not found", () => {
            executeRestCallMock.resolves([]);
            expect(getGroupID("groupName")).eventually.to.rejectedWith("No workspace found with name 'groupName'");
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getGroupID("groupName")).eventually.to.rejected;
        });
    });

    describe("getCapacityID()", () => {
        it("capacity found ", () => {
            executeRestCallMock.resolves([{ displayName: "capacity", id: uuid }]);
            expect(getCapacityID("capacity")).eventually.to.equal(uuid);
        });
        it("capacity not found", () => {
            executeRestCallMock.resolves([]);
            expect(getCapacityID("capacity")).eventually.to.rejectedWith("No capacity found with name 'capacity'");
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getCapacityID("capacity")).eventually.to.rejected;
        });
    });

    describe("getDataflowID()", () => {
        it("dataflow found ", () => {
            executeRestCallMock.resolves([{ name: "dataflowName", objectId: uuid }]);
            expect(getDataflowID(uuid, "dataflowName")).eventually.to.equal(uuid);
        });
        it("dataflow not found", () => {
            executeRestCallMock.resolves([]);
            expect(getDataflowID(uuid, "dataflowName")).eventually.to.rejectedWith(
                "No dataflow found with name 'dataflowName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getDataflowID(uuid, "dataflowName")).eventually.to.rejected;
        });
    });

    describe("getDatasetID()", () => {
        it("dataset found ", () => {
            executeRestCallMock.resolves([{ name: "datasetName", id: uuid }]);
            expect(getDatasetID(uuid, "datasetName")).eventually.to.equal(uuid);
        });
        it("dataset not found", () => {
            executeRestCallMock.resolves([]);
            expect(getDatasetID(uuid, "datasetName")).eventually.to.rejectedWith(
                "No dataset found with name 'datasetName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getDatasetID(uuid, "datasetName")).eventually.to.rejected;
        });
    });
    describe("getReportID()", () => {
        it("report found ", () => {
            executeRestCallMock.resolves([{ name: "reportName", id: uuid }]);
            expect(getReportID(uuid, "reportName")).eventually.to.equal(uuid);
        });
        it("report not found", () => {
            executeRestCallMock.resolves([]);
            expect(getReportID(uuid, "reportName")).eventually.to.rejectedWith(
                "No report found with name 'reportName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getReportID(uuid, "reportName")).eventually.to.rejected;
        });
    });
    describe("getScorecardID()", () => {
        it("scorecard found ", () => {
            executeRestCallMock.resolves([{ name: "scorecardName", id: uuid }]);
            expect(getScorecardID(uuid, "scorecardName")).eventually.to.equal(uuid);
        });
        it("report not found", () => {
            executeRestCallMock.resolves([]);
            expect(getScorecardID(uuid, "scorecardName")).eventually.to.rejectedWith(
                "No report found with name 'scorecardName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getScorecardID(uuid, "scorecardName")).eventually.to.rejected;
        });
    });

    describe("getScorecardGoalID()", () => {
        it("scorecard goal found ", () => {
            executeRestCallMock.resolves([{ title: "goalName", id: uuid }]);
            expect(getScorecardGoalID(uuid, "scorecardName", "goalName")).eventually.to.equal(uuid);
        });
        it("scorecard goal not found", () => {
            executeRestCallMock.resolves([]);
            expect(getScorecardGoalID(uuid, "scorecardName", "goalName")).eventually.to.rejectedWith(
                "No scorecard goal found with name 'goalName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getScorecardGoalID(uuid, "scorecardName", "goalName")).eventually.to.rejected;
        });
    });

    describe("getDashboardID()", () => {
        it("dashboard found ", () => {
            executeRestCallMock.resolves([{ displayName: "dashboardName", id: uuid }]);
            expect(getDashboardID(uuid, "dashboardName")).eventually.to.equal(uuid);
        });
        it("dashboard not found", () => {
            executeRestCallMock.resolves([]);
            expect(getDashboardID(uuid, "dashboardName")).eventually.to.rejectedWith(
                "No dashboard found with name 'dashboardName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getDashboardID(uuid, "dashboardName")).eventually.to.rejected;
        });
    });

    describe("getDashboardTileID()", () => {
        it("dashboard tile found ", () => {
            executeRestCallMock.resolves([{ title: "tileName", id: uuid }]);
            expect(getDashboardTileID(uuid, "dashboardName", "tileName")).eventually.to.equal(uuid);
        });
        it("dashboard tile not found", () => {
            executeRestCallMock.resolves([]);
            expect(getDashboardTileID(uuid, "dashboardName", "tileName")).eventually.to.rejectedWith(
                "No dashboard tile found with name 'tileName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getDashboardTileID(uuid, "dashboardName", "tileName")).eventually.to.rejected;
        });
    });

    describe("getGatewayID()", () => {
        it("gateway found ", () => {
            executeRestCallMock.resolves([{ name: "gatewayName", id: uuid }]);
            expect(getGatewayID("gatewayName")).eventually.to.equal(uuid);
        });
        it("gateway not found", () => {
            executeRestCallMock.resolves([]);
            expect(getGatewayID("gatewayName")).eventually.to.rejectedWith("No gateway found with name 'gatewayName'");
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getGatewayID("gatewayName")).eventually.to.rejected;
        });
    });

    describe("getGatewayDatasourceID()", () => {
        it("datasource found ", () => {
            executeRestCallMock.resolves([{ datasourceName: "datasourceName", id: uuid }]);
            expect(getGatewayDatasourceID(uuid, "datasourceName")).eventually.to.equal(uuid);
        });
        it("datasoiurce not found", () => {
            executeRestCallMock.resolves([]);
            expect(getGatewayDatasourceID(uuid, "datasourceName")).eventually.to.rejectedWith(
                "No datasource found with name 'datasourceName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getGatewayDatasourceID(uuid, "datasourceName")).eventually.to.rejected;
        });
    });

    describe("getPipelineID()", () => {
        it("pipeline found ", () => {
            executeRestCallMock.resolves([{ name: "pipelineName", id: uuid }]);
            expect(getPipelineID("pipelineName")).eventually.to.equal(uuid);
        });
        it("pipeline not found", () => {
            executeRestCallMock.resolves([]);
            expect(getPipelineID("pipelineName")).eventually.to.rejectedWith(
                "No pipeline found with name 'pipelineName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getPipelineID("pipelineName")).eventually.to.rejected;
        });
    });

    describe("getAppID()", () => {
        it("app found ", () => {
            executeRestCallMock.resolves([{ name: "appName", id: uuid }]);
            expect(getAppID("appName")).eventually.to.equal(uuid);
        });
        it("app not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAppID("appName")).eventually.to.rejectedWith("No app found with name 'appName'");
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAppID("appName")).eventually.to.rejected;
        });
    });

    describe("getAppContentID()", () => {
        it("app dashboard found ", () => {
            executeRestCallMock.resolves([{ displayName: "dashboardName", id: uuid }]);
            expect(getAppContentID(uuid, "dashboards", "displayName", "dashboardName")).eventually.to.equal(uuid);
        });
        it("app report found ", () => {
            executeRestCallMock.resolves([{ name: "reportName", id: "reportId" }]);
            expect(getAppContentID(uuid, "reports", "name", "reportName")).eventually.to.equal("reportId");
        });
        it("app content not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAppContentID(uuid, "dashboards", "displayName", "dashboardName")).eventually.to.rejectedWith(
                "No dashboards content found with name 'dashboardName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAppContentID(uuid, "dashboards", "displayName", "dashboardName")).eventually.to.rejected;
        });
    });

    describe("getAppDashboardTileID()", () => {
        it("app dashboard tile found ", () => {
            executeRestCallMock.resolves([{ title: "tileName", id: uuid }]);
            expect(getAppDashboardTileID(uuid, uuid, "tileName")).eventually.to.equal(uuid);
        });
        it("app dashboard tile not found", () => {
            executeRestCallMock.resolves([]);
            expect(getAppDashboardTileID(uuid, uuid, "tileName")).eventually.to.rejectedWith(
                "No tile content found with name 'tileName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getAppDashboardTileID(uuid, uuid, "tileName")).eventually.to.rejected;
        });
    });
    describe("getImportID()", () => {
        it("import found ", () => {
            executeRestCallMock.resolves([{ name: "importName", id: uuid }]);
            expect(getImportID(uuid, "importName")).eventually.to.equal(uuid);
        });
        it("import not found", () => {
            executeRestCallMock.resolves([]);
            expect(getImportID(uuid, "importName")).eventually.to.rejectedWith(
                "No import found with name 'importName'"
            );
        });
        it("exception in executeRestCall", () => {
            executeRestCallMock.rejects();
            expect(getImportID(uuid, "importName")).eventually.to.rejected;
        });
    });
    describe("getGroupUrl()", () => {
        it("no groupId", () => {
            const groupId: string | undefined = undefined;
            const output = getGroupUrl(groupId);
            expect(output).equal("");
        });
        it("with groupId", () => {
            const groupId: string | undefined = uuid;
            const output = getGroupUrl(groupId);
            expect(output).equal(`/groups/${uuid}`);
        });
    });
});
