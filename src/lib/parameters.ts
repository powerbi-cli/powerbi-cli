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

import { checkUUID } from "./validate";
import {
    getGroupID,
    getDatasetID,
    getAppID,
    getDashboardID,
    getDashboardTileID,
    getDataflowID,
    getReportID,
    getGatewayID,
    getGatewayDatasourceID,
    getImportID,
    getAdminGroupInfo,
} from "./helpers";

export interface Parameter {
    name?: string;
    isId?: () => Promise<string>;
    isName?: () => Promise<string>;
    validate?: () => Promise<string>;
    missing: string;
    isRequired: boolean;
}

export async function validateGroupId(group: string | undefined, isRequired: boolean): Promise<string | undefined> {
    return validateParameter({
        name: group,
        isName: () => getGroupID(group as string),
        missing: "error: missing option '--group'",
        isRequired,
    });
}

export async function validateAdminGroupId(
    group: string | undefined,
    isRequired: boolean,
    filterDeleted: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: group,
        isName: () => getAdminGroupInfo(group as string, filterDeleted).then((result) => Promise.resolve(result[0])),
        isId: () => getAdminGroupInfo(group as string, filterDeleted).then((result) => Promise.resolve(result[1])),
        missing: "error: missing option '--group'",
        isRequired,
    });
}

export async function validateDataflowId(
    groupId: string,
    dataflow: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: dataflow,
        isName: () => getDataflowID(groupId, dataflow as string),
        missing: "error: missing option '--dataflow'",
        isRequired,
    });
}

export async function validateDatasetId(
    groupId: string | undefined,
    dataset: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: dataset,
        isName: () => getDatasetID(groupId, dataset as string),
        missing: "error: missing option '--dataset'",
        isRequired,
    });
}

export async function validateReportId(
    groupId: string | undefined,
    report: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: report,
        isName: () => getReportID(groupId, report as string),
        missing: "error: missing option '--report'",
        isRequired,
    });
}

export async function validateDashboardId(
    groupId: string | undefined,
    dashboard: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: dashboard,
        isName: () => getDashboardID(groupId, dashboard as string),
        missing: "error: missing option '--dashboard'",
        isRequired,
    });
}

export async function validateDashboardTileId(
    groupId: string | undefined,
    dashboard: string | undefined,
    tile: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: tile,
        isName: () => getDashboardTileID(groupId, dashboard as string, tile as string),
        missing: "error: missing option '--tile'",
        isRequired,
    });
}

export async function validateAppId(app: string | undefined, isRequired: boolean): Promise<string | undefined> {
    return validateParameter({
        name: app,
        isName: () => getAppID(app as string),
        missing: "error: missing option '--app'",
        isRequired,
    });
}

export async function validateImportId(
    groupId: string | undefined,
    name: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: name,
        isName: () => getImportID(groupId, name as string),
        missing: "error: missing option '--import'",
        isRequired,
    });
}

export async function validateGatewayId(gateway: string | undefined, isRequired: boolean): Promise<string | undefined> {
    return validateParameter({
        name: gateway,
        isName: () => getGatewayID(gateway as string),
        missing: "error: missing option '--gateway'",
        isRequired,
    });
}

export async function validateGatewayDatasourceId(
    gateway: string,
    datasource: string | undefined,
    isRequired: boolean
): Promise<string | undefined> {
    return validateParameter({
        name: datasource,
        isName: () => getGatewayDatasourceID(gateway, datasource as string),
        missing: "error: missing option '--datasource'",
        isRequired,
    });
}

export async function validateParameter(parameter: Parameter): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
        if (!parameter.name && parameter.isRequired) {
            reject(parameter.missing);
        }
        if (parameter.name) {
            if (checkUUID(parameter.name)) {
                if (parameter.isId) {
                    parameter
                        .isId()
                        .then((result: string) => resolve(result))
                        .catch((err: string) => reject(err));
                } else {
                    resolve(parameter.name);
                }
            } else {
                if (parameter.isName) {
                    parameter
                        .isName()
                        .then((result: string) => resolve(result))
                        .catch((err: string) => reject(err));
                } else {
                    resolve(parameter.name);
                }
            }
        } else {
            resolve(undefined);
        }
    });
}

export function validateAllowedValues(value: string, allowedValues: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        if (allowedValues.some((allowedValue: string) => allowedValue === value)) {
            resolve(value);
        } else {
            reject(`error: incorrect option '${value}'. Allowed values: ${allowedValues.join(", ")}`);
        }
    });
}
