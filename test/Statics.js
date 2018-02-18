const expect = require("chai").expect
const _ = require("../main.js")

function getData(types = ["nil", "int", "float", "number", "bool", "string", "regexp", "array", "object", "date"]) {
    types = new Set(types)
    let data = []
    if (types.has("nil"))
        data = data.concat([undefined, null])
    if (types.has("infinity"))
        data = data.concat([-Infinity, Infinity])
    if (types.has("nan"))
        data = data.concat([NaN])
    if (types.has("bool"))
        data = data.concat([false, true])
    if (types.has("string"))
        data = data.concat(["", "a", "b", "c", "A", "B", "C", "\x00", "%", "foo", "bar"])
    if (types.has("int") || types.has("number"))
        data = data.concat([-0, 0, 1, 2, 3, 4, 10, 100, 4000, -1, -2, -3, -4, -5, 2 ** 31])
    if (types.has("float") || types.has("number"))
        data = data.concat([1E9, -1E9, 2E9, -3E22, 4.556E128, 0.0042, 5.4E-31, -9.2E-144])
    if (types.has("regexp"))
        data = data.concat([new RegExp(""), /a/, /./g, /foo/])
    if (types.has("array"))
        data = data.concat([[], [0], [""], [1, "foo"]])
    if (types.has("object"))
        data = data.concat([{}, { foo: 0 }, { foo: "bar" }, { 0: 0 }, { 0: 0, 1: 1 }])
    if (types.has("date"))
        data = data.concat([Date.now(), new Date(2014), new Date(2025)])
    return data
}

function checkSanity(data, comparator) {
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data.length; ++j) {
            const x = comparator(data[i], data[j])
            const y = comparator(data[j], data[i])
            expect(x).to.equal(-y)
        }
    }
    for (let i = 0; i < data.length; ++i) {
        const x = comparator(data[i], data[i])
        expect(x).to.equal(0)
    }
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data.length; ++j) {
            for (let k = 0; k < data.length; ++k) {
                const x = comparator(data[i], data[j])
                const y = comparator(data[j], data[k])
                const z = comparator(data[i], data[k])
                if (x <= 0 && y <= 0) {
                    expect(z).to.be.at.most(0)
                }
            }
        }
    }
}

describe("natural", () => {
    it("should sort the same as the default js comparator", () => {
        const data = getData()
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data.length; ++j) {
                expect(_.natural(data[i], data[j])).to.equal(data[i] < data[j] ? -1 : data[i] > data[j] ? 1 : 0);
            }
        }
    })

    it("should the sane", () => {
        const data = getData()
        checkSanity(getData(["number", "infinity"]), _.natural)
        checkSanity(getData(["string"]), _.natural)
        checkSanity(getData(["bool"]), _.natural)
        checkSanity(getData(["date"]), _.natural)
        checkSanity(getData(["array"]), _.natural)
        checkSanity(getData(["object"]), _.natural)
        checkSanity(getData(["regexp"]), _.natural)
    })
})

describe("ignoreCase", () => {
    it("should ignore case", () => {
        const data = getData(["string"]).sort((x, y) => _.natural(x.toLowerCase(), y.toLowerCase()))
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data.length; ++j) {
                const res = data[i].toLowerCase() === data[j].toLowerCase() ? 0 : Math.sign(i - j)
                expect(_.ignoreCase(data[i], data[j])).to.equal(res)
            }
        }
    })

    it("should the sane", () => {
        const data = getData()
        checkSanity(getData(["string"]), _.inverse)
    })
})

describe("inverse", () => {
    it("should sort the same as the default js comparator", () => {
        const data = getData()
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data.length; ++j) {
                expect(_.inverse(data[i], data[j])).to.equal(data[i] < data[j] ? 1 : data[i] > data[j] ? -1 : 0)
            }
        }
    })

    it("should the sane", () => {
        const data = getData()
        checkSanity(getData(["number", "infinity"]), _.inverse)
        checkSanity(getData(["string"]), _.inverse)
        checkSanity(getData(["bool"]), _.inverse)
        checkSanity(getData(["date"]), _.inverse)
        checkSanity(getData(["array"]), _.inverse)
        checkSanity(getData(["object"]), _.inverse)
        checkSanity(getData(["regexp"]), _.inverse)
    })
})

