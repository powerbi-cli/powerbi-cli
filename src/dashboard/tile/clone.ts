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

import { ModuleCommand } from "../../lib/command";
import { debug } from "../../lib/logging";
import { APICall, executeAPICall } from "../../lib/api";
import { validateGroupId, validateDashboardId, validateDashboardTileId } from "../../lib/parameters";
import { getGroupUrl } from "../../lib/helpers";

export async function cloneAction(cmd: ModuleCommand): Promise<void> {
    const options = cmd.opts();
    if (options.H) return;
    const groupId = await validateGroupId(options.G, false);
    const dashboardId = await validateDashboardId(groupId as string, options.D, true);
    const tileId = await validateDashboardTileId(groupId as string, dashboardId as string, options.T, true);
    if (options.destDashboard === undefined) throw "error: missing option '--dest-dashboard'";
    debug(`Clone a Power BI dashboard tile (${tileId}) in group (${groupId || "my"}) with name (${options.D})`);
    const request: APICall = {
        method: "POST",
        url: `${getGroupUrl(groupId)}/dashboards/${dashboardId}/tiles/${tileId}/Clone`,
        body: {
            targetDashboardId: options.destDashboard,
            targetModelId: options.destModel,
            targetReportId: options.destReport,
            targetWorkspaceId: options.destGroup,
            positionConflictAction: options.abort ? "Abort" : "Tail",
        },
    };
    await executeAPICall(request);
}
