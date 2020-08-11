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
import { rootUrl } from "./api";
import { checkUUID } from "./validate";

export const accessRights = ["Admin", "Contributor", "Member"]; // 'None' is not supported
export const accessRightsDataSource = ["None", "Read", "ReadOverrideEffectiveIdentity"];
export const principalTypes = ["App", "User", "Group"];
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

export function getAdminGroupInfo(name: string, filterDeleted: boolean): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        const query: ParsedUrlQueryInput = { $top: 1 };
        name = name.replace(/['"]+/g, "");
        if (checkUUID(name)) {
            query["$filter"] = `id eq '${name}'`;
        } else {
            query["$filter"] = `name eq '${name}'`;
        }
        if (filterDeleted) query["$filter"] += " and state eq 'Deleted'";
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${rootUrl}/admin/groups?${stringify(query)}`,
        };
        executeRestCall(lookUpRequest, true)
            .then((response: string) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve([(response as any)[0].id, (response as any)[0].name]);
                } catch {
                    reject(`No group found with name '${name}'`);
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
            url: `${rootUrl}/groups?$filter=name%20eq%20'${name}'`,
        };
        executeRestCall(lookUpRequest, true)
            .then((response: string) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve((response as any)[0].id);
                } catch {
                    reject(`No group found with name '${name}'`);
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
            url: `${rootUrl}${groupName}/dataflows`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}${groupName}/datasets`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}${groupName}/reports`,
        };
        executeRestCall(lookUpRequest, true)
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

export function getDashboardID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${rootUrl}${groupName}/dashboards`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}${groupName}/dashboards/${dashboardName}/tiles`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}/gateways`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}/gateways/${gatewayId}/datasources`,
        };
        executeRestCall(lookUpRequest, true)
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

export function getImportID(groupName: string | undefined, name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        groupName = getGroupUrl(groupName);
        const lookUpRequest: RequestPrepareOptions = {
            method: "GET",
            url: `${rootUrl}${groupName}/imports`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}/apps`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}/apps/${appId}/${appContent}`,
        };
        executeRestCall(lookUpRequest, true)
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
            url: `${rootUrl}/apps/${appId}/dashboards/${dashboardId}/tiles`,
        };
        executeRestCall(lookUpRequest, true)
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