describe("invert", () => {
    it("should give the opposite order", () => {
        expect(_.invert(_.natural)(1, 2)).to.equal(1)
        expect(_.invert(_.natural)(2, 1)).to.equal(-1)
        expect(_.invert(_.natural)(1, 1)).to.equal(0)
    })
})

describe("equals", () => {
    const e = _.equals;
    it("should use the natural order by default", () => {
        expect(e()(9, 9)).to.be.true
        expect(e()(9, 5)).to.be.false
        expect(e()(5, 9)).to.be.false
    })
    it("should allow for a custom comparator", () => {
        const l = _.byProp("length")
        expect(e(l)("a", "b")).to.be.true
        expect(e(l)("a", "a")).to.be.true
        expect(e(l)("b", "a")).to.be.true
        expect(e(l)("a", "")).to.be.false
        expect(e(l)("a", "aa")).to.be.false
        expect(e(l)("aa", "a")).to.be.false
    })
})

describe("comparable", () => {
    class Vector2 {
        constructor(x, y) {
            this.x = x
            this.y=y
        }
        get abs2() {
            return this.x * this.x + this.y * this.y
        }
        compareTo(vector) {
            return Math.sign(this.abs2 - vector.abs2)
        }
        static get comparator() {
            return _.byProp("abs2")
        }
    }
    
    const a = new Vector2(0,0)
    const b = new Vector2(0,1)
    const c = new Vector2(3,4)
    const d = new Vector2(5,12)
    const e = new Vector2(15,8)

    it("should implement the interface correctly", () => {
        expect(a.compareTo(a)).to.equal(0)
        expect(b.compareTo(b)).to.equal(0)
        expect(c.compareTo(c)).to.equal(0)
        expect(d.compareTo(d)).to.equal(0)
        expect(e.compareTo(e)).to.equal(0)

        expect(a.compareTo(b)).to.equal(-1)
        expect(a.compareTo(c)).to.equal(-1)
        expect(a.compareTo(d)).to.equal(-1)
        expect(a.compareTo(e)).to.equal(-1)
        expect(b.compareTo(c)).to.equal(-1)
        expect(b.compareTo(d)).to.equal(-1)
        expect(b.compareTo(e)).to.equal(-1)
        expect(c.compareTo(d)).to.equal(-1)
        expect(c.compareTo(e)).to.equal(-1)
        expect(d.compareTo(e)).to.equal(-1)

        expect(b.compareTo(a)).to.equal(1)
        expect(c.compareTo(a)).to.equal(1)
        expect(d.compareTo(a)).to.equal(1)
        expect(e.compareTo(a)).to.equal(1)
        expect(c.compareTo(b)).to.equal(1)
        expect(d.compareTo(b)).to.equal(1)
        expect(e.compareTo(b)).to.equal(1)
        expect(d.compareTo(c)).to.equal(1)
        expect(e.compareTo(c)).to.equal(1)
        expect(e.compareTo(d)).to.equal(1)
    })

    it("should use the compare to method correctly", () => {
        expect(_.comparable(a,a)).to.equal(0)
        expect(_.comparable(b,b)).to.equal(0)
        expect(_.comparable(c,c)).to.equal(0)
        expect(_.comparable(d,d)).to.equal(0)
        expect(_.comparable(e,e)).to.equal(0)

        expect(_.comparable(a,b)).to.equal(-1)
        expect(_.comparable(a,c)).to.equal(-1)
        expect(_.comparable(a,d)).to.equal(-1)
        expect(_.comparable(a,e)).to.equal(-1)

        expect(_.comparable(b,c)).to.equal(-1)
        expect(_.comparable(b,d)).to.equal(-1)
        expect(_.comparable(b,e)).to.equal(-1)

        expect(_.comparable(c,d)).to.equal(-1)
        expect(_.comparable(c,e)).to.equal(-1)

        expect(_.comparable(d,e)).to.equal(-1)

        expect(_.comparable(b,a)).to.equal(1)
        expect(_.comparable(c,a)).to.equal(1)
        expect(_.comparable(d,a)).to.equal(1)
        expect(_.comparable(e,a)).to.equal(1)

        expect(_.comparable(c,b)).to.equal(1)
        expect(_.comparable(d,b)).to.equal(1)
        expect(_.comparable(e,b)).to.equal(1)

        expect(_.comparable(d,c)).to.equal(1)
        expect(_.comparable(e,c)).to.equal(1)

        expect(_.comparable(e,d)).to.equal(1)
    })
})


