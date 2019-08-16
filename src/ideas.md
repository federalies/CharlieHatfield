1. Turn the `constructor` to a render function.

2. Pass in the state. render the state to as an Object.

3. New Object comes with Actions - that permute state - and render thus getting a new object.

# Why Do this?

1. Avoids the `object-pass-by-reference` aspects of JS where objects are too easily mutateable...
2. It should be easier to codegen
3. Still permits `function chaining` fluent API
4. Guarentees that the output object is a direct function of the input object.

## Ideal Usage Pattern

```javascript
const a = Route53({requiredData:true}).helper1(helper1:'data')
```
