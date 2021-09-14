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
import { SinonStub } from "sinon";

import { storeAccessToken, getAccessToken, removeAccessToken } from "./token";

import fs from "fs";
import { TokenStore, TokenType } from "./auth";

const expect = chai.expect;

describe("token.ts", () => {
    let existsSyncMock: SinonStub<unknown[], unknown>;
    let writeFileSyncMock: SinonStub<unknown[], unknown>;
    let mkdirSyncMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    let unlinkSyncMock: SinonStub<unknown[], unknown>;
    let consoleDebugMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        existsSyncMock = ImportMock.mockFunction(fs, "existsSync");
        writeFileSyncMock = ImportMock.mockFunction(fs, "writeFileSync");
        mkdirSyncMock = ImportMock.mockFunction(fs, "mkdirSync");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
        unlinkSyncMock = ImportMock.mockFunction(fs, "unlinkSync");
        consoleDebugMock = ImportMock.mockFunction(console, "debug", true);
    });
    afterEach(() => {
        existsSyncMock.restore();
        writeFileSyncMock.restore();
        mkdirSyncMock.restore();
        readFileSyncMock.restore();
        unlinkSyncMock.restore();
        consoleDebugMock.restore();
    });
    describe("storeAccessToken()", () => {
        it("normal flow", () => {
            existsSyncMock.returns(true);
            writeFileSyncMock.returns(true);
            storeAccessToken({ powerbi: { accessToken: "token" } } as unknown as TokenStore);
            expect(existsSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
        });

        it("missing directory", () => {
            existsSyncMock.returns(false);
            mkdirSyncMock.returns(true);
            writeFileSyncMock.returns(true);
            storeAccessToken({ powerbi: { accessToken: "token" } } as unknown as TokenStore);
            expect(existsSyncMock.callCount).equal(1);
            expect(mkdirSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
        });
    });
    describe("getAccessToken()", () => {
        it("valid stored token", (done) => {
            const expiresOn = new Date().getTime() + 3599;
            existsSyncMock.returns(true);
            readFileSyncMock.returns(
                JSON.stringify({
                    powerbi: {
                        accessToken: "token",
                        expiresOn,
                    },
                })
            );
            getAccessToken(TokenType.POWERBI).then((token) => {
                expect(token).equal("token");
                expect(existsSyncMock.callCount).equal(1);
                expect(readFileSyncMock.callCount).equal(1);
                done();
            });
        });
        it("expired stored token", (done) => {
            const expiresOn = new Date().getTime() - 60;
            existsSyncMock.returns(true);
            readFileSyncMock.returns(
                JSON.stringify({
                    powerbi: {
                        accessToken: "token",
                        expiresOn,
                    },
                })
            );
            getAccessToken(TokenType.POWERBI).then((token) => {
                expect(token).equal("");
                expect(existsSyncMock.callCount).equal(1);
                expect(readFileSyncMock.callCount).equal(1);
                done();
            });
        });
        it("no token stored", (done) => {
            existsSyncMock.returns(false);
            getAccessToken(TokenType.POWERBI).then((token) => {
                expect(token).equal("");
                expect(existsSyncMock.callCount).equal(1);
                expect(readFileSyncMock.callCount).equal(0);
                done();
            });
        });
        it("no correct token stored", (done) => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("");
            getAccessToken(TokenType.POWERBI).then((token) => {
                expect(token).equal("");
                expect(existsSyncMock.callCount).equal(1);
                expect(readFileSyncMock.callCount).equal(1);
                done();
            });
        });
        it("missing directory", (done) => {
            existsSyncMock.returns(false);
            getAccessToken(TokenType.POWERBI).then((token) => {
                expect(token).equal("");
                expect(existsSyncMock.callCount).equal(1);
                expect(readFileSyncMock.callCount).equal(0);
                done();
            });
        });
    });
    describe("removeAccessToken()", () => {
        it("normal flow", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            writeFileSyncMock.returns(true);
            unlinkSyncMock.returns(true);
            removeAccessToken();
            expect(existsSyncMock.callCount).equal(3);
            expect(readFileSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
            expect(unlinkSyncMock.callCount).equal(1);
        });
        it("no token file found", () => {
            existsSyncMock.returns(false);
            writeFileSyncMock.returns(true);
            unlinkSyncMock.returns(true);
            removeAccessToken();
            expect(existsSyncMock.callCount).equal(2);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(unlinkSyncMock.callCount).equal(0);
        });
        it("exception while write", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            writeFileSyncMock.throws();
            unlinkSyncMock.returns(true);
            removeAccessToken();
            expect(existsSyncMock.callCount).equal(3);
            expect(readFileSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
            expect(unlinkSyncMock.callCount).equal(1);
            expect(consoleDebugMock.callCount).equal(1);
        });
        it("exception while delete", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            writeFileSyncMock.returns(true);
            unlinkSyncMock.throws();
            removeAccessToken();
            expect(existsSyncMock.callCount).equal(3);
            expect(readFileSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
            expect(unlinkSyncMock.callCount).equal(1);
            expect(consoleDebugMock.callCount).equal(1);
        });
        it("exception while file lookup", () => {
            existsSyncMock.throws();
            readFileSyncMock.returns("token");
            writeFileSyncMock.returns(true);
            unlinkSyncMock.returns(true);
            removeAccessToken();
            expect(existsSyncMock.callCount).equal(2);
            expect(readFileSyncMock.callCount).equal(0);
            expect(writeFileSyncMock.callCount).equal(0);
            expect(unlinkSyncMock.callCount).equal(0);
            expect(consoleDebugMock.callCount).equal(2);
        });
    });
});
