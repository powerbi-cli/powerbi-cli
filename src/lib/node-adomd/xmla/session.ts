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
import { parser } from "sax";

import { Connection } from "../connectionstring";
import { determineQueryType, XMLAQueryType } from "./queryType";
import { createEnvelope } from "./envelope";
import { createExecute } from "./execute";
import { getProperties } from "./properties";

export function getSessionId(result: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let sessionId = "";
        const sessionParser = parser(false, {
            trim: true,
            normalize: true,
            lowercase: true,
            xmlns: true,
        });
        sessionParser.onattribute = (attr) => {
            if (attr.name === "sessionid") sessionId = attr.value;
        };
        sessionParser.onerror = (err) => {
            reject(err);
        };
        sessionParser.onend = () => resolve(sessionId);
        sessionParser.write(result).close();
    });
}

export function getBeginSession(connection: Connection, parentActivityId: string): string {
    const header = `
<BeginSession soap:mustUnderstand="1" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns="urn:schemas-microsoft-com:xml-analysis" />
<Version Sequence="920" xmlns="http://schemas.microsoft.com/analysisservices/2003/engine/2" />
<NamespaceCompatibility xmlns="http://schemas.microsoft.com/analysisservices/2003/xmla" mustUnderstand="0"/>`;

    const command = getStatement();
    const properties = getProperties(connection, parentActivityId);

    const body = createExecute(command, properties);
    return createEnvelope(header, body);
}

export function getCommandSession(
    connection: Connection,
    parentActivityId: string,
    sessionId: string,
    query: string
): string {
    const header = `<XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />`;

    const queryType: XMLAQueryType = determineQueryType(query);

    if (queryType === XMLAQueryType.Discover) {
        return createEnvelope(header, query);
    } else {
        const command = queryType === XMLAQueryType.Statement ? getStatement(query) : `<Command>${query}</Command>`;

        const properties = getProperties(connection, parentActivityId);

        const body = createExecute(command, properties);

        return createEnvelope(header, body);
    }
}

function getStatement(statement?: string) {
    if (statement) {
        return `<Command><Statement>${statement}</Statement></Command>`;
    } else {
        return `<Command><Statement /></Command>`;
    }
}

export function getEndSession(connection: Connection, parentActivityId: string, sessionId: string): string {
    const header = `
<EndSession soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns="urn:schemas-microsoft-com:xml-analysis" />`;

    const command = getStatement();
    const properties = getProperties(connection, parentActivityId);

    const body = createExecute(command, properties);

    return createEnvelope(header, body);
}
