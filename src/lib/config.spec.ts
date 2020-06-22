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

import chai from "chai";

import { getConfig } from "./config";

const expect = chai.expect;

describe("config.ts", () => {
    describe("getConfig()", () => {
        it("config, no rc, no path", () => {
            const config = {
                P: "principal",
                T: "tenant",
                S: "secret",
            };
            const output = getConfig(config);
            expect(output.principal).equal("principal");
            expect(output.secret).equal("secret");
            expect(output.tenant).equal("tenant");
        });
        it("no config, no rc, path", () => {
            const config = {
                Z: "",
            };
            process.env.PBICLI_PRINCIPAL = "principal1";
            process.env.PBICLI_SECRET = "secret1";
            process.env.PBICLI_TENANT = "tenant1";
            const output = getConfig(config);
            expect(output.principal).equal("principal1");
            expect(output.secret).equal("secret1");
            expect(output.tenant).equal("tenant1");
        });
        it("(partial) config, no rc, path", () => {
            const config = {
                P: "principal",
                T: "tenant",
            };
            process.env.PBICLI_PRINCIPAL = "principal1";
            process.env.PBICLI_SECRET = "secret1";
            process.env.PBICLI_TENANT = "tenant1";
            const output = getConfig(config);
            expect(output.principal).equal("principal");
            expect(output.secret).equal("secret1");
            expect(output.tenant).equal("tenant");
        });
    });
});
