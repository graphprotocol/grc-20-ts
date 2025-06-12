# Contributing

## Running tests

```bash
pnpm test
```

## Running linting

```bash
pnpm lint
```

## Build library

```bash
pnpm build
```

## Generating protobuf files

```bash
pnpm generate:protobuf
```

## Creating a new changeset in a PR

```bash
pnpm changeset
```

## Publishing a new version

```bash
pnpm changeset version # commit the changes
pnpm build
pnpm changeset publish
gh release create
```