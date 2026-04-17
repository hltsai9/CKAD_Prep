// CKAD Practice Questions — organized by the 5 official curriculum domains.
// Each question has: type, prompt, optional yaml, choices, answer (index), explanation, docs.
// Docs links point to kubernetes.io official documentation.

const CURRICULUM = [
  {
    id: "design-build",
    title: "1. Application Design and Build",
    weight: "20%",
    description:
      "Container images, Jobs and CronJobs, multi-container Pod patterns (sidecar, init, etc.), and persistent/ephemeral volumes.",
    questions: [
      {
        type: "mcq",
        prompt:
          "You need to run a batch task to completion exactly 5 times, running up to 2 pods in parallel. Which workload should you use?",
        choices: [
          "A Deployment with replicas: 5",
          "A StatefulSet with replicas: 5",
          "A Job with completions: 5 and parallelism: 2",
          "A CronJob with schedule: '*/5 * * * *'"
        ],
        answer: 2,
        explanation:
          "Jobs run pods to completion. `completions` controls total successful pod runs; `parallelism` controls how many run at once.",
        docs: {
          label: "Kubernetes docs: Jobs",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/job/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the missing field so that this container runs BEFORE the main application container and must finish successfully first:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: web\nspec:\n  ______:\n    - name: wait-for-db\n      image: busybox\n      command: ['sh','-c','until nslookup db; do sleep 2; done']\n  containers:\n    - name: web\n      image: nginx",
        choices: ["initContainers", "sidecars", "preStart", "startupContainers"],
        answer: 0,
        explanation:
          "`initContainers` run to completion before any regular `containers` start. They're ideal for setup/wait logic.",
        docs: {
          label: "Kubernetes docs: Init Containers",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Dockerfile instruction sets the default command that will be executed when the container starts, and can be overridden by `docker run ... <cmd>`?",
        choices: ["ENTRYPOINT", "CMD", "RUN", "EXPOSE"],
        answer: 1,
        explanation:
          "`CMD` provides defaults (command or args) and is overridden by arguments to `docker run`. `ENTRYPOINT` is not overridden by default.",
        docs: {
          label: "Docker docs: CMD vs ENTRYPOINT",
          url: "https://docs.docker.com/reference/dockerfile/#cmd"
        }
      },
      {
        type: "tf",
        prompt:
          "An `emptyDir` volume survives when the Pod is deleted from the node.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "`emptyDir` lives for the lifetime of the Pod on its node. When the Pod is deleted, the data is gone. Use a PersistentVolume for durable storage.",
        docs: {
          label: "Kubernetes docs: Volumes — emptyDir",
          url: "https://kubernetes.io/docs/concepts/storage/volumes/#emptydir"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the CronJob so it runs every day at 03:00 UTC:",
        yaml:
          "apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: nightly\nspec:\n  schedule: \"______\"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n            - name: job\n              image: busybox\n              args: ['echo','hi']",
        choices: ["0 3 * * *", "*/3 * * * *", "3 0 * * *", "@daily 03:00"],
        answer: 0,
        explanation:
          "Cron fields are: minute hour day-of-month month day-of-week. `0 3 * * *` = at minute 0 of hour 3, every day.",
        docs: {
          label: "Kubernetes docs: CronJob",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Your Job keeps retrying after its pod fails. Which field caps the number of retries before the Job is marked Failed?",
        choices: [
          "spec.completions",
          "spec.parallelism",
          "spec.backoffLimit",
          "spec.activeDeadlineSeconds"
        ],
        answer: 2,
        explanation:
          "`backoffLimit` sets the maximum number of retries (default 6). `activeDeadlineSeconds` is a time cap that overrides backoff behavior.",
        docs: {
          label: "Kubernetes docs: Jobs — Pod backoff failure policy",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the volume source so this Pod mounts an existing PersistentVolumeClaim named `data-pvc`:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: db\nspec:\n  containers:\n    - name: db\n      image: postgres\n      volumeMounts:\n        - name: data\n          mountPath: /var/lib/postgresql/data\n  volumes:\n    - name: data\n      ______:\n        claimName: data-pvc",
        choices: ["persistentVolumeClaim", "hostPath", "emptyDir", "configMap"],
        answer: 0,
        explanation:
          "The `persistentVolumeClaim` volume source references a PVC by `claimName` and makes its bound PersistentVolume available to the Pod.",
        docs: {
          label: "Kubernetes docs: Persistent Volumes — Claims as Volumes",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#claims-as-volumes"
        }
      },
      {
        type: "tf",
        prompt:
          "All containers in a Pod share the same network namespace and can communicate over localhost.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Pod containers share network (and IPC) namespaces, so they reach each other via 127.0.0.1 and must use distinct ports.",
        docs: {
          label: "Kubernetes docs: Pods — How Pods manage multiple containers",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/#how-pods-manage-multiple-containers"
        }
      },
      {
        type: "mcq",
        prompt:
          "What are the only valid values for `restartPolicy` on the pod template of a Job?",
        choices: [
          "Always or OnFailure",
          "OnFailure or Never",
          "Always or Never",
          "Only Always"
        ],
        answer: 1,
        explanation:
          "Job pods must use `OnFailure` or `Never`. `Always` is invalid for Jobs because the Job controller — not the kubelet — is responsible for retrying failed pods.",
        docs: {
          label: "Kubernetes docs: Jobs — Handling Pod and container failures",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/job/#handling-pod-and-container-failures"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this CronJob skips a new run if the previous one is still in progress:",
        yaml:
          "apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: report\nspec:\n  schedule: \"*/5 * * * *\"\n  ______: Forbid\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n            - name: job\n              image: busybox\n              args: ['sleep','600']",
        choices: ["concurrencyPolicy", "parallelism", "suspend", "startingDeadlineSeconds"],
        answer: 0,
        explanation:
          "`concurrencyPolicy` can be `Allow` (default), `Forbid` (skip a new run if the old is still active), or `Replace` (cancel the running job and start the new one).",
        docs: {
          label: "Kubernetes docs: CronJob — Concurrency policy",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#concurrency-policy"
        }
      }
    ]
  },
  {
    id: "deployment",
    title: "2. Application Deployment",
    weight: "20%",
    description:
      "Deployment strategies (blue/green, canary), rolling updates, and Helm basics.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which imperative kubectl command updates a Deployment's image and triggers a rolling update?",
        choices: [
          "kubectl edit deployment web --image=nginx:1.25",
          "kubectl set image deployment/web nginx=nginx:1.25",
          "kubectl replace image deployment web nginx:1.25",
          "kubectl upgrade deployment/web --image nginx:1.25"
        ],
        answer: 1,
        explanation:
          "`kubectl set image deployment/<name> <container>=<image>` updates the container image and the Deployment controller performs a rolling update.",
        docs: {
          label: "Kubernetes docs: Performing a Rolling Update",
          url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the strategy so that at most 1 extra pod is created above the desired count and at most 1 pod can be unavailable during the update:",
        yaml:
          "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  strategy:\n    type: ______\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 1\n  selector:\n    matchLabels: { app: web }\n  template:\n    metadata: { labels: { app: web } }\n    spec:\n      containers:\n        - name: web\n          image: nginx",
        choices: ["Recreate", "RollingUpdate", "BlueGreen", "Canary"],
        answer: 1,
        explanation:
          "`RollingUpdate` is the default Deployment strategy and supports `maxSurge` and `maxUnavailable`. `Recreate` terminates all pods before creating new ones.",
        docs: {
          label: "Kubernetes docs: Deployments — Strategy",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy"
        }
      },
      {
        type: "mcq",
        prompt:
          "You rolled out a bad image. Which command rolls the Deployment back to its previous revision?",
        choices: [
          "kubectl rollout undo deployment/web",
          "kubectl rollout revert deployment/web",
          "kubectl rollback deployment/web",
          "kubectl delete deployment/web && kubectl apply -f previous.yaml"
        ],
        answer: 0,
        explanation:
          "`kubectl rollout undo deployment/<name>` rolls back to the previous revision. Use `--to-revision=N` to target a specific one.",
        docs: {
          label: "Kubernetes docs: Rolling back a Deployment",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment"
        }
      },
      {
        type: "tf",
        prompt:
          "Helm 3 requires Tiller running in the cluster.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Helm 3 removed Tiller. The Helm CLI talks directly to the Kubernetes API using your kubeconfig.",
        docs: {
          label: "Helm docs: Helm 3 Changes",
          url: "https://helm.sh/docs/faq/changes_since_helm2/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want to implement a simple canary: send most traffic to v1 and a small slice to v2 using a single Service. What's the most Kubernetes-native way?",
        choices: [
          "Use two Deployments sharing the same Service label selector, with different replica counts (e.g. 9 vs 1)",
          "Use `kubectl edit service` to set percentages",
          "Annotate the Pod with canary: true",
          "Set a `trafficSplit` field in the Deployment"
        ],
        answer: 0,
        explanation:
          "Without a service mesh, the classic approach is two Deployments that share labels matched by one Service, with replica counts acting as the traffic ratio (rough, not precise).",
        docs: {
          label: "Kubernetes docs: Canary deployments",
          url: "https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#canary-deployments"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which imperative command scales the Deployment `web` to 5 replicas?",
        choices: [
          "kubectl scale deployment/web --replicas=5",
          "kubectl set replicas deployment/web=5",
          "kubectl deployment web --scale=5",
          "kubectl resize deployment web 5"
        ],
        answer: 0,
        explanation:
          "`kubectl scale deployment/<name> --replicas=N` imperatively resizes a Deployment (also works for ReplicaSet and StatefulSet).",
        docs: {
          label: "kubectl reference: scale",
          url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the strategy type so that all existing pods are terminated BEFORE any new ones are created:",
        yaml:
          "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: legacy\nspec:\n  replicas: 3\n  strategy:\n    type: ______\n  selector:\n    matchLabels: { app: legacy }\n  template:\n    metadata: { labels: { app: legacy } }\n    spec:\n      containers:\n        - name: app\n          image: legacy:1",
        choices: ["RollingUpdate", "Recreate", "Replace", "BlueGreen"],
        answer: 1,
        explanation:
          "`Recreate` deletes all old pods before starting new ones — useful when the app can't tolerate two versions running at once. `RollingUpdate` is the default.",
        docs: {
          label: "Kubernetes docs: Deployments — Strategy",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command lists the revision history for the Deployment `web` so you can pick a revision to roll back to?",
        choices: [
          "kubectl get revisions deployment/web",
          "kubectl rollout history deployment/web",
          "kubectl history deployment/web",
          "kubectl describe deployment/web --revisions"
        ],
        answer: 1,
        explanation:
          "`kubectl rollout history deployment/<name>` shows revisions. Use `--revision=N` to see details for a specific revision.",
        docs: {
          label: "Kubernetes docs: Checking rollout history",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#checking-rollout-history-of-a-deployment"
        }
      },
      {
        type: "tf",
        prompt:
          "A Deployment manages Pods directly and does not create ReplicaSets.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "A Deployment creates and manages a ReplicaSet per revision; each ReplicaSet in turn manages its Pods. Rolling updates work by ramping ReplicaSets up and down.",
        docs: {
          label: "Kubernetes docs: Deployments",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Helm command installs a chart if the release doesn't exist yet, or upgrades it if it does?",
        choices: [
          "helm install --force myapp ./chart",
          "helm upgrade --install myapp ./chart",
          "helm apply myapp ./chart",
          "helm deploy myapp ./chart"
        ],
        answer: 1,
        explanation:
          "`helm upgrade --install <release> <chart>` is idempotent — it installs on first run and upgrades on subsequent runs. Common in CI pipelines.",
        docs: {
          label: "Helm docs: helm upgrade",
          url: "https://helm.sh/docs/helm/helm_upgrade/"
        }
      }
    ]
  },
  {
    id: "observability",
    title: "3. Application Observability and Maintenance",
    weight: "15%",
    description:
      "API deprecations, probes/health checks, monitoring, container logs, and debugging.",
    questions: [
      {
        type: "yaml",
        prompt:
          "Fill in the probe type that, if it fails, causes the kubelet to RESTART the container:",
        yaml:
          "containers:\n  - name: app\n    image: myapp:1\n    ______:\n      httpGet:\n        path: /healthz\n        port: 8080\n      initialDelaySeconds: 10\n      periodSeconds: 5",
        choices: ["readinessProbe", "livenessProbe", "startupProbe", "healthProbe"],
        answer: 1,
        explanation:
          "A failing `livenessProbe` causes the container to be restarted. `readinessProbe` affects Service endpoint inclusion. `startupProbe` gates the other probes until the app has started.",
        docs: {
          label: "Kubernetes docs: Liveness, Readiness and Startup Probes",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command streams logs from a specific container in a multi-container pod named `web` with containers `app` and `proxy`?",
        choices: [
          "kubectl logs web",
          "kubectl logs web --container=proxy -f",
          "kubectl logs -f pod/web/proxy",
          "kubectl describe pod web --container proxy"
        ],
        answer: 1,
        explanation:
          "`kubectl logs <pod> -c <container>` (or `--container=<c>`) selects a specific container. `-f` follows the stream.",
        docs: {
          label: "kubectl reference: logs",
          url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command shows CPU/memory usage of pods in the current namespace (requires metrics-server)?",
        choices: [
          "kubectl metrics pods",
          "kubectl usage pods",
          "kubectl top pods",
          "kubectl describe pods --metrics"
        ],
        answer: 2,
        explanation:
          "`kubectl top pods` (and `kubectl top nodes`) shows resource usage via the Metrics API exposed by metrics-server.",
        docs: {
          label: "Kubernetes docs: Resource metrics pipeline",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/"
        }
      },
      {
        type: "tf",
        prompt:
          "A failing `readinessProbe` will remove the Pod's IP from the Service endpoints until the probe passes again.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Readiness failures mark the Pod NotReady and it's removed from Service endpoints but the container is NOT restarted.",
        docs: {
          label: "Kubernetes docs: When should you use a readiness probe?",
          url: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want to debug a CrashLoopBackOff pod by running shell-like commands against a copy of it without modifying the original. Which command is most appropriate?",
        choices: [
          "kubectl exec -it <pod> -- sh",
          "kubectl debug <pod> -it --image=busybox --copy-to=<pod>-debug --share-processes",
          "kubectl attach <pod>",
          "kubectl edit pod <pod>"
        ],
        answer: 1,
        explanation:
          "`kubectl debug` can create an ephemeral container or a copy of the pod for troubleshooting without affecting the original.",
        docs: {
          label: "Kubernetes docs: Debug Running Pods",
          url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command shows cluster events for the current namespace, sorted oldest-to-newest?",
        choices: [
          "kubectl describe events",
          "kubectl get events --sort-by=.metadata.creationTimestamp",
          "kubectl events --order=asc",
          "kubectl logs events"
        ],
        answer: 1,
        explanation:
          "`kubectl get events` lists Event objects. Sort with `--sort-by=.metadata.creationTimestamp` (or `.lastTimestamp`) to read them in chronological order.",
        docs: {
          label: "Kubernetes docs: Troubleshooting Applications — Debug Pods",
          url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the probe type that gives a slow-booting legacy app up to 5 minutes before liveness checks start:",
        yaml:
          "containers:\n  - name: legacy\n    image: legacy:1\n    livenessProbe:\n      httpGet: { path: /healthz, port: 8080 }\n      periodSeconds: 5\n    ______:\n      httpGet: { path: /healthz, port: 8080 }\n      failureThreshold: 30\n      periodSeconds: 10",
        choices: ["readinessProbe", "livenessProbe", "startupProbe", "initProbe"],
        answer: 2,
        explanation:
          "`startupProbe` runs until it first succeeds; liveness and readiness probes are disabled until then. With `failureThreshold: 30` × `periodSeconds: 10`, the app gets up to 300 seconds to start.",
        docs: {
          label: "Kubernetes docs: Startup probes",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes"
        }
      },
      {
        type: "tf",
        prompt:
          "`kubectl logs <pod> --previous` can show logs from a container instance that has already terminated (for example, after a CrashLoopBackOff restart).",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "`--previous` (or `-p`) fetches logs from the most recent previous instance of the container — essential when the current one has already restarted.",
        docs: {
          label: "kubectl reference: logs",
          url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which probe, when configured, delays liveness and readiness probes from running until it first succeeds?",
        choices: ["livenessProbe", "readinessProbe", "startupProbe", "initProbe"],
        answer: 2,
        explanation:
          "`startupProbe` is specifically designed to protect slow-starting containers from being killed by an aggressive liveness probe during boot.",
        docs: {
          label: "Kubernetes docs: Protect slow starting containers",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#protect-slow-starting-containers-with-startup-probes"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the probe action so the kubelet runs `cat /tmp/ready` inside the container and considers it healthy when the command exits 0:",
        yaml:
          "containers:\n  - name: app\n    image: myapp\n    readinessProbe:\n      ______:\n        command: ['cat','/tmp/ready']\n      initialDelaySeconds: 5\n      periodSeconds: 5",
        choices: ["httpGet", "tcpSocket", "exec", "grpc"],
        answer: 2,
        explanation:
          "`exec` probes run a command inside the container; an exit code of 0 means success. `httpGet` and `tcpSocket` are alternative probe actions.",
        docs: {
          label: "Kubernetes docs: Define a liveness command",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command"
        }
      }
    ]
  },
  {
    id: "config-security",
    title: "4. Application Environment, Configuration and Security",
    weight: "25%",
    description:
      "CRDs/Operators, authN/authZ/admission, requests/limits/quotas, ConfigMaps, Secrets, ServiceAccounts, and SecurityContexts.",
    questions: [
      {
        type: "yaml",
        prompt:
          "Fill in the field so that the container runs as a non-root user (UID 1000):",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: safe\nspec:\n  containers:\n    - name: app\n      image: nginx\n      ______:\n        runAsUser: 1000\n        runAsNonRoot: true\n        allowPrivilegeEscalation: false",
        choices: ["resources", "securityContext", "runtimeClassName", "serviceAccount"],
        answer: 1,
        explanation:
          "`securityContext` at the container level sets UID, privilege escalation, capabilities, etc. It can also be set at pod level.",
        docs: {
          label: "Kubernetes docs: Configure a SecurityContext",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command creates a ConfigMap from a file `app.properties` with the key `app.properties`?",
        choices: [
          "kubectl create configmap app-config --from-env-file=app.properties",
          "kubectl create configmap app-config --from-file=app.properties",
          "kubectl apply configmap app-config app.properties",
          "kubectl set config app-config=app.properties"
        ],
        answer: 1,
        explanation:
          "`--from-file=<path>` uses the filename as the key by default. `--from-env-file` parses KEY=VAL lines into separate keys.",
        docs: {
          label: "Kubernetes docs: Create a ConfigMap",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so the container gets environment variables from every key/value in the ConfigMap `app-config`:",
        yaml:
          "containers:\n  - name: app\n    image: myapp\n    ______:\n      - configMapRef:\n          name: app-config",
        choices: ["env", "envFrom", "volumeMounts", "envFromConfig"],
        answer: 1,
        explanation:
          "`envFrom` injects ALL keys from a ConfigMap or Secret as env vars. Use `env` for individual keys via `valueFrom`.",
        docs: {
          label: "Kubernetes docs: Configure env from ConfigMap",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables"
        }
      },
      {
        type: "tf",
        prompt:
          "Data stored in a Kubernetes Secret is encrypted at rest by default.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Secret data is base64-encoded, NOT encrypted. Encryption at rest must be enabled via an EncryptionConfiguration on the API server.",
        docs: {
          label: "Kubernetes docs: Encrypting Secret Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want a pod to NOT automount the default ServiceAccount token. Which Pod spec field do you set to `false`?",
        choices: [
          "spec.serviceAccountName",
          "spec.automountServiceAccountToken",
          "spec.securityContext.mountToken",
          "spec.tokenProjection"
        ],
        answer: 1,
        explanation:
          "`automountServiceAccountToken: false` (at Pod or ServiceAccount level) prevents the API token from being mounted into the pod.",
        docs: {
          label: "Kubernetes docs: Configure Service Accounts for Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which imperative command creates a generic Secret named `db` with a key `password` set to `s3cret`?",
        choices: [
          "kubectl create secret generic db --from-literal=password=s3cret",
          "kubectl create secret db password=s3cret",
          "kubectl set secret db password s3cret",
          "kubectl apply secret generic db --data password=s3cret"
        ],
        answer: 0,
        explanation:
          "`kubectl create secret generic <name> --from-literal=KEY=VAL` is the standard imperative form. Use `--from-file` for file-based keys.",
        docs: {
          label: "Kubernetes docs: Managing Secrets using kubectl",
          url: "https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this container requests 100m CPU / 128Mi memory and is capped at 500m CPU / 256Mi memory:",
        yaml:
          "containers:\n  - name: app\n    image: myapp\n    ______:\n      requests:\n        cpu: 100m\n        memory: 128Mi\n      limits:\n        cpu: 500m\n        memory: 256Mi",
        choices: ["quota", "resources", "limits", "capacity"],
        answer: 1,
        explanation:
          "`resources` holds both `requests` (for scheduling) and `limits` (enforced by the kubelet/cgroups). Per-namespace defaults can be set with a LimitRange.",
        docs: {
          label: "Kubernetes docs: Resource Management for Pods and Containers",
          url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which object enforces a cluster-admin-set cap on total CPU, memory, or number of objects that can be created in a namespace?",
        choices: ["LimitRange", "ResourceQuota", "PodDisruptionBudget", "PriorityClass"],
        answer: 1,
        explanation:
          "`ResourceQuota` caps aggregate resource consumption and object counts in a namespace. `LimitRange` sets per-object defaults/min/max.",
        docs: {
          label: "Kubernetes docs: Resource Quotas",
          url: "https://kubernetes.io/docs/concepts/policy/resource-quotas/"
        }
      },
      {
        type: "tf",
        prompt:
          "A ConfigMap mounted as a volume has its file contents updated in running pods when the ConfigMap changes, but values consumed via `env`/`envFrom` do NOT update until the pod restarts.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Volume-mounted ConfigMap/Secret keys are refreshed by the kubelet (eventually consistent). Environment variables are materialized at pod start and are not refreshed.",
        docs: {
          label: "Kubernetes docs: ConfigMaps — Mounted ConfigMaps are updated automatically",
          url: "https://kubernetes.io/docs/concepts/configuration/configmap/#mounted-configmaps-are-updated-automatically"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the volume source so the Secret `tls-cert` is mounted at `/etc/tls` in the container:",
        yaml:
          "spec:\n  containers:\n    - name: app\n      image: myapp\n      volumeMounts:\n        - name: tls\n          mountPath: /etc/tls\n          readOnly: true\n  volumes:\n    - name: tls\n      ______:\n        secretName: tls-cert",
        choices: ["configMap", "secret", "projected", "hostPath"],
        answer: 1,
        explanation:
          "A `secret` volume projects each key of the Secret as a file in the mount path. Use `items:` to pick specific keys or rename files.",
        docs: {
          label: "Kubernetes docs: Using Secrets as files from a Pod",
          url: "https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod"
        }
      }
    ]
  },
  {
    id: "services-networking",
    title: "5. Services and Networking",
    weight: "20%",
    description:
      "NetworkPolicies, Services, and Ingress.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which Service type exposes the Service on a static port on each node's IP?",
        choices: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
        answer: 1,
        explanation:
          "`NodePort` opens a port (30000-32767 by default) on every node and routes to the Service.",
        docs: {
          label: "Kubernetes docs: Service — Publishing Services (ServiceTypes)",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the selector so this Service routes to pods labeled `app=web`:",
        yaml:
          "apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  ______:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 8080",
        choices: ["matchLabels", "labels", "selector", "podSelector"],
        answer: 2,
        explanation:
          "Services use a flat `selector` map. (Deployments and NetworkPolicies use `matchLabels`/`podSelector`.)",
        docs: {
          label: "Kubernetes docs: Services",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the blank so this NetworkPolicy denies ALL ingress traffic to pods labeled `app=db`:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-db-ingress\nspec:\n  podSelector:\n    matchLabels:\n      app: db\n  policyTypes:\n    - ______\n  ingress: []",
        choices: ["Egress", "Ingress", "Deny", "All"],
        answer: 1,
        explanation:
          "Listing `Ingress` in `policyTypes` with an empty `ingress` rule set denies all incoming traffic to selected pods.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "tf",
        prompt:
          "NetworkPolicies only take effect if the cluster's CNI plugin supports them.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "NetworkPolicy objects are enforced by the CNI (e.g. Calico, Cilium). With a CNI that doesn't implement them, the policies are silently ignored.",
        docs: {
          label: "Kubernetes docs: Network Policies — Prerequisites",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/#prerequisites"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this Ingress routes `example.com/api` to the `api` Service on port 80:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app\nspec:\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /api\n            pathType: Prefix\n            ______:\n              service:\n                name: api\n                port:\n                  number: 80",
        choices: ["target", "backend", "service", "upstream"],
        answer: 1,
        explanation:
          "Each path under an Ingress rule has a `backend` that points at a Service and port (or a Resource).",
        docs: {
          label: "Kubernetes docs: Ingress",
          url: "https://kubernetes.io/docs/concepts/services-networking/ingress/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Service type creates no proxying and instead returns a CNAME DNS record pointing at an external hostname like `my-db.rds.amazonaws.com`?",
        choices: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
        answer: 3,
        explanation:
          "`ExternalName` Services have no selectors or endpoints — CoreDNS returns a CNAME to the value in `spec.externalName`.",
        docs: {
          label: "Kubernetes docs: Service — ExternalName",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#externalname"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this NetworkPolicy allows ingress to `app=db` ONLY from pods labeled `role=frontend` in the same namespace:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: db-allow-frontend\nspec:\n  podSelector:\n    matchLabels:\n      app: db\n  policyTypes:\n    - Ingress\n  ingress:\n    - from:\n        - ______:\n            matchLabels:\n              role: frontend",
        choices: ["namespaceSelector", "podSelector", "ipBlock", "serviceSelector"],
        answer: 1,
        explanation:
          "`podSelector` inside a `from` rule scopes the allow to pods in the SAME namespace with matching labels. Use `namespaceSelector` (or combine both) to cross namespaces.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which imperative command creates a ClusterIP Service in front of the Deployment `web` that forwards port 80 to container port 8080?",
        choices: [
          "kubectl create service web --port=80 --target=8080",
          "kubectl expose deployment web --port=80 --target-port=8080",
          "kubectl service expose deployment/web 80:8080",
          "kubectl run web --expose --port 80"
        ],
        answer: 1,
        explanation:
          "`kubectl expose` generates a Service from a workload's labels. `--target-port` is the container port; omit `--type` for the default ClusterIP.",
        docs: {
          label: "kubectl reference: expose",
          url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_expose/"
        }
      },
      {
        type: "tf",
        prompt:
          "A headless Service (`clusterIP: None`) returns the individual Pod IPs via DNS instead of load-balancing through a single virtual IP.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Headless Services skip kube-proxy load balancing. DNS returns one A/AAAA record per backing Pod — common for StatefulSets and client-side load balancing.",
        docs: {
          label: "Kubernetes docs: Headless Services",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#headless-services"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this Ingress terminates TLS for `example.com` using the Secret `example-tls`:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app\nspec:\n  ______:\n    - hosts:\n        - example.com\n      secretName: example-tls\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80",
        choices: ["tls", "https", "certificates", "secrets"],
        answer: 0,
        explanation:
          "The Ingress `tls` list references a Secret of type `kubernetes.io/tls` (containing `tls.crt` and `tls.key`) and scopes it to a set of hosts.",
        docs: {
          label: "Kubernetes docs: Ingress — TLS",
          url: "https://kubernetes.io/docs/concepts/services-networking/ingress/#tls"
        }
      }
    ]
  }
];
