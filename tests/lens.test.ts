
import {Lens, Optional, ol, modOptional} from '../src/lens';
import {expect} from 'chai';

type A = {kind: "a", num: number}
type B = {kind: "b", str: string}
type AoB = A | B;

let alens: Lens<A, number> = {
    get: (a) => a.num,
    set: (a, b) => ({...a, num: b})
}

let abopt: Optional<AoB, A> = {
    get: (aob) => {
        switch (aob.kind) {
            case "a":
                return aob;
            case "b":
                return undefined;    
        }
    },
    setOptional: (aob, a) => {
        switch (aob.kind) {
            case "a":
                return a;
            case "b":
                return aob;    
        }
    }
};

describe('Optics', function() {
    it('optional lens compose matching', function() {
      let result = ol(abopt, alens).setOptional({"kind": "a", num: 1}, 2)
      expect(result).deep.equal({"kind": "a", num: 2});
    }); 
    it('optional lens compose non matching', function() {
        let result = ol(abopt, alens).setOptional({"kind": "b", str: "A"}, 2)
        expect(result).deep.equal({"kind": "b", str: "A"});
      });
      
      it('modOptional matching ', function() {
        let o = ol(abopt, alens)
        let result = modOptional(o, {"kind": "a", num: 1}, (n) => n + 1)
        expect(result).deep.equal({"kind": "a", num: 2});
      }); 
  });