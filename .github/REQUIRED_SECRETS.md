# Required Secrets & Variables – GitHub Actions CI/CD

This file documents every secret and variable that must be configured
in the GitHub repository before the workflows go live.

---

## How to configure secrets

- **Repository → Settings → Secrets and variables → Actions**
- Use **Environment secrets** for deployment credentials (they are
  scoped to a specific environment and can have required reviewers/wait timers).
- Use **Repository secrets** for cross-environment values.

---

## GitHub Environments

Create three environments in **Settings → Environments**:

| Environment   | Protection rules                           |
| ------------- | ------------------------------------------ |
| `development` | None (auto-deploy on push to `develop`)    |
| `staging`     | Optional: 1 reviewer                       |
| `production`  | Required: ≥1 reviewer + wait timer (5 min) |

---

## Repository-level Secrets

| Secret     | Description                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SYNC_PAT` | Personal Access Token with **`repo`** scope. Used by `hotfix-sync.yml` to push back-merges to protected branches. Create a fine-grained PAT scoped to this repo with _Contents: Read and Write_. |

---

## Environment Secrets

Set the following secrets inside each GitHub environment.

### Vercel (Frontend)

| Secret              | Description                       | How to get it                                           |
| ------------------- | --------------------------------- | ------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel personal API token         | vercel.com → Account Settings → Tokens                  |
| `VERCEL_ORG_ID`     | Vercel team / personal account ID | `vercel teams list` or `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | Vercel project ID                 | `vercel link` then `.vercel/project.json` → `projectId` |

> **Tip:** You can have a single Vercel project and use preview deployments
> for `development` and `staging`, and the production slot for `production`.
> In that case the `VERCEL_PROJECT_ID` is the same in all three environments.

### AWS (Backend – ECR + ECS)

Each environment (development / staging / production) should have its own
IAM role and ECS infrastructure.

| Secret                | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `AWS_ROLE_ARN`        | ARN of the IAM role assumed via OIDC. Format: `arn:aws:iam::<account>:role/<name>` |
| `AWS_REGION`          | AWS region, e.g. `us-east-1`                                                       |
| `ECR_REGISTRY`        | ECR registry URL, e.g. `123456789012.dkr.ecr.us-east-1.amazonaws.com`              |
| `ECR_REPOSITORY`      | ECR repository name, e.g. `stock-sphere-backend`                                   |
| `ECS_CLUSTER`         | Name of the ECS cluster, e.g. `stock-sphere-dev`                                   |
| `ECS_SERVICE`         | Name of the ECS service, e.g. `stock-sphere-backend-svc`                           |
| `ECS_TASK_DEFINITION` | ECS task definition family name, e.g. `stock-sphere-backend`                       |
| `CONTAINER_NAME`      | Container name inside the task definition, e.g. `backend`                          |

---

## AWS IAM Role Requirements

### OIDC Trust Policy

Each role must trust the GitHub OIDC provider:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:Hmtgit7/stock-sphere:*"
        }
      }
    }
  ]
}
```

> Tighten the `sub` condition per environment, e.g.:
>
> - Dev: `"repo:Hmtgit7/stock-sphere:environment:development"`
> - Staging: `"repo:Hmtgit7/stock-sphere:environment:staging"`
> - Prod: `"repo:Hmtgit7/stock-sphere:environment:production"`

### Permission Policy

Attach an inline or managed policy with at minimum:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRAuth",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "ECRPush",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ],
      "Resource": "arn:aws:ecr:<REGION>:<ACCOUNT_ID>:repository/<ECR_REPOSITORY>"
    },
    {
      "Sid": "ECSDescribe",
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:ListTasks"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ECSDeploy",
      "Effect": "Allow",
      "Action": ["ecs:RegisterTaskDefinition", "ecs:UpdateService"],
      "Resource": "*"
    },
    {
      "Sid": "IAMPassRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/<ECS_TASK_EXECUTION_ROLE>"
    }
  ]
}
```

---

## Vercel Token Requirements

The `VERCEL_TOKEN` must have the **Full Account** scope (or at minimum
the project's deploy scope). Generate it at:

> vercel.com → Account Settings → Tokens → Create Token

---

## GitHub Branch Protection Rules

Configure under **Settings → Branches** for each target branch:

### `main`

- ✅ Require a pull request before merging
- ✅ Require approvals: **2**
- ✅ Require status checks: `ci / ci-frontend`, `ci / ci-backend`
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Restrict pushes (only allow merges via PR)
- ✅ Do not allow bypassing the above settings

### `staging`

- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Require status checks: `ci / ci-frontend`, `ci / ci-backend`
- ✅ Require branches to be up to date before merging

### `develop`

- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Recommended: require status checks

---

## Automatic Token (No Setup Required)

| Token          | Provided by | Used in                  |
| -------------- | ----------- | ------------------------ |
| `GITHUB_TOKEN` | GitHub      | Tagging, GitHub Releases |