describe("equalTo", () => {
    const e = _.equalTo
    it("should use the natural order by default", () => {
        expect(e(9)(9)).to.be.true
        expect(e(9)(5)).to.be.false
        expect(e(5)(9)).to.be.false
    })
    it("should allow for a custom comparator", () => {
        const l = _.byProp("length")
        expect(e("a", l)("b")).to.be.true
        expect(e("a", l)("a")).to.be.true
        expect(e("b", l)("a")).to.be.true
        expect(e("a", l)("")).to.be.false
        expect(e("a", l)("aa")).to.be.false
        expect(e("aa", l)("a")).to.be.false
    })
})

describe("byThreshold", () => {
    const t = _.byThreshold
    it("should assume a default threshold of 1E-12", () => {
        expect(t()(0, 0)).to.be.equal(0)
        expect(t()(0, 0.5E-12)).to.be.equal(0)
        expect(t()(0.5E-12, 0)).to.be.equal(0)
        expect(t()(0, 1E-12)).to.be.equal(-1)
        expect(t()(1E-12, 0)).to.be.equal(1)
        expect(t()(0, 2E-12)).to.be.equal(-1)
        expect(t()(2E-12, 0)).to.be.equal(1)
    })
    it("should deem two number equal iff their difference is less than the threshold", () => {
        expect(t(1)(0, 0)).to.be.equal(0)
        expect(t(1)(0, 0.5)).to.be.equal(0)
        expect(t(1)(0.5, 0)).to.be.equal(0)
        expect(t(1)(0, 1)).to.be.equal(-1)
        expect(t(1)(1, 0)).to.be.equal(1)
        expect(t(1)(0, 2)).to.be.equal(-1)
        expect(t(1)(2, 0)).to.be.equal(1)
    })
    it("should allow for a zero threshold, and cap negative threshold to zero", () => {
        expect(t(0)(0, 0)).to.be.equal(0)
        expect(t(0)(0, 0.5)).to.be.equal(-1)
        expect(t(0)(0.5, 0)).to.be.equal(1)
        expect(t(-1)(0, 0)).to.be.equal(0)
        expect(t(-1)(0, 0.5)).to.be.equal(-1)
        expect(t(-1)(0.5, 0)).to.be.equal(1)
    })
    it("should handle NaN and Infinity correctly", () => {
        expect(t(1)(0, Infinity)).to.be.equal(-1)
        expect(t(1)(Infinity, 0)).to.be.equal(1)
        expect(t(1)(-Infinity, Infinity)).to.be.equal(-1)
        expect(t(1)(Infinity, -Infinity)).to.be.equal(1)
        expect(t(1)(0, NaN)).to.be.equal(-1)
        expect(t(1)(NaN, 0)).to.be.equal(1)
        expect(t(1)(NaN, NaN)).to.be.equal(0)
        expect(t(1)(Infinity, NaN)).to.be.equal(-1)
        expect(t(1)(NaN, Infinity)).to.be.equal(1)
        expect(t(1)(-Infinity, NaN)).to.be.equal(-1)
        expect(t(1)(NaN, -Infinity)).to.be.equal(1)
    })
})

