# Querying Prisma Database Usage via Management API

## Prerequisites

- Bun installed
- A [Prisma Data Platform](https://console.prisma.io) account
- A service token from Console → Settings → Service Tokens

## Steps

### 1. Set up the project

```bash
bun init -y
bun add -d tsx typescript @types/node
bun add dotenv axios
```

### 2. Configure the service token

Create `.env` and add your token:

```
PRISMA_SERVICE_TOKEN="ey..."
```

### 3. Run the script

```bash
bun run index.ts
```

The script will:

1. List all projects and their databases
2. Pick the first database
3. Fetch usage metrics for the current month
4. Print the results as JSON

## Output Example

```
Projects:

- Crisp Blue Penguin (proj_cmse3dqom1z761gf7uj2rck5y)
  Database: Primary database (db_cmse3dqom1z741gf7dz3x8it3) — ready

Fetching usage for database db_cmse3dqom1z741gf7dz3x8it3...

Usage metrics:

{
  "period": {
    "start": "2026-08-01T00:00:00.000Z",
    "end": "2026-08-19T02:58:35.878Z"
  },
  "metrics": {
    "operations": {
      "used": 24136,
      "unit": "ops"
    },
    "storage": {
      "used": 0,
      "unit": "GiB"
    }
  },
  "generatedAt": "2026-08-19T02:58:35.878Z"
}
```
