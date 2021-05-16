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
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

import { getAsToken } from "./astoken";
import { resolveCluster } from "./cluster";
import { Connection, ConnectionType, parse } from "./connectionstring";
import { Cluster, Token, Workspace } from "./interface";
import { executeRequest, executeRequestStream } from "./request";
import { getWorkspace } from "./workspace";
import { getBeginSession, getEndSession, getSessionId } from "./xmla/session";
import { verbose } from "../logging";

enum ConnectionState {
    Closed,
    Open,
    Connecting,
    Executing,
    Fetching,
    Broken,
}

export class ADOMDConnection {
    private connection: Connection;
    private requestId: string;
    private sessionId: string;
    private workspace: Workspace;
    private cluster: Cluster;
    private token: Token;
    private openState: ConnectionState = ConnectionState.Closed;

    constructor(connectionString: string) {
        const connection = parse(connectionString);
        if (!connection) throw "Unable to parse connection string";
        if (connection.connectionType !== ConnectionType.powerbi) throw "Only Power BI Premium connction supported";
        this.connection = connection;
        this.requestId = uuidv4();
    }

    public async open(): Promise<void> {
        if (this.openState === ConnectionState.Open) throw `Connection is already open.`;
        if (!this.connection.token) throw `Unable to retrieve token.`;
        if (this.connection.connectionType !== ConnectionType.powerbi)
            throw "Currently only Power BI Premium endpoint are supported.";
        this.openState = ConnectionState.Connecting;
        this.workspace = await getWorkspace(this.connection, this.requestId);
        if (this.workspace === null || this.workspace.capacityUri === null) {
            this.openState = ConnectionState.Closed;
            throw `Unable to connect to ${this.connection.dataSource}.`;
        }
        this.token = await getAsToken(this.connection, this.workspace);
        this.cluster = await resolveCluster(this.workspace, this.requestId);
        this.sessionId = await this.startSession();
        this.openState = ConnectionState.Open;
    }

    public async close(): Promise<void> {
        if (this.openState === ConnectionState.Open) {
            // end session
            await this.endSession();
        }
        this.openState = ConnectionState.Closed;
    }

    private async startSession(): Promise<string> {
        const beginSessionCommand = getBeginSession(this.connection, this.requestId);
        const result = await this.execute(beginSessionCommand);
        return await getSessionId(result);
    }

    private async endSession(): Promise<void> {
        const endSessionCommand = getEndSession(this.connection, this.requestId, this.sessionId);
        await this.execute(endSessionCommand);
        this.openState = ConnectionState.Closed;
        return;
    }

    public async execute(command: string): Promise<string> {
        this.openState = ConnectionState.Executing;
        const result = (await executeRequest({
            url: `https://${this.cluster.clusterFQDN}/webapi/xmla`,
            method: "POST",
            token: this.token,
            headers: {
                "X-AS-AcquireTokenStats": "AppName=",
                "x-ms-parent-activity-id": this.requestId,
                "x-ms-xmlaserver": this.cluster.coreServerName,
                "x-ms-xmlacaps-negotiation-flags": "0,0,0,0,0",
                "x-ms-accepts-continuations": "1",
                "x-ms-xmladedicatedconnection": "0",
                "x-ms-request-registration-id": uuidv4(),
                "x-ms-round-trip-id": "0",
                "Content-Type": "text/xml",
            },
            body: command,
        })) as string;
        ConnectionState.Open;
        return result;
    }

    public async executeStream(command: string): Promise<Readable> {
        this.openState = ConnectionState.Executing;
        verbose("Start executing command");
        const result = executeRequestStream({
            url: `https://${this.cluster.clusterFQDN}/webapi/xmla`,
            method: "POST",
            token: this.token,
            headers: {
                "X-AS-AcquireTokenStats": "AppName=",
                "x-ms-parent-activity-id": this.requestId,
                "x-ms-xmlaserver": this.cluster.coreServerName,
                "x-ms-xmlacaps-negotiation-flags": "0,0,0,0,0",
                "x-ms-accepts-continuations": "1",
                "x-ms-xmladedicatedconnection": "0",
                "x-ms-request-registration-id": uuidv4(),
                "x-ms-round-trip-id": "0",
                "Content-Type": "text/xml",
            },
            body: command,
        });
        ConnectionState.Open;
        return result;
    }

    public get Connection(): Connection {
        return this.connection;
    }

    public get RequestId(): string {
        return this.requestId;
    }

    public get SessionId(): string {
        return this.sessionId;
    }

    public get Workspace(): Workspace {
        return this.workspace;
    }

    public get Cluster(): Cluster {
        return this.cluster;
    }

    public get Token(): Token {
        return this.token;
    }
}
