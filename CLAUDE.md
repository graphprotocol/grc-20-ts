# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@graphprotocol/grc-20`, a TypeScript SDK for interacting with The Graph's Knowledge Graph. The SDK handles creating entities, properties, types, and relations, encoding them as ops, publishing to IPFS, and submitting transactions onchain.

## Commands

```bash
pnpm build          # Compile TypeScript to dist/
pnpm test           # Run all tests with Vitest
pnpm test -- -t "test name"  # Run a single test by name
pnpm lint           # Check linting with Biome
pnpm lint:fix       # Fix linting issues
pnpm generate:protobuf  # Regenerate protobuf types from .proto files
```

## Architecture

### Data Flow
1. Create ops using `Graph.*` functions (e.g., `Graph.createEntity`, `Graph.createProperty`)
2. Publish ops to IPFS using `Ipfs.publishEdit` - this encodes ops into protobuf binary format
3. Get calldata for the space's governance contract
4. Submit transaction onchain using wallet client

## Code Conventions

- Use `.js` extensions in imports (ES modules)
- Kebab-case filenames (e.g., `create-entity.ts`)
- Test files co-located with source (e.g., `create-entity.test.ts`)
- Use `Id()` type wrapper for all entity/property/relation IDs
- Use `assertValid()` from `id-utils.js` for ID validation in functions
- 2-space indentation, single quotes, trailing commas
- Use Effect library's `Micro` for async error handling in IPFS operations
