Utility methods for creating comparators, ie. `function (left,right)=>number`. Slightly more versatile than other packages I found.

About 1-2 KB minified without browser polyfills etc.

[Documentation for all methods with examples.](http://htmlpreview.github.io/?https://github.com/blutorange/js-kagura/blob/master/doc/index.html)

# Install

The drill:

```sh
npm install --save kagura
```

Typings for typescript are available.

Use the `dist.js` or `dist.min.js` for browser usage.
Exposes a global object `window.Kagura`.

# Usage

Compare objects by their id property:

```javascript
// import this lib
const { byKey } = require("comparators")

// create array and sort it with a custom comparator
const array = [ {id: 6}, {id: 3} ]

array.sort(byKey(item => item.id));
```

If you are comparing simply by some property, you can also use `byProp`:

```javascript
const { byProp } = require("comparators")
array.sort(byProp("id"))
```

Compare objects by their data->id property in descending order:

```javascript
byProp("data.id", inverse) // preferred

// equivalently you couse use
invert(byProp("data.id"))
byKey(item => - item.data.id)
byKey(item => item.data.id, inverse)
```

Compare objects by their lastName property first, then firstName, then age.

```javascript
combine(
  byProp("lastName"),
  byProp("firstName"),
  byProp("age")
)
```

Find all items equal to "cake".

```javascript
["cake", "chocolate"].filter(equalTo("cake"))

["cake", "Cake", "chocolate"].filter(equalTo("cake"), ignoreCase)

[{name: "cake"}, {name: "chocolate"}]
  .filter(equalTo("cake", byKey("name")))

[{name: "cake"}, {name: "Cake"}, {name: "chocolate"}]
  .filter(equalTo("cake", byKey("name", ignoreCase)))
```

Compare objects by using the comparison operator > and <.

```javascript
[9,7,8].sort(natural) // => [7,8,9]
[9,7,8].sort(inverse) // => [9,8,7]
```

# Build

Probably not going to work on Windows.

```sh
git clone https://github.com/blutorange/js-kagura
cd js-kagura
npm install
npm run build
```

# Teh name

[Senran Kagura](http://en.wikipedia.org/wiki/Senran_Kagura). Which part of the human body are they always concerned with and keep comparing?