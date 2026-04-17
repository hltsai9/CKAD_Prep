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
  },

  // =========================================================================
  // Practice drill sections — additional sections organized by the legacy
  // CKAD topic groupings used in the community reference repo
  // dgkanatsios/CKAD-exercises (MIT). All question text, answer choices, and
  // explanations below are original writing; the repo is acknowledged as
  // topical inspiration in the README.
  // =========================================================================

  {
    id: "drill-core-concepts",
    title: "Core Concepts (drills)",
    weight: "drills",
    description:
      "Pods, namespaces, imperative vs declarative kubectl, dry-run manifests, and kubectl explain.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which command is the quickest imperative way to create a single Pod named `web` running the nginx image?",
        choices: [
          "kubectl run web --image=nginx",
          "kubectl create pod web --image=nginx",
          "kubectl apply pod web --image=nginx",
          "kubectl new pod web --image=nginx"
        ],
        answer: 0,
        explanation:
          "`kubectl run <name> --image=<img>` creates a Pod directly. `kubectl create` has subcommands for higher-level objects (deployment, job, configmap) but not `pod`.",
        docs: {
          label: "kubectl reference: run",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want kubectl to emit the YAML it WOULD submit, without actually creating anything. Which flag combination does that?",
        choices: [
          "--dry-run=server",
          "--dry-run=client -o yaml",
          "--preview -o yaml",
          "--plan --output yaml"
        ],
        answer: 1,
        explanation:
          "`--dry-run=client -o yaml` renders the object locally and prints the manifest. `server` sends it to the API for validation but still doesn't persist; it's useful for admission checks.",
        docs: {
          label: "kubectl conventions: dry-run",
          url: "https://kubernetes.io/docs/reference/kubectl/conventions/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which namespace does kubectl target by default when you don't pass `-n`?",
        choices: ["default", "kube-system", "kube-public", "kube-node-lease"],
        answer: 0,
        explanation:
          "`default` is the target namespace for resources created without an explicit namespace. `kube-system` holds the control-plane add-ons and is not the default.",
        docs: {
          label: "Kubernetes docs: Namespaces",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the top-level field of this minimal Pod manifest:",
        yaml:
          "______: v1\nkind: Pod\nmetadata:\n  name: p\nspec:\n  containers:\n    - name: c\n      image: nginx",
        choices: ["apiVersion", "version", "api", "schemaVersion"],
        answer: 0,
        explanation:
          "`apiVersion` identifies the API group/version (here the core `v1` group). It is required on every Kubernetes manifest.",
        docs: {
          label: "Kubernetes docs: Understanding Kubernetes Objects",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/"
        }
      },
      {
        type: "mcq",
        prompt: "Which command lists Pods across every namespace?",
        choices: [
          "kubectl get pods -A",
          "kubectl get pods --namespace=all",
          "kubectl get pods *",
          "kubectl list pods"
        ],
        answer: 0,
        explanation:
          "`-A` (alias for `--all-namespaces`) lists resources cluster-wide. There is no `all` namespace and `list` is not a kubectl verb.",
        docs: {
          label: "kubectl reference: get",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get"
        }
      },
      {
        type: "mcq",
        prompt:
          "What does `kubectl explain pod.spec.containers` print?",
        choices: [
          "The schema documentation for that field path",
          "A list of running containers for a specific pod",
          "The events related to container restarts",
          "The kubelet's container runtime configuration"
        ],
        answer: 0,
        explanation:
          "`kubectl explain` prints field-level API documentation. Use it to discover allowed keys and subfields without leaving the shell.",
        docs: {
          label: "kubectl reference: explain",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#explain"
        }
      },
      {
        type: "tf",
        prompt:
          "Two different kinds of resources (e.g. a Pod and a Deployment) may share the same name within the same namespace.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Uniqueness is scoped by (namespace, kind, name). A Pod named `web` and a Deployment named `web` in the same namespace do not conflict.",
        docs: {
          label: "Kubernetes docs: Names",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/names/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which namespace hosts the cluster's control-plane and add-on system pods?",
        choices: ["default", "kube-system", "kube-public", "kube-node-lease"],
        answer: 1,
        explanation:
          "`kube-system` is reserved for system components such as CoreDNS, kube-proxy, and CNI pods. `kube-public` holds world-readable data; `kube-node-lease` holds node heartbeats.",
        docs: {
          label: "Kubernetes docs: Namespaces",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/"
        }
      }
    ]
  },

  {
    id: "drill-configuration",
    title: "Configuration (drills)",
    weight: "drills",
    description:
      "ConfigMaps, Secrets, SecurityContext, ServiceAccounts, and resource requests/limits.",
    questions: [
      {
        type: "yaml",
        prompt:
          "Which key injects ALL entries of a ConfigMap into a container as environment variables?",
        yaml:
          "spec:\n  containers:\n    - name: app\n      image: nginx\n      ______:\n        - configMapRef:\n            name: my-config",
        choices: ["envFrom", "env", "configFrom", "envSource"],
        answer: 0,
        explanation:
          "`envFrom` pulls every key/value pair from the referenced ConfigMap (or Secret). Use `env` with `valueFrom.configMapKeyRef` to wire a single key.",
        docs: {
          label: "Kubernetes docs: ConfigMap env vars",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#define-container-environment-variables-using-configmap-data"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command creates a ConfigMap named `cm` with a single key/value entry `KEY=VALUE`?",
        choices: [
          "kubectl create configmap cm --from-literal=KEY=VALUE",
          "kubectl create cm cm --literal KEY=VALUE",
          "kubectl apply configmap cm --data KEY=VALUE",
          "kubectl set config cm KEY=VALUE"
        ],
        answer: 0,
        explanation:
          "Use `--from-literal=KEY=VALUE` for inline pairs; use `--from-file=path` to load file contents as values.",
        docs: {
          label: "Kubernetes docs: Create a ConfigMap",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command creates a TLS Secret from a certificate and private key file?",
        choices: [
          "kubectl create secret tls my-tls --cert=tls.crt --key=tls.key",
          "kubectl create secret generic my-tls --from-file=tls.crt --from-file=tls.key",
          "kubectl create secret docker-registry my-tls --cert=tls.crt --key=tls.key",
          "kubectl create tls-secret my-tls --cert=tls.crt --key=tls.key"
        ],
        answer: 0,
        explanation:
          "`kubectl create secret tls` is the dedicated subcommand; it stores the data under fixed keys `tls.crt` and `tls.key`, which is what Ingress TLS expects.",
        docs: {
          label: "kubectl reference: create secret tls",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-tls-em-"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Pod/container field enforces that the container must NOT run as the root user?",
        choices: [
          "securityContext.runAsNonRoot: true",
          "securityContext.privileged: false",
          "securityContext.allowRoot: false",
          "spec.restrictRoot: true"
        ],
        answer: 0,
        explanation:
          "`runAsNonRoot: true` causes the kubelet to refuse to start a container whose image runs as UID 0. Combine with a specific `runAsUser` for defense in depth.",
        docs: {
          label: "Kubernetes docs: SecurityContext",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the field that declares this container's minimum CPU and memory:",
        yaml:
          "containers:\n  - name: c\n    image: nginx\n    ______:\n      requests:\n        cpu: \"250m\"\n        memory: \"128Mi\"",
        choices: ["resources", "limits", "quota", "capacity"],
        answer: 0,
        explanation:
          "`resources.requests` set the scheduler's minimum required capacity. `resources.limits` cap actual usage. The ResourceQuota object is separate (namespace-level).",
        docs: {
          label: "Kubernetes docs: Managing Resources for Containers",
          url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What does a ServiceAccount provide to the Pods that use it?",
        choices: [
          "An identity for making Kubernetes API calls",
          "Automatic DNS resolution for the Pod",
          "A read-only root filesystem",
          "TLS certificates for external users"
        ],
        answer: 0,
        explanation:
          "A ServiceAccount is the identity used by in-cluster workloads when they call the API. The token (projected by default) is presented as a bearer credential.",
        docs: {
          label: "Kubernetes docs: ServiceAccounts",
          url: "https://kubernetes.io/docs/concepts/security/service-accounts/"
        }
      },
      {
        type: "tf",
        prompt:
          "By default, data stored in a Secret is encrypted at rest in etcd.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Secret data is base64-encoded, not encrypted. Encryption at rest is opt-in via the KMS/aescbc EncryptionConfiguration on the API server.",
        docs: {
          label: "Kubernetes docs: Encrypting Confidential Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What does a CPU request of `500m` mean?",
        choices: [
          "Half of one vCPU core",
          "500 milliseconds of CPU time per second",
          "500 cores",
          "Memory = 500 MB (this field is mis-named)"
        ],
        answer: 0,
        explanation:
          "CPU is expressed in cores. `1000m` = 1 core, so `500m` = 0.5 core. Memory has its own unit suffixes (Mi, Gi).",
        docs: {
          label: "Kubernetes docs: Meaning of CPU",
          url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu"
        }
      },
      {
        type: "yaml",
        prompt:
          "Which SecurityContext subfield drops the Linux capability `NET_RAW`?",
        yaml:
          "securityContext:\n  ______:\n    drop:\n      - NET_RAW",
        choices: ["capabilities", "linuxOptions", "caps", "privileges"],
        answer: 0,
        explanation:
          "`capabilities.drop` (and `capabilities.add`) adjust POSIX capabilities. Dropping `NET_RAW` prevents raw socket creation — a common hardening step.",
        docs: {
          label: "Kubernetes docs: SecurityContext — capabilities",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container"
        }
      }
    ]
  },

  {
    id: "drill-multi-container",
    title: "Multi-Container Pods (drills)",
    weight: "drills",
    description:
      "Sidecar, ambassador, and adapter patterns; init container ordering; sharing data via emptyDir.",
    questions: [
      {
        type: "mcq",
        prompt:
          "In the sidecar pattern, the main container and its sidecar most commonly exchange data through",
        choices: [
          "A shared emptyDir volume",
          "A hostPath volume on the node",
          "A Secret mounted into both",
          "A ConfigMap with mutable updates"
        ],
        answer: 0,
        explanation:
          "An `emptyDir` shared by both containers is the classic pattern: e.g. the app writes logs, the sidecar reads and forwards them.",
        docs: {
          label: "Kubernetes docs: Sidecar pattern",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the volume type used to share a directory between two containers within a single Pod:",
        yaml:
          "spec:\n  volumes:\n    - name: shared\n      ______: {}\n  containers:\n    - name: main\n      image: nginx\n      volumeMounts:\n        - name: shared\n          mountPath: /data\n    - name: sidecar\n      image: alpine\n      volumeMounts:\n        - name: shared\n          mountPath: /data",
        choices: ["emptyDir", "hostPath", "configMap", "secret"],
        answer: 0,
        explanation:
          "`emptyDir: {}` allocates a scratch volume tied to the Pod's lifetime. Both containers see the same directory.",
        docs: {
          label: "Kubernetes docs: Volumes — emptyDir",
          url: "https://kubernetes.io/docs/concepts/storage/volumes/#emptydir"
        }
      },
      {
        type: "mcq",
        prompt:
          "How do init containers execute relative to each other and to the main container(s)?",
        choices: [
          "Sequentially, one at a time, each must succeed before the next starts",
          "In parallel with each other and with the main containers",
          "Only when a liveness probe on the main container fails",
          "After the main container exits, as cleanup hooks"
        ],
        answer: 0,
        explanation:
          "Init containers run in order, one after the other. If any fails, the kubelet applies the Pod's restartPolicy. Main containers start only after all inits succeed.",
        docs: {
          label: "Kubernetes docs: Init Containers",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which design pattern puts a proxy next to the app so the app talks to `localhost` instead of a remote service?",
        choices: ["Ambassador", "Adapter", "Sidecar-logger", "Bridgehead"],
        answer: 0,
        explanation:
          "The Ambassador pattern proxies external service access via a colocated container; the main app uses a simple local address.",
        docs: {
          label: "Kubernetes blog: Container Design Patterns",
          url: "https://kubernetes.io/blog/2016/06/container-design-patterns/"
        }
      },
      {
        type: "mcq",
        prompt:
          "If an init container exits with a non-zero status, the Pod will",
        choices: [
          "Be restarted according to its restartPolicy (failing inits block the main containers)",
          "Skip that init container and start the main containers anyway",
          "Restart only the main container without re-running inits",
          "Stay Pending forever with no recovery"
        ],
        answer: 0,
        explanation:
          "Init container failures cause the Pod to be restarted per its restartPolicy (Always/OnFailure restart; Never leaves the Pod in Error).",
        docs: {
          label: "Kubernetes docs: Init Containers",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
        }
      },
      {
        type: "tf",
        prompt:
          "Containers within the same Pod share a network namespace and can reach each other over localhost.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "All containers in a Pod share one network namespace (one IP, one port space). They communicate over `localhost`.",
        docs: {
          label: "Kubernetes docs: Pods",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field that groups the two ordered setup steps before the main container starts:",
        yaml:
          "spec:\n  ______:\n    - name: step1\n      image: busybox\n      command: ['echo','step1']\n    - name: step2\n      image: busybox\n      command: ['echo','step2']\n  containers:\n    - name: app\n      image: nginx",
        choices: ["initContainers", "preContainers", "setupContainers", "sidecars"],
        answer: 0,
        explanation:
          "`initContainers` is the only field name Kubernetes recognizes for ordered pre-start containers.",
        docs: {
          label: "Kubernetes docs: Init Containers",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/init-containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A logging sidecar is typically responsible for",
        choices: [
          "Tailing the main container's log files on a shared volume and shipping them to a log aggregator",
          "Writing the main container's logs into a Secret for safekeeping",
          "Running as root on the node to read kubelet logs",
          "Replacing the kubelet's log collection"
        ],
        answer: 0,
        explanation:
          "A logging sidecar reads log files written by the main container (via a shared emptyDir) and forwards them, decoupling log shipping from the app.",
        docs: {
          label: "Kubernetes docs: Logging — sidecar",
          url: "https://kubernetes.io/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent"
        }
      }
    ]
  },

  {
    id: "drill-observability",
    title: "Observability (drills)",
    weight: "drills",
    description:
      "Liveness, readiness, and startup probes; kubectl logs; kubectl top; debugging crash loops.",
    questions: [
      {
        type: "mcq",
        prompt: "What is the purpose of a liveness probe?",
        choices: [
          "Restart the container when it becomes unhealthy",
          "Add the Pod to Service endpoints once it's ready",
          "Block Pod scheduling until the node is healthy",
          "Expose metrics to the metrics-server"
        ],
        answer: 0,
        explanation:
          "Liveness probes detect a stuck container; failure triggers a restart. Readiness probes decide Service endpoint membership. Startup probes gate the liveness clock during slow starts.",
        docs: {
          label: "Kubernetes docs: Liveness, Readiness, Startup Probes",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"
        }
      },
      {
        type: "mcq",
        prompt: "What does a readiness probe control?",
        choices: [
          "Whether the Pod receives Service traffic",
          "Whether the container is restarted on failure",
          "Whether the node is considered healthy",
          "Whether the Pod is admitted by the scheduler"
        ],
        answer: 0,
        explanation:
          "When readiness fails, the Pod is removed from Service endpoints (but the container isn't restarted). This is the tool for graceful draining.",
        docs: {
          label: "Kubernetes docs: Probes",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Which subfield configures an HTTP GET health check?",
        yaml:
          "livenessProbe:\n  ______:\n    path: /healthz\n    port: 8080",
        choices: ["httpGet", "tcpSocket", "exec", "httpProbe"],
        answer: 0,
        explanation:
          "`httpGet` probes the given path/port and treats any 2xx/3xx response as success. Alternatives are `tcpSocket` (connect check) and `exec` (run a command).",
        docs: {
          label: "Kubernetes docs: Probe handlers",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-http-request"
        }
      },
      {
        type: "mcq",
        prompt: "What does `initialDelaySeconds` do on a probe?",
        choices: [
          "Delays the first probe attempt after container startup",
          "Delays the Pod's inclusion in Service endpoints",
          "Delays the container's own start command",
          "Sets a timeout for each probe request"
        ],
        answer: 0,
        explanation:
          "`initialDelaySeconds` waits that long before the first probe runs. Use it (or a startup probe) to avoid restarting slow-to-start containers.",
        docs: {
          label: "Kubernetes docs: Probe fields",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which probe handler runs a command inside the container and checks its exit code?",
        choices: ["exec", "httpGet", "tcpSocket", "grpc"],
        answer: 0,
        explanation:
          "`exec` runs a command; exit 0 = healthy, non-zero = failing. Useful when the app has a CLI health check but no HTTP endpoint.",
        docs: {
          label: "Kubernetes docs: Command probe",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command"
        }
      },
      {
        type: "mcq",
        prompt: "Which command prints the recent logs of a Pod's container?",
        choices: [
          "kubectl logs <pod>",
          "kubectl describe logs <pod>",
          "kubectl inspect <pod> --logs",
          "kubectl container-logs <pod>"
        ],
        answer: 0,
        explanation:
          "`kubectl logs <pod>` works for single-container Pods. For multi-container Pods, add `-c <container>`. `describe` shows events, not logs.",
        docs: {
          label: "kubectl reference: logs",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs"
        }
      },
      {
        type: "mcq",
        prompt: "How do you stream/follow a container's logs live?",
        choices: [
          "kubectl logs -f <pod>",
          "kubectl logs --stream <pod>",
          "kubectl tail <pod>",
          "kubectl watch logs <pod>"
        ],
        answer: 0,
        explanation:
          "`-f` (follow) keeps the connection open and appends new lines as they are written, similar to `tail -f`.",
        docs: {
          label: "kubectl reference: logs",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs"
        }
      },
      {
        type: "mcq",
        prompt:
          "A crash-looping container just restarted. How do you read the logs from the PREVIOUS run, not the current one?",
        choices: [
          "kubectl logs <pod> --previous",
          "kubectl logs <pod> --history",
          "kubectl describe <pod>",
          "kubectl get events --field-selector kind=Pod"
        ],
        answer: 0,
        explanation:
          "`--previous` (or `-p`) fetches the logs from the prior termination. Invaluable when a container keeps restarting faster than you can attach.",
        docs: {
          label: "kubectl reference: logs",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command shows live CPU and memory usage for every Pod in the current namespace?",
        choices: [
          "kubectl top pods",
          "kubectl metrics pods",
          "kubectl describe pods --usage",
          "kubectl get pods --resources"
        ],
        answer: 0,
        explanation:
          "`kubectl top pods` queries the metrics API (requires metrics-server installed in the cluster). `kubectl top nodes` does the node-level equivalent.",
        docs: {
          label: "kubectl reference: top",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#top"
        }
      }
    ]
  },

  {
    id: "drill-pod-design",
    title: "Pod Design (drills)",
    weight: "drills",
    description:
      "Labels and selectors, annotations, Deployments and rollouts, Jobs, and CronJobs.",
    questions: [
      {
        type: "mcq",
        prompt:
          "How do you list only the Pods labeled `env=prod`?",
        choices: [
          "kubectl get pods -l env=prod",
          "kubectl get pods --filter env=prod",
          "kubectl get pods where env=prod",
          "kubectl get pods -a env=prod"
        ],
        answer: 0,
        explanation:
          "`-l` (or `--selector`) filters by labels. Supports equality (`=`, `!=`) and set-based (`in`, `notin`) selectors.",
        docs: {
          label: "Kubernetes docs: Labels and Selectors",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/"
        }
      },
      {
        type: "mcq",
        prompt:
          "How do you list Pods that do NOT have the label `env=prod`?",
        choices: [
          "kubectl get pods -l env!=prod",
          "kubectl get pods -l !env=prod",
          "kubectl get pods --not env=prod",
          "kubectl get pods -l env~prod"
        ],
        answer: 0,
        explanation:
          "Use `!=` in equality-based selectors. The set-based equivalent is `-l 'env notin (prod)'`.",
        docs: {
          label: "Kubernetes docs: Labels and Selectors",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#equality-based-requirement"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command imperatively creates a Deployment named `web` that runs `nginx`?",
        choices: [
          "kubectl create deployment web --image=nginx",
          "kubectl run web --image=nginx --kind=Deployment",
          "kubectl deploy web --image=nginx",
          "kubectl apply deployment web --image=nginx"
        ],
        answer: 0,
        explanation:
          "`kubectl create deployment` is the purpose-built subcommand. `kubectl run` creates a Pod, not a Deployment (in modern kubectl).",
        docs: {
          label: "kubectl reference: create deployment",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-"
        }
      },
      {
        type: "mcq",
        prompt: "How do you scale a Deployment `web` to 5 replicas?",
        choices: [
          "kubectl scale deployment web --replicas=5",
          "kubectl replicas deployment web 5",
          "kubectl set replicas deployment web=5",
          "kubectl deployment scale web --to=5"
        ],
        answer: 0,
        explanation:
          "`kubectl scale` is the generic scaling command. It also accepts `--current-replicas` for optimistic concurrency.",
        docs: {
          label: "kubectl reference: scale",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale"
        }
      },
      {
        type: "mcq",
        prompt: "How do you view the rollout history of a Deployment `web`?",
        choices: [
          "kubectl rollout history deployment/web",
          "kubectl history deployment web",
          "kubectl describe rollout web",
          "kubectl get rollouts web"
        ],
        answer: 0,
        explanation:
          "`kubectl rollout history` lists revisions. Add `--revision=N` to see the change-cause/manifest of a specific revision.",
        docs: {
          label: "Kubernetes docs: Deployments — history",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#checking-rollout-history-of-a-deployment"
        }
      },
      {
        type: "mcq",
        prompt: "How do you roll a Deployment back to its previous revision?",
        choices: [
          "kubectl rollout undo deployment/web",
          "kubectl rollback deployment web",
          "kubectl revert deployment web",
          "kubectl undo deployment web"
        ],
        answer: 0,
        explanation:
          "`kubectl rollout undo` reverts to the prior revision by default; `--to-revision=N` goes to a specific one.",
        docs: {
          label: "Kubernetes docs: Deployments — rollback",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field that caps the number of retries on a failing Job:",
        yaml:
          "apiVersion: batch/v1\nkind: Job\nmetadata:\n  name: pi\nspec:\n  ______: 3\n  template:\n    spec:\n      restartPolicy: Never\n      containers:\n        - name: pi\n          image: perl\n          command: [\"perl\",\"-Mbignum=bpi\",\"-wle\",\"print bpi(2000)\"]",
        choices: ["backoffLimit", "retries", "activeDeadlineSeconds", "maxRetries"],
        answer: 0,
        explanation:
          "`backoffLimit` (default 6) controls how many times the Job controller retries a failing Pod before marking the Job failed.",
        docs: {
          label: "Kubernetes docs: Jobs — backoffLimit",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which CronJob schedule string means \"every 6 hours\"?",
        choices: ["0 */6 * * *", "*/6 * * * *", "6 * * * *", "0 0 */6 * *"],
        answer: 0,
        explanation:
          "`0 */6 * * *` fires at minute 0 of every 6th hour (00:00, 06:00, 12:00, 18:00). `*/6` in the minute field fires every 6 minutes.",
        docs: {
          label: "Kubernetes docs: CronJobs",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/"
        }
      },
      {
        type: "mcq",
        prompt: "How do you add a label `tier=backend` to a running Pod `db`?",
        choices: [
          "kubectl label pod db tier=backend",
          "kubectl set label pod db tier=backend",
          "kubectl annotate pod db tier=backend",
          "kubectl edit pod db --label tier=backend"
        ],
        answer: 0,
        explanation:
          "`kubectl label` sets or updates labels. To REMOVE a label, suffix the key with `-`, e.g. `kubectl label pod db tier-`.",
        docs: {
          label: "kubectl reference: label",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#label"
        }
      },
      {
        type: "mcq",
        prompt:
          "How are annotations different from labels?",
        choices: [
          "Annotations hold non-identifying metadata and are not used by selectors",
          "Annotations are indexed for selection; labels are not",
          "Annotations are immutable after Pod creation",
          "Annotations are encrypted at rest; labels are not"
        ],
        answer: 0,
        explanation:
          "Labels are selectable key/value identifiers; annotations carry arbitrary metadata (build SHAs, tool configs) that controllers and selectors ignore.",
        docs: {
          label: "Kubernetes docs: Annotations",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/"
        }
      }
    ]
  },

  {
    id: "drill-services-networking",
    title: "Services & Ingress (drills)",
    weight: "drills",
    description:
      "ClusterIP / NodePort / LoadBalancer, service DNS, NetworkPolicies, and Ingress rules.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which Service type exposes the Pods on a stable cluster-internal IP only?",
        choices: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
        answer: 0,
        explanation:
          "`ClusterIP` is the default — only reachable from inside the cluster. `NodePort` adds a per-node port; `LoadBalancer` adds a cloud LB on top.",
        docs: {
          label: "Kubernetes docs: Service types",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Service type makes the backend Pods reachable on a port opened on every node?",
        choices: ["NodePort", "ClusterIP", "ExternalName", "Headless"],
        answer: 0,
        explanation:
          "`NodePort` picks a port (or you set it) in the cluster's `--service-node-port-range` and opens it on every node.",
        docs: {
          label: "Kubernetes docs: NodePort",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which command imperatively exposes Deployment `web` on port 80 via a NodePort Service?",
        choices: [
          "kubectl expose deployment web --port=80 --type=NodePort",
          "kubectl create nodeport web --port=80",
          "kubectl service create web --type=NodePort --port=80",
          "kubectl publish deployment web --port=80 --nodeport"
        ],
        answer: 0,
        explanation:
          "`kubectl expose` is the dedicated Service generator. `--type` defaults to ClusterIP; pass `NodePort` or `LoadBalancer` to override.",
        docs: {
          label: "kubectl reference: expose",
          url: "https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#expose"
        }
      },
      {
        type: "mcq",
        prompt:
          "By default, which port range does Kubernetes allocate NodePorts from?",
        choices: ["30000-32767", "8000-8999", "49152-65535", "1-1023"],
        answer: 0,
        explanation:
          "`--service-node-port-range` defaults to 30000-32767. You can override it on the API server, but not below the privileged port boundary.",
        docs: {
          label: "Kubernetes docs: NodePort",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the Service field that specifies the container port behind the Service:",
        yaml:
          "apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n    - port: 80\n      ______: 8080",
        choices: ["targetPort", "containerPort", "backendPort", "nodePort"],
        answer: 0,
        explanation:
          "`port` is the Service's external/port; `targetPort` is the port on the Pod it forwards to. `nodePort` is set only when `type: NodePort`.",
        docs: {
          label: "Kubernetes docs: Service ports",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service"
        }
      },
      {
        type: "mcq",
        prompt: "An Ingress resource primarily provides",
        choices: [
          "Layer 7 HTTP routing by host and path",
          "Layer 4 TCP load balancing",
          "Pod-to-Pod encrypted overlay networking",
          "DNS resolution for Services"
        ],
        answer: 0,
        explanation:
          "Ingress defines HTTP(S) routing rules (host, path → Service). An Ingress controller (nginx, Traefik, cloud-managed) implements them.",
        docs: {
          label: "Kubernetes docs: Ingress",
          url: "https://kubernetes.io/docs/concepts/services-networking/ingress/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Inside the cluster, what's the fully-qualified DNS name for Service `web` in namespace `prod`?",
        choices: [
          "web.prod.svc.cluster.local",
          "prod.web.cluster.local",
          "web.cluster.local.prod",
          "svc.prod.web.cluster.local"
        ],
        answer: 0,
        explanation:
          "The pattern is `<service>.<namespace>.svc.<cluster-domain>`. Within the same namespace you can use just `web`.",
        docs: {
          label: "Kubernetes docs: Service DNS",
          url: "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#services"
        }
      },
      {
        type: "mcq",
        prompt:
          "A NetworkPolicy with `podSelector: {}`, `policyTypes: [Ingress]`, and no ingress rules has the effect of",
        choices: [
          "Selecting all Pods in the namespace and denying all ingress traffic to them",
          "Allowing all ingress traffic to all Pods (it's a permissive fallback)",
          "Isolating the namespace from the Service network entirely",
          "Doing nothing — it has no selector"
        ],
        answer: 0,
        explanation:
          "An empty `podSelector` selects every Pod in the namespace; absent ingress rules with `policyTypes: [Ingress]` deny all inbound traffic. Standard \"default-deny\" recipe.",
        docs: {
          label: "Kubernetes docs: Default-deny NetworkPolicy",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/#default-deny-all-ingress-traffic"
        }
      }
    ]
  },

  {
    id: "drill-state-persistence",
    title: "State Persistence (drills)",
    weight: "drills",
    description:
      "PersistentVolumes, PersistentVolumeClaims, access modes, and reclaim policies.",
    questions: [
      {
        type: "mcq",
        prompt: "A PersistentVolumeClaim binds to",
        choices: [
          "A PersistentVolume that satisfies its requested size, access modes, and storageClassName",
          "The Pod that uses it (directly, without a PV)",
          "A Secret storing credentials",
          "A Service endpoint exposing the storage"
        ],
        answer: 0,
        explanation:
          "The control plane finds (or dynamically provisions) a PV matching the PVC's resource request, access modes, and StorageClass, then binds them 1:1.",
        docs: {
          label: "Kubernetes docs: PV/PVC binding",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which access mode lets a single node mount the volume as read-write?",
        choices: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany", "ReadWriteOncePod"],
        answer: 0,
        explanation:
          "`ReadWriteOnce` (RWO) is the most common mode. It allows read-write by any number of Pods on the same node.",
        docs: {
          label: "Kubernetes docs: Access modes",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which access mode lets the volume be mounted read-only by many nodes?",
        choices: ["ReadOnlyMany", "ReadWriteOnce", "ReadWriteMany", "ReadWriteOncePod"],
        answer: 0,
        explanation:
          "`ReadOnlyMany` (ROX) permits many simultaneous read-only mounts. `ReadWriteMany` would allow read-write from many nodes.",
        docs: {
          label: "Kubernetes docs: Access modes",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which access mode restricts a volume to being mounted read-write by EXACTLY one Pod cluster-wide?",
        choices: ["ReadWriteOncePod", "ReadWriteOnce", "ReadOnlyMany", "ExclusiveMount"],
        answer: 0,
        explanation:
          "`ReadWriteOncePod` (RWOP, v1.22+) enforces single-Pod RW access, even if other Pods are on the same node. Useful for storage that must not be shared.",
        docs: {
          label: "Kubernetes docs: ReadWriteOncePod",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
        }
      },
      {
        type: "yaml",
        prompt: "Complete the PVC field that requests 5 GiB of storage:",
        yaml:
          "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: data\nspec:\n  accessModes:\n    - ReadWriteOnce\n  ______:\n    requests:\n      storage: 5Gi",
        choices: ["resources", "capacity", "quota", "size"],
        answer: 0,
        explanation:
          "A PVC's storage request is nested under `resources.requests.storage`, mirroring the `resources` shape used by container resources.",
        docs: {
          label: "Kubernetes docs: PVC spec",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which PersistentVolume reclaim policy keeps the underlying data after its PVC is deleted (for manual cleanup)?",
        choices: ["Retain", "Delete", "Recycle", "Release"],
        answer: 0,
        explanation:
          "`Retain` leaves the volume + data intact; the admin decides what to do. `Delete` wipes both. `Recycle` is deprecated. `Release` is a state, not a policy.",
        docs: {
          label: "Kubernetes docs: Reclaim policies",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming"
        }
      },
      {
        type: "mcq",
        prompt:
          "If a PVC is deleted and its bound PV has reclaim policy `Delete`, what happens to the storage?",
        choices: [
          "The PV is removed AND the storage backend deletes the underlying volume",
          "The PV is removed, but the backend volume remains intact",
          "Both remain; an admin must clean them up manually",
          "The PV is marked Released but the backend volume is retained"
        ],
        answer: 0,
        explanation:
          "With `Delete`, the provisioner tears down the backing storage when the PV is released — convenient for dynamic provisioning, dangerous for valuable data.",
        docs: {
          label: "Kubernetes docs: Reclaim policies",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaim-policy"
        }
      },
      {
        type: "mcq",
        prompt:
          "A `hostPath` volume is typically appropriate for",
        choices: [
          "Single-node testing or DaemonSet-style workloads that need on-node files",
          "Sharing data across many Pods on different nodes",
          "Long-lived production storage needing backups and snapshots",
          "Mounting a Secret into a Pod"
        ],
        answer: 0,
        explanation:
          "`hostPath` binds a path on a specific node. It's useful for demos, single-node clusters, or DaemonSets reading/writing node state — not for durable multi-node storage.",
        docs: {
          label: "Kubernetes docs: hostPath volume",
          url: "https://kubernetes.io/docs/concepts/storage/volumes/#hostpath"
        }
      }
    ]
  }
];
