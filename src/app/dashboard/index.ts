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
import { OptionValues } from "commander";

import { ModuleCommand } from "../../lib/command";
import { listshowAction } from "./listshow";
import { listshowTileAction } from "./listshowtile";

export function getCommands(): ModuleCommand {
    const listCommand = new ModuleCommand("list")
        .description("List dashboards of a Power BI apps")
        .action(listshowAction)
        .option("--app -a <app>", "Name or ID of the Power BI app");
    listCommand.addGlobalOptions();
    const showCommand = new ModuleCommand("show")
        .description("Get the detail of a dashboard of a Power BI app")
        .action(listshowAction)
        .option("--app -a <app>", "Name or ID of the Power BI app")
        .option("--dashboard -d <dashboard>", "Name or ID of the dashboard of the Power BI app");
    showCommand.addGlobalOptions();
    const tileListCommand = new ModuleCommand("list")
        .description("List of dashboard tiles of a Power BI apps")
        .action(listshowTileAction)
        .option("--app -a <app>", "Name or ID of the Power BI app")
        .option("--dashboard -d <dashboard>", "Name or ID of the dashboard of the Power BI app");
    tileListCommand.addGlobalOptions();
    const tileShowCommand = new ModuleCommand("show")
        .description("Get the details of a dashboard tile of a Power BI apps")
        .action(listshowTileAction)
        .option("--app -a <app>", "Name or ID of the Power BI app")
        .option("--dashboard -d <dashboard>", "Name or ID of the dashboard of the Power BI app")
        .option("--tile -t <tile>", "Name or ID of the tile of the dashboard of the Power BI app");
    tileShowCommand.addGlobalOptions();
    const tileCommand = new ModuleCommand("tile")
        .description("Manage dashboard tiles of a Power BI apps")
        .addCommand(tileListCommand)
        .addCommand(tileShowCommand);
    tileCommand.addGlobalOptions();
    const appCommand = new ModuleCommand("dashboard")
        .description("Manage dashboards of a Power BI apps")
        .addCommand(listCommand)
        .addCommand(showCommand)
        .addCommand(tileCommand);
    appCommand.addGlobalOptions();
    return appCommand;
}