describe("combine", () => {
    it("should sort by the first, then by the second comparator", () => {
        const data = [
            { country: "Japan", city: "Tokyo" },
            { country: "Australia", city: "Bathurst" },
            { country: "Germany", city: "Zurich" },
            { country: "France", city: "Paris" },
            { country: "Japan", city: "Kyoto" },
            { country: "Germany", city: "Dresden" },
            { country: "France", city: "Paris" }
        ]
        data.sort(_.combine(_.byProp("country"), _.byProp("city")))
        expect(data).to.deep.equal([
            { country: "Australia", city: "Bathurst" },
            { country: "France", city: "Paris" },
            { country: "France", city: "Paris" },
            { country: "Germany", city: "Dresden" },
            { country: "Germany", city: "Zurich" },
            { country: "Japan", city: "Kyoto" },
            { country: "Japan", city: "Tokyo" }
        ])
    })
})

describe("byKey", () => {
    const k = _.byKey;
    it("should use the natural comparator by default", () => {
        expect(k(x => x.length)("a", "aa")).to.equal(-1)
        expect(k(x => x.length)("aa", "aa")).to.equal(0)
        expect(k(x => x.length)("aaa", "aa")).to.equal(1)
    })
    it("should allow specifying a custom comparator", () => {
        expect(k(x => x.length, _.inverse)("a", "aa")).to.equal(1)
        expect(k(x => x.length, _.inverse)("aa", "aa")).to.equal(0)
        expect(k(x => x.length, _.inverse)("aaa", "aa")).to.equal(-1)
    })    
})

describe("byProp", () => {
    const p = _.byProp;
    it("should compare by the given property", () => {
        expect(p("length")("a", "aa")).to.equal(-1)
        expect(p("length")("aa", "a")).to.equal(1)
        expect(p("length")("aa", "aa")).to.equal(0)
        expect(p("length")("aa", "aaa")).to.equal(-1)
        expect(p("length")("aaa", "aa")).to.equal(1)
    })
    it("should allow for multiple properties", () => {
        expect(p("_.length")({ _: "a" }, { _: "aa" })).to.equal(-1)
        expect(p("_.length")({ _: "aa" }, { _: "a" })).to.equal(1)
        expect(p("_.length")({ _: "aa" }, { _: "aa" })).to.equal(0)
        expect(p("_.length")({ _: "aa" }, { _: "aaa" })).to.equal(-1)
        expect(p("_.length")({ _: "aaa" }, { _: "aa" })).to.equal(1)

        expect(p("_.$.length")({ _: { $: "a" } }, { _: { $: "aa" } })).to.equal(-1)
        expect(p("_.$.length")({ _: { $: "aa" } }, { _: { $: "a" } })).to.equal(1)
        expect(p("_.$.length")({ _: { $: "aa" } }, { _: { $: "aa" } })).to.equal(0)
        expect(p("_.$.length")({ _: { $: "aa" } }, { _: { $: "aaa" } })).to.equal(-1)
        expect(p("_.$.length")({ _: { $: "aaa" } }, { _: { $: "aa" } })).to.equal(1)
    })
    it("should allow escaping a period", () => {
        expect(p("\\..length")({ '.': "a" }, { '.': "aa" })).to.equal(-1)
        expect(p("\\..length")({ '.': "aa" }, { '.': "a" })).to.equal(1)
        expect(p("\\..length")({ '.': "aa" }, { '.': "aa" })).to.equal(0)
        expect(p("\\..length")({ '.': "aa" }, { '.': "aaa" })).to.equal(-1)
        expect(p("\\..length")({ '.': "aaa" }, { '.': "aa" })).to.equal(1)

        expect(p("_.\\..length")({ _: { '.': "a" } }, { _: { '.': "aa" } })).to.equal(-1)
        expect(p("_.\\..length")({ _: { '.': "aa" } }, { _: { '.': "a" } })).to.equal(1)
        expect(p("_.\\..length")({ _: { '.': "aa" } }, { _: { '.': "aa" } })).to.equal(0)
        expect(p("_.\\..length")({ _: { '.': "aa" } }, { _: { '.': "aaa" } })).to.equal(-1)
        expect(p("_.\\..length")({ _: { '.': "aaa" } }, { _: { '.': "aa" } })).to.equal(1)
    })
    it("should allow for empty string property names", () => {
        expect(p(".length")({ '': "a" }, { '': "aa" })).to.equal(-1)
        expect(p(".length")({ '': "aa" }, { '': "aa" })).to.equal(0)
        expect(p(".length")({ '': "aaa" }, { '': "aa" })).to.equal(1)

        expect(p("foo..length")({ 'foo': {'': "a"}}, { 'foo': {'': "aa"}})).to.equal(-1)
        expect(p("foo..length")({ 'foo': {'': "aa"}}, { 'foo': {'': "aa"}})).to.equal(0)
        expect(p("foo..length")({ 'foo': {'': "aaa"}}, { 'foo': {'': "aa"}})).to.equal(1)

        expect(p("foo.")({ 'foo': {'': 0}}, { 'foo': {'': 1}})).to.equal(-1)
        expect(p("foo.")({ 'foo': {'': 1}}, { 'foo': {'': 1}})).to.equal(0)
        expect(p("foo.")({ 'foo': {'': 2}}, { 'foo': {'': 1}})).to.equal(1)
    })
})

