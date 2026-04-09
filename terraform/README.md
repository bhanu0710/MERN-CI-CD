## Terraform: Provision AWS EKS

This folder provisions:
- VPC (public + private subnets)
- EKS cluster
- One managed node group

### Prereqs
- Terraform 1.6+
- AWS credentials configured (`aws configure` or env vars)

### Usage

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Notes
- This is a portfolio-friendly baseline. For production you’d add:
  - IRSA, external-dns, cert-manager, cluster-autoscaler/karpenter
  - dedicated IAM roles/policies, logging, backups, security hardening

