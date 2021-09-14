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
import { ImportMock, MockManager } from "ts-mock-imports";
import chai from "chai";
import { SinonSpy, SinonStub, match, replace, fake, stub } from "sinon";

import { initializeProgram, programModules } from "./lib/program";
import { ModuleCommand } from "./lib/command";

import * as auth from "./lib/auth";

import * as azureserviceclient from "@azure/ms-rest-azure-js";
import fs, { PathOrFileDescriptor } from "fs";
import jsonwebtoken from "jsonwebtoken";
import { DefaultConfig } from "./lib/config";

const expect = chai.expect;
const modules = programModules;

describe("pbicli.ts:", () => {
    let program: ModuleCommand;
    let getAzureCLITokenMock: SinonStub<unknown[], unknown>;
    let getDeviceCodeMock: SinonStub<unknown[], unknown>;
    let getAuthCodeMock: SinonStub<unknown[], unknown>;
    let executeAuthRequestMock: SinonStub<unknown[], unknown>;
    let AzureServiceClientMock: MockManager<unknown>;

    let existsSyncMock: SinonStub<unknown[], unknown>;
    let mkdirSyncMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    let readFileSyncStub: SinonStub;
    let writeFileSyncMock: SinonStub<unknown[], unknown>;

    let decodeMock: SinonStub<unknown[], unknown>;

    let consoleInfoMock: SinonSpy<unknown[], unknown>;
    let consoleErrorMock: SinonSpy<unknown[], unknown>;

    const workspaceId = "2be3e199-afe2-41a2-8d9b-351f0d28dc5d";
    const reportId = "480a31d2-38d0-4658-830f-d45413ac91fa";

    const workspaceListValue = [
        {
            id: workspaceId,
            isReadOnly: "false",
            isOnDedicatedCapacity: "true",
            capacityId: "b2dee298-6938-405f-98a9-80e82c18e45c",
            name: "Test",
        },
    ];

    const reportListValue = [
        {
            id: reportId,
            reportType: "PowerBIReport",
            name: "Test",
            webUrl: `https://app.powerbi.com/groups/${workspaceId}/reports/${reportId}`,
            embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU5PUlRILUVVUk9QRS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOnRydWV9fQ%3d%3d`,
            isFromPbix: true,
            isOwnedByMe: true,
            datasetId: "63cb2a35-0698-45e1-9977-ffd9e9eb5523",
        },
    ];

    const jsmeQuery = `[?name=='Test'].{id:id}`;
    const token = {
        accessToken: "token",
        expiresOn: 1612707018034,
    };
    const tokenResponse = {
        token_type: "Bearer",
        expires_in: 3599,
        ext_expires_in: 3599,
        access_token: "token",
        refresh_token: "resfrehToken",
    };

    beforeEach(() => {
        program = initializeProgram(modules);
        // Make sure that old variables are removed
        delete process.env.PBICLI_outputFormat;
        delete process.env.PBICLI_outputFile;
        delete process.env.PBICLI_jmsePath;

        getAzureCLITokenMock = ImportMock.mockFunction(auth, "getAzureCLIToken").resolves(token);
        getDeviceCodeMock = ImportMock.mockFunction(auth, "getDeviceCode").resolves(token);
        getAuthCodeMock = ImportMock.mockFunction(auth, "getAuthCode").resolves(token);
        executeAuthRequestMock = ImportMock.mockFunction(auth, "executeAuthRequest").resolves(tokenResponse);

        AzureServiceClientMock = ImportMock.mockClass(azureserviceclient, "AzureServiceClient");

        existsSyncMock = ImportMock.mockFunction(fs, "existsSync").returns(true);
        mkdirSyncMock = ImportMock.mockFunction(fs, "mkdirSync").returns(true);
        readFileSyncStub = stub(fs, "readFileSync").callsFake((path: unknown) => {
            if ((path as string).indexOf("accessTokens.json") !== -1) {
                return JSON.stringify({
                    powerbi: {
                        accessToken: "token",
                        expiresOn: new Date().getTime() + 3599,
                    },
                });
            } else {
                return JSON.stringify(DefaultConfig);
            }
        });
        writeFileSyncMock = ImportMock.mockFunction(fs, "writeFileSync");
        writeFileSyncMock.returns(true);

        decodeMock = ImportMock.mockFunction(jsonwebtoken, "decode");
        decodeMock.returns({ exp: Math.floor((new Date() as unknown as number) / 1000) + 3599 });

        consoleInfoMock = ImportMock.mockFunction(console, "info", true);
        consoleErrorMock = ImportMock.mockFunction(console, "error", true);
    });

    afterEach(() => {
        getAzureCLITokenMock.restore();
        getDeviceCodeMock.restore();
        getAuthCodeMock.restore();
        executeAuthRequestMock.restore();
        AzureServiceClientMock.restore();

        existsSyncMock.restore();
        mkdirSyncMock.restore();
        readFileSyncStub.restore();
        //readFileSyncMock.restore();
        writeFileSyncMock.restore();

        decodeMock.restore();

        consoleInfoMock.restore();
        consoleErrorMock.restore();
    });

    describe("pbicli login", () => {
        it("with no error", (done) => {
            existsSyncMock.returns(false); // No stored token, as expected
            program.parseAsync(["login"], { from: "user" }).finally(() => {
                done();
            });
        });

        it("with --interactive and no error", (done) => {
            existsSyncMock.returns(false); // No stored token, as expected
            program.parseAsync(["login", "--interactive"], { from: "user" }).finally(() => {
                done();
            });
        });

        it("with --azurecli and no error", (done) => {
            existsSyncMock.returns(false); // No stored token, as expected
            program.parseAsync(["login", "--azurecli"], { from: "user" }).finally(() => {
                done();
            });
        });

        it("with --service-principal and no error", (done) => {
            existsSyncMock.returns(false); // No stored token, as expected
            program
                .parseAsync(
                    [
                        "login",
                        "--service-principal",
                        "--principal",
                        "principal",
                        "--secret",
                        "secret",
                        "--tenant",
                        "tenant",
                    ],
                    {
                        from: "user",
                    }
                )
                .finally(() => {
                    done();
                });
        });
    });

    describe("pbicli workspace", () => {
        beforeEach(() => {
            AzureServiceClientMock.mock(
                "sendRequest" as never,
                Promise.resolve({
                    status: 200,
                    parsedBody: {
                        value: workspaceListValue,
                    },
                })
            );
        });

        it("list", (done) => {
            program
                .parseAsync(["workspace", "list"], { from: "user" })
                .then(() => {
                    expect(consoleInfoMock.calledWith(match(JSON.stringify(workspaceListValue, null, " ")))).be.true;
                    expect(consoleInfoMock.callCount).equal(1);
                    done();
                })
                .catch((e) => {
                    console.log(e);
                    done();
                });
        });

        it("list --query", (done) => {
            program.parseAsync(["workspace", "list", "--query", jsmeQuery], { from: "user" }).then(() => {
                expect(consoleInfoMock.calledWith(match(new RegExp(workspaceId)))).be.true;
                expect(consoleInfoMock.callCount).equal(1);
                done();
            });
        });
    });

    describe("pbicli reports", () => {
        beforeEach(() => {
            AzureServiceClientMock.mock(
                "sendRequest" as never,
                Promise.resolve({
                    status: 200,
                    parsedBody: {
                        value: reportListValue,
                    },
                })
            );
        });

        it("list", (done) => {
            program.parseAsync(["report", "list", "--workspace", workspaceId], { from: "user" }).then(() => {
                expect(consoleInfoMock.calledWith(match(JSON.stringify(reportListValue, null, " ")))).be.true;
                expect(consoleInfoMock.callCount).equal(1);
                done();
            });
        });

        it("list --query", (done) => {
            program
                .parseAsync(["report", "list", "--workspace", workspaceId, "--query", jsmeQuery], {
                    from: "user",
                })
                .then(() => {
                    expect(consoleInfoMock.calledWith(match(new RegExp(reportId)))).be.true;
                    expect(consoleInfoMock.callCount).equal(1);
                    done();
                });
        });
    });
});
