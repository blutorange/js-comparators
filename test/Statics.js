const expect = require("chai").expect
const _ = require("../main.js")

function getData(types = ["nil", "int", "float", "number", "bool", "string", "regexp", "array", "object", "date"]) {
    types = new Set(types);
    let data = [];
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
        data = data.concat([-0,0,1,2,3,4,10,100,4000,-1,-2,-3,-4,-5, 2**31])
    if (types.has("float") || types.has("number"))
        data = data.concat([1E9,-1E9,2E9,-3E22,4.556E128,0.0042,5.4E-31, -9.2E-144])
    if (types.has("regexp"))
        data = data.concat([new RegExp(""), /a/, /./g, /foo/])
    if (types.has("array"))
        data = data.concat([[], [0], [""], [1, "foo"]])
    if (types.has("object"))
        data = data.concat([{}, {foo: 0}, {foo: "bar"}, {0: 0}, {0: 0, 1:1}])
    if (types.has("date"))
        data = data.concat([Date.now(), new Date(2014), new Date(2025)])
    return data;
}

function checkSanity(data, comparator) {
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data.length; ++j) {
            const x = comparator(data[i], data[j]);
            const y = comparator(data[j], data[i]);
            expect(x).to.equal(-y);
        }
    }
    for (let i = 0; i < data.length; ++i) {
        const x = comparator(data[i], data[i]);
        expect(x).to.equal(0);
    }
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data.length; ++j) {
            for (let k = 0; k < data.length; ++k) {
                const x = comparator(data[i], data[j]);
                const y = comparator(data[j], data[k]);
                const z = comparator(data[i], data[k]);
                if (x <=0 && y <= 0) {
                    expect(z).to.be.at.most(0);
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
        const data = getData(["string"]).sort((x,y)=>_.natural(x.toLowerCase(), y.toLowerCase()))
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data.length; ++j) {
                const res = data[i].toLowerCase() === data[j].toLowerCase() ? 0 : Math.sign(i-j);
                expect(_.ignoreCase(data[i], data[j])).to.equal(res);
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
                expect(_.inverse(data[i], data[j])).to.equal(data[i] < data[j] ? 1 : data[i] > data[j] ? -1 : 0);
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