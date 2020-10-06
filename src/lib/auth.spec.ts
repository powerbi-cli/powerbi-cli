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

import { storeAccessToken, getAccessToken, removeAccessToken } from "./auth";

import fs from "fs";
import jsonwebtoken from "jsonwebtoken";

const expect = chai.expect;

describe("auth.ts", () => {
    let existsSyncMock: SinonStub<unknown[], unknown>;
    let writeFileSyncMock: SinonStub<unknown[], unknown>;
    let mkdirSyncMock: SinonStub<unknown[], unknown>;
    let readFileSyncMock: SinonStub<unknown[], unknown>;
    let unlinkSyncMock: SinonStub<unknown[], unknown>;
    let decodeMock: SinonStub<unknown[], unknown>;
    let consoleDebugMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        existsSyncMock = ImportMock.mockFunction(fs, "existsSync");
        writeFileSyncMock = ImportMock.mockFunction(fs, "writeFileSync");
        mkdirSyncMock = ImportMock.mockFunction(fs, "mkdirSync");
        readFileSyncMock = ImportMock.mockFunction(fs, "readFileSync");
        unlinkSyncMock = ImportMock.mockFunction(fs, "unlinkSync");
        decodeMock = ImportMock.mockFunction(jsonwebtoken, "decode");
        consoleDebugMock = ImportMock.mockFunction(console, "debug", true);
    });
    afterEach(() => {
        existsSyncMock.restore();
        writeFileSyncMock.restore();
        mkdirSyncMock.restore();
        readFileSyncMock.restore();
        unlinkSyncMock.restore();
        decodeMock.restore();
        consoleDebugMock.restore();
    });
    describe("storeAccessToken()", () => {
        it("normal flow", () => {
            existsSyncMock.returns(true);
            writeFileSyncMock.returns(true);
            storeAccessToken("");
            expect(existsSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
        });

        it("missing directory", () => {
            existsSyncMock.returns(false);
            mkdirSyncMock.returns(true);
            writeFileSyncMock.returns(true);
            storeAccessToken("");
            expect(existsSyncMock.callCount).equal(1);
            expect(mkdirSyncMock.callCount).equal(1);
            expect(writeFileSyncMock.callCount).equal(1);
        });
    });
    describe("getAccessToken()", () => {
        it("valid stored token", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            decodeMock.returns({ exp: Math.floor(((new Date() as unknown) as number) / 1000) + 3599 });
            expect(getAccessToken()).equal("token");
            expect(existsSyncMock.callCount).equal(1);
            expect(readFileSyncMock.callCount).equal(1);
            expect(decodeMock.callCount).equal(1);
        });
        it("expired stored token", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            decodeMock.returns({ exp: Math.floor(((new Date() as unknown) as number) / 1000) - 60 });
            expect(getAccessToken()).equal("");
            expect(existsSyncMock.callCount).equal(1);
            expect(readFileSyncMock.callCount).equal(1);
            expect(decodeMock.callCount).equal(1);
        });
        it("exception during validation", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("token");
            decodeMock.throws();
            expect(getAccessToken()).equal("");
            expect(existsSyncMock.callCount).equal(4);
            expect(readFileSyncMock.callCount).equal(2);
            expect(decodeMock.callCount).equal(1);
        });
        it("no token stored", () => {
            existsSyncMock.returns(true);
            readFileSyncMock.returns("");
            expect(getAccessToken()).equal("");
            expect(existsSyncMock.callCount).equal(1);
            expect(readFileSyncMock.callCount).equal(1);
            expect(decodeMock.callCount).equal(0);
        });
        it("missing directory", () => {
            existsSyncMock.returns(false);
            expect(getAccessToken()).equal("");
            expect(existsSyncMock.callCount).equal(1);
            expect(readFileSyncMock.callCount).equal(0);
            expect(decodeMock.callCount).equal(0);
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
