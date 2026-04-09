## MongoDB (Kubernetes)

This project runs MongoDB as a `StatefulSet` with a `PersistentVolumeClaim`.

- **Dev/learning**: see `kubernetes/mongodb-statefulset.yaml`
- **GitOps**: see Helm templates under `helm/mern-app/templates/`

For production, you’d typically use:
- Amazon DocumentDB, or
- a managed MongoDB service (Atlas), or
- an operator (MongoDB Community Operator) with proper backups.

