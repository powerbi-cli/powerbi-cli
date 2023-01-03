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

import { ModuleCommand } from "./command";
//import { OutputType } from "./output";

const expect = chai.expect;

describe("command.ts", () => {
    let infoMock: SinonStub<unknown[], unknown>;
    let errorMock: SinonStub<unknown[], unknown>;
    beforeEach(() => {
        infoMock = ImportMock.mockFunction(console, "info").returns(true);
        errorMock = ImportMock.mockFunction(console, "error").returns(true);
    });
    afterEach(() => {
        infoMock.restore();
        errorMock.restore();
        process.env.PBICLI_interactive = undefined;
    });
    describe("ModuleCommand", () => {
        it("Initialize class", () => {
            const cmd = new ModuleCommand("new");
            expect(cmd.name()).to.equal("new");
            expect(cmd.errorMessage).to.equal(undefined);
            expect(cmd.helpPrompt).to.equal(undefined);
            expect(cmd.isInteractive).to.equal(false);
            expect(cmd.jmsePath).to.equal(undefined);
            expect(cmd.outputFormat).to.equal(undefined);
            expect(cmd.args).to.deep.equal([]);
            expect(cmd.commands.length).to.equal(1);
        });
        it("Set helpPrompt", () => {
            const cmd = new ModuleCommand("new");
            cmd.helpPrompt = "value";
            expect(cmd.helpPrompt).to.equal("value");
        });
        it("Set jmsePath", () => {
            const cmd = new ModuleCommand("new");
            cmd.jmsePath = "value";
            expect(cmd.jmsePath).to.equal("value");
        });
        it("Get isInteractive", () => {
            const cmd = new ModuleCommand("new");
            process.env.PBICLI_interactive = "true";
            expect(cmd.isInteractive).to.equal(true);
        });
        it("showCurrentError() with errorMsg", () => {
            const cmd = new ModuleCommand("new");
            cmd.errorMessage = { value: "value", code: 1 };
            expect(cmd.showCurrentError()).to.not.throw;
            expect(errorMock.callCount).to.equal(1);
        });
        it("showCurrentError() without errorMsg", () => {
            const cmd = new ModuleCommand("new");
            expect(cmd.showCurrentError()).to.not.throw;
            expect(errorMock.callCount).to.equal(0);
        });
        it("outputHelp() interactive mode, no errorMsg", () => {
            const cmd = new ModuleCommand("new");
            process.env.PBICLI_interactive = "true";
            cmd.errorMessage = { value: "value", code: 0 };
            expect(cmd.outputHelp()).to.not.throw;
            expect(infoMock.callCount).to.equal(0);
            expect(errorMock.callCount).to.equal(0);
        });
        // it("outputHelp() interactive mode, errorMsg", () => {
        //     const cmd = new ModuleCommand("new");
        //     process.env.PBICLI_interactive = "true";
        //     cmd.errorMessage = "edrror";
        //     expect(cmd.outputHelp()).to.not.throw;
        //     expect(infoMock.callCount).to.equal(1);
        //     expect(errorMock.callCount).to.equal(1);
        // });
        // it("version", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["version"], { from: "user" })).to.not.throw;
        //     expect(infoMock.callCount).to.equal(1);
        // });
        // it("-o, --output", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["-o"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFormat).to.equal(OutputType.json);
        //     expect(infoMock.callCount).to.equal(0);
        // });
        // it("-o, --output json", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["-o", "json"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFormat).to.equal(OutputType.json);
        //     expect(infoMock.callCount).to.equal(0);
        // });
        // it("-o, --output yml", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["-o", "yml"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFormat).to.equal(OutputType.yml);
        //     expect(infoMock.callCount).to.equal(0);
        // });
        // it("-o, --output tsv", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["-o", "tsv"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFormat).to.equal(OutputType.tsv);
        //     expect(infoMock.callCount).to.equal(0);
        // });
        // it("-o, --output error", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["-o", "error"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFormat).to.equal(OutputType.unknown);
        //     expect(infoMock.callCount).to.equal(0);
        //     expect(errorMock.callCount).to.equal(1);
        // });
        // it("--output-file 'file'", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["--output-file", "file"], { from: "user" })).to.not.throw;
        //     expect(cmd.outputFile).to.equal("file");
        // });
        // it("--query 'query'", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["--query", "query"], { from: "user" })).to.not.throw;
        //     expect(cmd.jmsePath).to.equal("query");
        // });
        // it("--debug", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["--debug"], { from: "user" })).to.not.throw;
        //     expect(process.env.DEBUG).to.equal("true");
        // });
        // it("--verbose", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["--verbose"], { from: "user" })).to.not.throw;
        //     expect(process.env.VERBOSE).to.equal("true");
        // });
        // it("--unknown option", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["--unknown"], { from: "user" })).to.not.throw;
        //     expect(infoMock.callCount).to.equal(0);
        //     expect(errorMock.callCount).to.equal(3); // 3 lines of error
        // });
        // it("unknown command", () => {
        //     const cmd = new ModuleCommand("new");
        //     cmd.addGlobalOptions();
        //     process.env.PBICLI_interactive = "true";
        //     expect(cmd.parse(["unknown"], { from: "user" })).to.not.throw;
        //     expect(infoMock.callCount).to.equal(0);
        //     expect(errorMock.callCount).to.equal(3); // 3 lines of error
        // });
        // it("unknown command (internal)", () => {
        //     const cmd = new ModuleCommand("new");
        //     process.env.PBICLI_interactive = "true";
        //     cmd.args = [""];
        //     expect(cmd.unknownCommand()).to.not.throw;
        //     expect(infoMock.callCount).to.equal(0);
        //     expect(errorMock.callCount).to.equal(0);
        // });
        // it("unknown command (internal, with command)", () => {
        //     const cmd = new ModuleCommand("new");
        //     process.env.PBICLI_interactive = "true";
        //     cmd.args = ["d"];
        //     expect(cmd.unknownCommand()).to.not.throw;
        //     expect(infoMock.callCount).to.equal(0);
        //     expect(errorMock.callCount).to.equal(3); // 3 lines of error
        // });
    });
});
