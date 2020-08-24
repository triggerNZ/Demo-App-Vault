export interface Lens<A, B> {
    get: (a: A) => B
    set: (a: A, b: B) => A
}

export interface Optional<A, B> {
    get: (a: A) => B | undefined
    setOptional: (a: A, b: B) => A
}

export function ll<A, B, C>(ab: Lens<A, B>, bc: Lens<B, C>): Lens<A, C> {
    return {
        get: (a) => bc.get(ab.get(a)),
        set: (a, c) => ab.set(a, bc.set(ab.get(a), c))
    };
}

export function lo<A, B, C>(ab: Lens<A, B>, bc: Optional<B, C>): Optional<A, C> {
    return {
        get: (a) => {
            let b: B = ab.get(a)
            return bc.get(b)
        },
        setOptional: (a, c) => {
            let b = ab.get(a)
            let updatedB = bc.setOptional(b, c)
            return ab.set(a, updatedB)
        }
    }
}

export function ol<A, B, C>(ab: Optional<A, B>, bc: Lens<B, C>): Optional<A, C> {
    return {
        get: (a) => {
            let b = ab.get(a);
            if (b) {
                return bc.get(b);
            } else {
                return undefined;
            }
        },
        setOptional: (a, c) => {
            let b = ab.get(a);
            if (b) {
                let newB = bc.set(b, c);
                return ab.setOptional(a, newB);
            } else {
                return a;
            }
        }
    }
}

export function oo<A, B, C>(ab: Optional<A, B>, bc: Optional<B, C>): Optional<A, C> {
        return {
            get: (a) => {
                let b = ab.get(a);
                if (b === undefined) {
                    return undefined
                } else {
                    return bc.get(b);
                }
            },
            setOptional: (a, c) => {
                let b = ab.get(a);
                if (b !== undefined) {
                    let newB = bc.setOptional(b, c);
                    return ab.setOptional(a, newB);
                } else {
                    return a;
                }
            }
        }
}

export function oll<A, B, C, D>(ab: Optional<A, B>, bc: Lens<B, C>, cd: Lens<C, D>): Optional<A, D> {
    return ol(ab, ll(bc, cd));
}

export function olo<A, B, C, D>(ab: Optional<A, B>, bc: Lens<B, C>, cd: Optional<C, D>): Optional<A, D> {
    return oo(ab, lo(bc, cd));
}

export function modLens<A, B>(ab: Lens<A, B>, a: A, fn: (b: B) => B): A {
    return ab.set(a, fn(ab.get(a)));
}

export function modOptional<A, B>(ab: Optional<A, B>, a: A, fn: (b: B) => B): A {
    let b = ab.get(a);
    if (b === undefined) {
        return a;
    } else {
        return ab.setOptional(a, fn(b));
    }
}

// A bit unsafe because indices aren't checked but useful when we know we are within bounds
export function atL<A>(idx: number) : Lens<A[], A> {
    return {
        get: (arr) => arr[idx],
        set: (arr, newV) => arr.map((oldV, i) => i == idx ? newV : oldV)
    };
}