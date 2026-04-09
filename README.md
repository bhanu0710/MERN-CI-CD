# Three-Tier MERN on AWS EKS with GitOps CI/CD

This repository is a **portfolio-ready** reference project that demonstrates a production-style three-tier MERN application running on **AWS EKS**, deployed via **GitOps (ArgoCD)**, and built/verified via a **CI/CD pipeline (Jenkins + SonarQube + OWASP Dependency-Check)**.

## Architecture

- **Frontend**: React (built with Vite) served by NGINX
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB (StatefulSet + PVC)
- **Platform**: Kubernetes on AWS EKS
- **Delivery**: Docker (multi-stage images), Helm chart, ArgoCD Application
- **CI Quality Gates**: SonarQube analysis + OWASP Dependency-Check

## Repo layout

```text
mern-eks-cicd/
├── app/
│   ├── frontend/          # React (Vite)
│   ├── backend/           # Node/Express API
│   └── database/          # MongoDB init/notes
├── docker/
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
├── kubernetes/            # Plain manifests (good for learning/debugging)
├── helm/
│   └── mern-app/          # Helm chart used by ArgoCD
├── argocd/
│   └── application.yaml
├── jenkins/
│   └── Jenkinsfile
├── terraform/             # EKS + VPC provisioning
├── sonarqube/
│   └── sonar-project.properties
└── README.md
```

## Quick start (local, without Kubernetes)

### Prereqs
- Node.js 20+
- Docker (optional)

### Backend

```bash
cd app/backend
cp .env.example .env
npm ci
npm run dev
```

### Frontend

```bash
cd app/frontend
cp .env.example .env
npm ci
npm run dev
```

Open the frontend dev URL and it will call the backend at the configured `VITE_API_BASE_URL`.

## Build Docker images (local)

```bash
docker build -f docker/backend.Dockerfile -t mern-backend:local .
docker build -f docker/frontend.Dockerfile -t mern-frontend:local .
```

## Kubernetes (manifests)

Apply manifests in order:

```bash
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mongodb-statefulset.yaml
kubectl apply -f kubernetes/backend-deployment.yaml -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml -f kubernetes/frontend-service.yaml
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/ingress.yaml
```

Manifest image tags are pinned to `stable` (not `latest`) in:
- `kubernetes/backend-deployment.yaml`
- `kubernetes/frontend-deployment.yaml`

For CI-driven manifest deploys, update those tags to the desired commit SHA before `kubectl apply`.

Helper script:

```bash
./scripts/set-image-tag.sh <short-sha>
# example:
./scripts/set-image-tag.sh a1b2c3d
```

## Helm (recommended for GitOps)

```bash
helm upgrade --install mern helm/mern-app -n mern --create-namespace
```

## ArgoCD (GitOps)

- Install ArgoCD on the cluster.
- Update `argocd/application.yaml`:
  - repo URL
  - target revision (branch)
  - ingress host / destination cluster (if needed)
- Apply:

```bash
kubectl apply -f argocd/application.yaml
```

## Jenkins CI/CD

The pipeline in `jenkins/Jenkinsfile` is designed to:

- Build + test backend & frontend
- Run SonarQube scan (quality gate)
- Run OWASP Dependency-Check
- Build & push Docker images tagged with short Git SHA
- Update Helm image tags in `helm/mern-app/values.yaml` with the same Git SHA for GitOps promotion

You’ll need to configure Jenkins credentials and environment variables described in the Jenkinsfile.

## Terraform (EKS)

See `terraform/README.md` for how to provision:
- VPC
- EKS Cluster
- Managed node group(s)

## Demo endpoints

- `GET /api/health`
- `GET /api/todos`
- `POST /api/todos` with JSON `{ "text": "..." }`

