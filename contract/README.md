# Contract

`erp/customers/v1/customers.proto` is canonical for the whole template.
`web/` and `api/` both generate from this tree.

```sh
make generate
```

Generated code is committed in `api/gen/` and `web/src/gen/`. Never edit it by
hand, and never copy the proto into another directory.
