# Pipeline CI/CD (GitHub Actions)

Workflow : `.github/workflows/ci.yml`

## Déclencheurs
- `push`
- `pull_request`

## Jobs
### api (Node)
- Checkout
- Setup Node
- Install
- Lint
- Test

### discovery-service (Node)
Même étapes que `api`.

### ia-service (Python)
- Checkout
- Setup Python
- Install deps
- Lint (ruff)
- Tests (pytest)