describe("within", () => {
    const w = _.within
    it("should use the default comparator by default", () => {
        expect(w(0, 1)(-1)).to.be.false
        expect(w(0, 1)(0.5)).to.be.true
        expect(w(0, 1)(2)).to.be.false
    })
    it("should accept a custom comparator", () => {
        const custom = w({ id: 0 }, { id: 1 }, { comparator: _.byProp("id") })
        expect(custom({ id: -1 })).to.be.false
        expect(custom({ id: 0.5 })).to.be.true
        expect(custom({ id: -1 })).to.be.false
    })
    it("should allow closed intervals", () => {
        const closed = w(0, 1, { mode: "[]" })
        expect(closed(0)).to.be.true
        expect(closed(1)).to.be.true
        expect(closed(-1)).to.be.false
        expect(closed(2)).to.be.false
    })
    it("should allow open intervals", () => {
        const closed = w(0, 1, { mode: "()" })
        expect(closed(0)).to.be.false
        expect(closed(1)).to.be.false
        expect(closed(-1)).to.be.false
        expect(closed(2)).to.be.false
        const closed2 = w(0, 1, { mode: "][" })
        expect(closed2(0)).to.be.false
        expect(closed2(1)).to.be.false
        expect(closed2(-1)).to.be.false
        expect(closed2(2)).to.be.false
    })
    it("should allow left-open intervals", () => {
        const closed = w(0, 1, { mode: "(]" })
        expect(closed(0)).to.be.false
        expect(closed(1)).to.be.true
        expect(closed(-1)).to.be.false
        expect(closed(2)).to.be.false
        const closed2 = w(0, 1, { mode: "]]" })
        expect(closed2(0)).to.be.false
        expect(closed2(1)).to.be.true
        expect(closed2(-1)).to.be.false
        expect(closed2(2)).to.be.false
    })
    it("should allow right-open intervals", () => {
        const closed = w(0, 1, { mode: "[)" })
        expect(closed(0)).to.be.true
        expect(closed(1)).to.be.false
        expect(closed(-1)).to.be.false
        expect(closed(2)).to.be.false
        const closed2 = w(0, 1, { mode: "[[" })
        expect(closed2(0)).to.be.true
        expect(closed2(1)).to.be.false
        expect(closed2(-1)).to.be.false
        expect(closed2(2)).to.be.false
    })
    it("should throw for unknown modes", () => {
        expect(() => w(0, 1, { mode: "" })).to.throw()
        expect(() => w(0, 1, { mode: 0 })).to.throw()
        expect(() => w(0, 1, { mode: "foo" })).to.throw()
    })
})