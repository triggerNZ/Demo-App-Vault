"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lens_1 = require("../src/lens");
var chai_1 = require("chai");
var alens = {
    get: function (a) { return a.num; },
    set: function (a, b) { return (__assign(__assign({}, a), { num: b })); }
};
var abopt = {
    get: function (aob) {
        switch (aob.kind) {
            case "a":
                return aob;
            case "b":
                return undefined;
        }
    },
    setOptional: function (aob, a) {
        switch (aob.kind) {
            case "a":
                return a;
            case "b":
                return aob;
        }
    }
};
describe('Optics', function () {
    it('optional lens compose matching', function () {
        var result = lens_1.ol(abopt, alens).setOptional({ "kind": "a", num: 1 }, 2);
        chai_1.expect(result).deep.equal({ "kind": "a", num: 2 });
    });
    it('optional lens compose non matching', function () {
        var result = lens_1.ol(abopt, alens).setOptional({ "kind": "b", str: "A" }, 2);
        chai_1.expect(result).deep.equal({ "kind": "b", str: "A" });
    });
    it('modOptional matching ', function () {
        var o = lens_1.ol(abopt, alens);
        var result = lens_1.modOptional(o, { "kind": "a", num: 1 }, function (n) { return n + 1; });
        chai_1.expect(result).deep.equal({ "kind": "a", num: 2 });
    });
});
