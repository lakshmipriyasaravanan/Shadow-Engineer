# Cloud Deployment & DevOps Guide

Shadow Engineer is engineered as a cloud-native platform deployed to AWS using Kubernetes (EKS).

## Architecture

1. **Docker Containerization**:
   - Every service (`core-service`, `ai-service`, `web`) uses multi-stage Dockerfiles.
   - Images are hardened by running as a non-root user and utilizing distroless/alpine base images to reduce the attack surface.

2. **Infrastructure as Code (Terraform)**:
   - Located in `infra/terraform/`.
   - Provisions a secure VPC, an EKS cluster for container orchestration, RDS (PostgreSQL) for relational state, and ElastiCache (Redis) for background task queuing and caching.
   - Best Practice: Terraform state is stored securely in an encrypted S3 bucket.

3. **Kubernetes Orchestration**:
   - Located in `infra/k8s/`.
   - Applications scale dynamically based on CPU/Memory usage via Horizontal Pod Autoscalers (HPA) (to be added).
   - Ingress is managed by the AWS Load Balancer Controller, mapping external traffic directly to an Application Load Balancer with ACM SSL certificates attached.

4. **CI/CD Pipeline**:
   - Configured via GitHub Actions (`.github/workflows/production.yml`).
   - Every merge to `main` builds new Docker images and pushes them to ECR.
   - Publishing a GitHub Release automatically triggers a rolling deployment via `kubectl apply` to the EKS cluster, ensuring zero downtime.

## Performance Testing
A K6 load test (`tests/load/k6-load-test.js`) is included to validate the autoscaling behavior.
Run it locally to simulate traffic spikes up to 200 concurrent users.

```bash
k6 run tests/load/k6-load-test.js
```
