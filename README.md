Utility methods for creating comparators, ie. function (left,right)=>number. Slightly more versatile than other packages I found.

Compare objects by their id property:

```javascript
byKey(item => item.id)
byField("id")
```

Compare objects by their data->id property in descending order:

```javascript
byField("data.id", naturalInverse) // preferred
invert(byField("data.id"))
byKey(item => - item.data.id)
byKey(item => item.data.id, naturalInverse)
```

Compare objects by their lastName property first, then firstName, then age.

```javascript
combine(
  byField("lastName"),
  byField("firstName"),
  byField("age")
)
```

