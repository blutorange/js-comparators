Utility methods for creating comparators, ie. `function (left,right)=>number`. Slightly more versatile than other packages I found.

[Documentation for all methods.](http://htmlpreview.github.io/?https://github.com/blutorange/js-comparators/blob/master/doc/index.html)

Compare objects by their id property:

```javascript
// import this lib
const { byKey } = require("comparators")
// create array and sort it with a custom comparator
const array = [{id: 6}, {id: 3}]
array.sort(byKey(item => item.id));
```

If you are comparing simply by some property, you can also use `byField`:

```javascript
array.sort(byProp("id"))
```

Compare objects by their data->id property in descending order:

```javascript
byProp("data.id", naturalInverse) // preferred
invert(byField("data.id"))
byKey(item => - item.data.id)
byKey(item => item.data.id, naturalInverse)
```

Compare objects by their lastName property first, then firstName, then age.

```javascript
combine(
  byProp("lastName"),
  byProp("firstName"),
  byProp("age")
)
```

