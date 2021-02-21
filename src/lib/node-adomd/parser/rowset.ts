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
import { createStream, parser, QualifiedAttribute, QualifiedTag, Tag } from "sax";
import { Readable } from "stream";

import { Row, Schema } from "../interface";
import { verbose } from "../../logging";

export async function parseRowSet(result: string): Promise<Row[]> {
    return new Promise<Row[]>((resolve, reject) => {
        const rows: Row[] = [];
        const schema: Schema[] = [];
        let row: Row = {},
            columnName = "",
            isSchema = false,
            isRows = false,
            isError = false;
        const rowSetParser = parser(false, {
            trim: true,
            normalize: true,
            lowercase: true,
            xmlns: true,
        });
        rowSetParser.onopentag = (tag) => {
            ({ isError, isSchema, isRows, columnName } = parseOpenTag(
                tag,
                isError,
                isSchema,
                schema,
                reject,
                isRows,
                columnName
            ));
        };
        rowSetParser.ontext = (text) => {
            const column = schema.filter((col) => col.columnName === columnName)[0];
            row[column.friendlyName] = parseTextValue(column, text);
        };
        rowSetParser.onclosetag = (tag) => {
            ({ isSchema, row } = parseCloseTag(tag, isSchema, (row: Row) => rows.push(row), row));
        };
        rowSetParser.onerror = (err) => {
            reject(err);
        };
        rowSetParser.onend = () => resolve(rows);
        rowSetParser.write(result).close();
    });
}

export function parseRowSetStream(stream: Readable): Promise<Readable> {
    return new Promise<Readable>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const returnStream: Readable = new Readable({ read() {} });
        const schema: Schema[] = [];
        let row: Row = {},
            columnName = "",
            isSchema = false,
            isRows = false,
            isError = false;
        const rowSetParser = createStream(false, {
            trim: true,
            normalize: true,
            lowercase: true,
            xmlns: true,
        });
        rowSetParser.on("opentag", (tag) => {
            ({ isError, isSchema, isRows, columnName } = parseOpenTag(
                tag,
                isError,
                isSchema,
                schema,
                (err: string) => {
                    verbose(`XMLA result of type 'error' found`);
                    stream.pause();
                    returnStream.destroy(new Error(err));
                },
                isRows,
                columnName
            ));
        });
        rowSetParser.on("text", (text) => {
            if (!isError) {
                const column = schema.filter((col) => col.columnName === columnName)[0];
                row[column.friendlyName] = parseTextValue(column, text);
            }
        });
        rowSetParser.on("closetag", (tag) => {
            ({ isSchema, row } = parseCloseTag(
                tag,
                isSchema,
                (row: Row) => returnStream.push(JSON.stringify(row)),
                row
            ));
        });
        rowSetParser.on("error", (err) => {
            verbose(`Error during processing XMLA result`);
            stream.pause();
            returnStream.destroy(err);
        });
        rowSetParser.on("end", () => {
            verbose(`End of XMLA result`);
            returnStream.push(null);
        });
        stream.pipe(rowSetParser);
        resolve(returnStream);
    });
}

function parseOpenTag(
    tag: Tag | QualifiedTag,
    isError: boolean,
    isSchema: boolean,
    schema: Schema[],
    reject: (reason?: unknown) => void,
    isRows: boolean,
    columnName: string
) {
    if (tag.name === "soap:fault") isError = true;
    if (
        !isError &&
        tag.name === "xsd:complextype" &&
        tag.attributes &&
        tag.attributes.name &&
        (tag.attributes.name as QualifiedAttribute).value === "row"
    ) {
        isSchema = true;
    }
    if (isSchema && tag.name === "xsd:element" && tag.attributes && (tag.attributes.name || tag.attributes.type)) {
        schema.push({
            friendlyName: (tag.attributes["sql:field"] as QualifiedAttribute).value,
            columnName: (tag.attributes.name as QualifiedAttribute).value.toLowerCase(),
            dataType: (tag.attributes.type as QualifiedAttribute).value.replace("xsd:", ""),
        });
    }
    if (isError && tag.name === "error") {
        const err = (tag.attributes["description"] as QualifiedAttribute).value;
        const errCode = (tag.attributes["errorcode"] as QualifiedAttribute).value;
        reject(`XMLA Error: ${err} (${errCode})`);
    }
    if (!isError && tag.name === "row") isRows = true;
    if (isRows) {
        columnName = tag.name;
    }
    return { isError, isSchema, isRows, columnName };
}

function parseCloseTag(tag: string, isSchema: boolean, pushRows: (row: Row) => number | boolean, row: Row) {
    if (tag === "xsd:complextype") isSchema = false;
    if (tag === "row") {
        verbose(`New row added to output stream`);
        pushRows(row);
        row = {};
        isSchema = false;
    }
    return { isSchema, row };
}

function parseTextValue(column: Schema, text: string): unknown {
    if (!column) return;
    switch (column.dataType) {
        case "int":
            return Number.parseInt(text);
        case "double":
            return Number.parseFloat(text);
        case "boolean":
            return text === "false" ? false : true;
        default:
            return text;
    }
}
