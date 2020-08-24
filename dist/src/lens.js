"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atL = exports.modOptional = exports.modLens = exports.olo = exports.oll = exports.oo = exports.ol = exports.lo = exports.ll = void 0;
function ll(ab, bc) {
    return {
        get: function (a) { return bc.get(ab.get(a)); },
        set: function (a, c) { return ab.set(a, bc.set(ab.get(a), c)); }
    };
}
exports.ll = ll;
function lo(ab, bc) {
    return {
        get: function (a) {
            var b = ab.get(a);
            return bc.get(b);
        },
        setOptional: function (a, c) {
            var b = ab.get(a);
            var updatedB = bc.setOptional(b, c);
            return ab.set(a, updatedB);
        }
    };
}
exports.lo = lo;
function ol(ab, bc) {
    return {
        get: function (a) {
            var b = ab.get(a);
            if (b) {
                return bc.get(b);
            }
            else {
                return undefined;
            }
        },
        setOptional: function (a, c) {
            var b = ab.get(a);
            if (b) {
                var newB = bc.set(b, c);
                return ab.setOptional(a, newB);
            }
            else {
                return a;
            }
        }
    };
}
exports.ol = ol;
function oo(ab, bc) {
    return {
        get: function (a) {
            var b = ab.get(a);
            if (b === undefined) {
                return undefined;
            }
            else {
                return bc.get(b);
            }
        },
        setOptional: function (a, c) {
            var b = ab.get(a);
            if (b !== undefined) {
                var newB = bc.setOptional(b, c);
                return ab.setOptional(a, newB);
            }
            else {
                return a;
            }
        }
    };
}
exports.oo = oo;
function oll(ab, bc, cd) {
    return ol(ab, ll(bc, cd));
}
exports.oll = oll;
function olo(ab, bc, cd) {
    return oo(ab, lo(bc, cd));
}
exports.olo = olo;
function modLens(ab, a, fn) {
    return ab.set(a, fn(ab.get(a)));
}
exports.modLens = modLens;
function modOptional(ab, a, fn) {
    var b = ab.get(a);
    if (b === undefined) {
        return a;
    }
    else {
        return ab.setOptional(a, fn(b));
    }
}
exports.modOptional = modOptional;
// A bit unsafe because indices aren't checked but useful when we know we are within bounds
function atL(idx) {
    return {
        get: function (arr) { return arr[idx]; },
        set: function (arr, newV) { return arr.map(function (oldV, i) { return i == idx ? newV : oldV; }); }
    };
}
exports.atL = atL;
