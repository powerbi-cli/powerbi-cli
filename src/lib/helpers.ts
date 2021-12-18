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

import { RequestPrepareOptions } from "@azure/ms-rest-js";
import jmespath from "jmespath";
import { stringify, ParsedUrlQueryInput } from "querystring";

import { executeRestCall } from "./rest";
import { checkUUID } from "./validate";
import { TokenType } from "./auth";
import { getConsts } from "./consts";

export const accessRights = ["Admin", "Contributor", "Member"]; // 'None' is not supported
export const pipelineAccessRights = ["Admin"];
export const accessRightsDataSource = ["None", "Read", "ReadOverrideEffectiveIdentity"];
export const principalTypes = ["App", "User", "Group", "None"];
export const pbiExports = ["PDF", "PPTX"];
export const pbiDownloads = ["PBIX"];
export const rsExports = ["CSV", "DOCX", "IMAGE", "MHTML", "PNG", "XLSX", "XML"];
export const allowedExportFormat: string[] = pbiExports.concat(pbiDownloads).concat(rsExports).sort();
export const datasetNamingConflictPBIX = ["Abort", "CreateOrOverwrite", "Ignore", "Overwrite"];
export const datasetNamingConflictRDL = ["Abort", "Overwrite"];
export const datasetNamingConflictDF = ["Abort", "GenerateUniqueName"];
export const datasetNamingConflict = datasetNamingConflictPBIX
    .concat(datasetNamingConflictRDL)
    .concat(datasetNamingConflictDF)
    .filter((v, i, s) => s.indexOf(v) === i)
    .sort();
export const expandAdminGroups = ["dashboards", "datasets", "dataflows", "reports", "users", "workbooks"];
export const expandCapacity = ["tenantKey"];
export const expandAdminDashboards = ["tiles"];
export const expandAdminImports = ["datasets", "reports"];
export const expandRefreshes = ["capacity", "workspace"];
export const workloadState = ["enabled", "disabled"];
export const powerBIClouds = ["Public", "GCC", "GCCHigh", "DoD", "Germany", "China"];
export const refreshNotify = ["always", "failure", "none"];

const { powerBIRestURL } = getConsts();

export function getAdminGroupInfo(name: string, filterState: string | undefined = undefined): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        const query: ParsedUrlQueryInput = { $top: 1 };
        name = name.replace(/['"]+/g, "");
        if (checkUUID(name)) {
            query["$filter"] = `id eq '${name}'`;
        } else {
            query["$filter"] = `name eq '${name}'`;
        }
        if (filterState) query["$filter"] += ` and state eq '${filterState}'`;
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/admin/groups?${stringify(query)}`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve([(response as any)[0].id, (response as any)[0].name]);
                } catch {
                    let errorMsg = `No workspace found with name '${name}'`;
                    if (filterState) errorMsg += ` and state '${filterState}'`;
                    reject(errorMsg);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getAdminObjectInfo(
    name: string,
    objectType: string,
    lookupName: string,
    returnName: string | undefined = "id"
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const query: ParsedUrlQueryInput = { $top: 1 };
        name = name.replace(/['"]+/g, "");
        query["$filter"] = `${lookupName} eq '${name}'`;
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/admin/${objectType}?${stringify(query)}`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve((response as any)[0][returnName]);
                } catch {
                    reject(`No ${objectType} found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getAdminCapacityID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/admin/capacities`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?displayName=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No capacity found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getCapacityID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/capacities`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?displayName=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No capacity found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getGroupID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        name = name.replace(/['"]+/g, "");
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/groups?$filter=name%20eq%20'${name}'`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve((response as any)[0].id);
                } catch {
                    reject(`No workspace found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getDataflowID(groupName: string, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/dataflows`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:objectId}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No dataflow found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getDatasetID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/datasets`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No dataset found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getReportID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/reports`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No report found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getScorecardID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/scorecards`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No scorecard found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getScorecardGoalID(
    groupName: string | undefined,
    scorecardName: string | undefined,
    name: string
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/scorecards/${scorecardName}/goals`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No scorecard goal found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getDashboardID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/dashboards`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?displayName=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No dashboard found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getDashboardTileID(
    groupName: string | undefined,
    dashboardName: string | undefined,
    name: string
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/dashboards/${dashboardName}/tiles`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?title=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No dashboard tile found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getGatewayID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/gateways`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No gateway found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getGatewayDatasourceID(gatewayId: string, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/gateways/${gatewayId}/datasources`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?datasourceName=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No datasource found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getPipelineID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/pipelines`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?displayName=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No pipeline found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getImportID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}${groupName}/imports`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No import found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getAppID(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/apps`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                name = name.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?name=='${name}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No app found with name '${name}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getAppContentID(
    appId: string,
    appContent: string,
    lookup: string,
    searchText: string
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/apps/${appId}/${appContent}`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                searchText = searchText.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?${lookup}=='${searchText}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No ${appContent} content found with name '${searchText}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getAppDashboardTileID(appId: string, dashboardId: string, tileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${powerBIRestURL}/apps/${appId}/dashboards/${dashboardId}/tiles`,
        };
        executeRestCall(lookUpRequest, true, TokenType.POWERBI)
            .then((response: string) => {
                tileName = tileName.replace(/['"]+/g, "");
                const output = jmespath.search(response, `[?title=='${tileName}'].{id:id}`);
                try {
                    resolve(output[0].id);
                } catch {
                    reject(`No tile content found with name '${tileName}'`);
                }
            })
            .catch((err) => reject(err));
    });
}

export function getGroupUrl(groupId: string | undefined): string {
    return groupId === undefined ? "" : `/groups/${groupId}`;
}
