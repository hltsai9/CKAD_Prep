// KCNA Practice Questions — organized by the 5 official CNCF curriculum domains.
// Each question has: type, prompt, optional yaml, choices, answer (index), explanation, docs.
// Docs links point to official documentation (kubernetes.io, cncf.io, prometheus.io, etc.).

const KCNA_CURRICULUM = [
  {
    id: "kcna-fundamentals",
    title: "1. Kubernetes Fundamentals",
    weight: "46%",
    description:
      "Kubernetes resources (Pods, Deployments, Services, Namespaces), cluster architecture and control plane components, the Kubernetes API, containers, and scheduling basics.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which control plane component is the ONLY one that reads from and writes to etcd, acting as the front door for all cluster state changes?",
        choices: [
          "kube-scheduler",
          "kube-apiserver",
          "kube-controller-manager",
          "kubelet"
        ],
        answer: 1,
        explanation:
          "All components — kubectl, the scheduler, controllers, kubelets — talk to the `kube-apiserver`, and only the API server communicates directly with `etcd`, the cluster's key-value store.",
        docs: {
          label: "Kubernetes docs: Cluster Architecture",
          url: "https://kubernetes.io/docs/concepts/architecture/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What is the smallest deployable unit you can create and manage in Kubernetes?",
        choices: ["A container", "A Pod", "A Deployment", "A Node"],
        answer: 1,
        explanation:
          "A `Pod` is the smallest deployable unit in Kubernetes. It wraps one or more containers that share the same network namespace and storage volumes.",
        docs: {
          label: "Kubernetes docs: Pods",
          url: "https://kubernetes.io/docs/concepts/workloads/pods/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which agent runs on every worker node and ensures that the containers described in PodSpecs are actually running and healthy?",
        choices: ["kube-proxy", "kubelet", "containerd", "cloud-controller-manager"],
        answer: 1,
        explanation:
          "The `kubelet` runs on each node, watches for Pods assigned to its node, and instructs the container runtime to start and monitor their containers. `kube-proxy` handles Service networking rules instead.",
        docs: {
          label: "Kubernetes docs: kubelet",
          url: "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A Deployment's Pods are recreated with new IP addresses whenever they restart. Which Kubernetes resource gives clients a single, stable virtual IP and DNS name to reach those Pods?",
        choices: ["A Namespace", "A ReplicaSet", "A Service", "A ConfigMap"],
        answer: 2,
        explanation:
          "A `Service` provides a stable virtual IP (ClusterIP) and DNS name, and load-balances traffic across the healthy Pods selected by its label selector — regardless of individual Pod IP changes.",
        docs: {
          label: "Kubernetes docs: Service",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this Deployment so that it maintains three identical Pod replicas:",
        yaml:
          "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  ______: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: nginx",
        choices: ["replicas", "instances", "podCount", "scale"],
        answer: 0,
        explanation:
          "`spec.replicas` declares the desired number of Pods. The Deployment's `ReplicaSet` continuously reconciles the actual Pod count toward this desired state.",
        docs: {
          label: "Kubernetes docs: Deployments",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
        }
      },
      {
        type: "mcq",
        prompt:
          "How does the Kubernetes API primarily expect you to manage workloads?",
        choices: [
          "Imperatively: you send step-by-step commands that the cluster executes in order",
          "Declaratively: you describe the desired state, and controllers reconcile actual state toward it",
          "Through SSH sessions directly on each worker node",
          "By editing etcd entries with a database client"
        ],
        answer: 1,
        explanation:
          "Kubernetes follows a declarative model: you submit a desired state (usually YAML manifests) to the API server, and controllers run reconciliation loops to make the actual state match it.",
        docs: {
          label: "Kubernetes docs: Kubernetes Objects",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/"
        }
      },
      {
        type: "tf",
        prompt:
          "The kube-scheduler selects a suitable node for a newly created Pod and also starts the Pod's containers on that node.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "The `kube-scheduler` only decides WHICH node a Pod should run on (based on resource requests, affinity, taints, etc.) and records the binding. The `kubelet` on that node then starts the containers via the container runtime.",
        docs: {
          label: "Kubernetes docs: Kubernetes Scheduler",
          url: "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/"
        }
      },
      {
        type: "tf",
        prompt:
          "Namespaces can be used to divide a single Kubernetes cluster into multiple virtual clusters, for example to separate teams or environments.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "`Namespaces` provide logical isolation for names, resource quotas, and access control within one physical cluster — a common way to separate teams, projects, or environments.",
        docs: {
          label: "Kubernetes docs: Namespaces",
          url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/"
        }
      }
    ]
  },
  {
    id: "kcna-orchestration",
    title: "2. Container Orchestration",
    weight: "22%",
    description:
      "Orchestration fundamentals, container runtimes and the CRI, security basics, container networking (CNI), service mesh concepts, and storage (CSI).",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which interface allows the kubelet to work with different container runtimes (such as containerd or CRI-O) without being recompiled?",
        choices: [
          "CNI (Container Network Interface)",
          "CSI (Container Storage Interface)",
          "CRI (Container Runtime Interface)",
          "OCI (Open Container Initiative)"
        ],
        answer: 2,
        explanation:
          "The `CRI` is a gRPC API between the `kubelet` and the container runtime. Any runtime implementing the CRI — like `containerd` or `CRI-O` — can be plugged into a Kubernetes node.",
        docs: {
          label: "Kubernetes docs: Container Runtime Interface (CRI)",
          url: "https://kubernetes.io/docs/concepts/architecture/cri/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What problem does a container orchestrator like Kubernetes primarily solve compared to running containers manually with a container engine?",
        choices: [
          "It compiles application source code into container images",
          "It automates scheduling, scaling, self-healing, and networking of containers across many machines",
          "It replaces the need for a container runtime entirely",
          "It converts virtual machines into containers"
        ],
        answer: 1,
        explanation:
          "Orchestrators manage container lifecycles at scale: placing containers onto nodes, restarting failed ones, scaling replicas, and wiring up service discovery — tasks that become unmanageable by hand across a fleet of machines.",
        docs: {
          label: "Kubernetes docs: Overview — Why you need Kubernetes",
          url: "https://kubernetes.io/docs/concepts/overview/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Plugins like Calico, Cilium, and Flannel are responsible for assigning Pod IP addresses and connecting Pods to the cluster network. Which specification do they implement?",
        choices: ["CSI", "CNI", "SMI", "CRI"],
        answer: 1,
        explanation:
          "The `CNI` (Container Network Interface) defines how network plugins configure container network interfaces. Kubernetes delegates Pod network setup — IP allocation and connectivity — to a CNI plugin.",
        docs: {
          label: "Kubernetes docs: Network Plugins",
          url: "https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/"
        }
      },
      {
        type: "mcq",
        prompt:
          "In a service mesh such as Istio or Linkerd, how is traffic management (mTLS, retries, telemetry) typically added to an application Pod?",
        choices: [
          "By recompiling the application with a mesh SDK",
          "By injecting a sidecar proxy container that intercepts the Pod's network traffic",
          "By replacing kube-proxy on every node",
          "By adding annotations to the cluster's etcd database"
        ],
        answer: 1,
        explanation:
          "Service meshes classically inject a sidecar proxy (like `Envoy`) into each Pod. The proxy transparently handles mutual TLS, retries, and telemetry, so the application code stays unchanged. The mesh's control plane configures all the proxies (its data plane).",
        docs: {
          label: "CNCF: Service Mesh (glossary)",
          url: "https://glossary.cncf.io/service-mesh/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Kubernetes mechanism controls WHO can perform WHICH actions on API resources, using Roles and RoleBindings?",
        choices: [
          "NetworkPolicy",
          "RBAC (Role-Based Access Control)",
          "PodDisruptionBudget",
          "LimitRange"
        ],
        answer: 1,
        explanation:
          "`RBAC` authorizes API requests: a `Role` (or `ClusterRole`) lists allowed verbs on resources, and a `RoleBinding` grants that role to users, groups, or service accounts.",
        docs: {
          label: "Kubernetes docs: Using RBAC Authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "tf",
        prompt:
          "The Container Storage Interface (CSI) allows storage vendors to write drivers that expose their storage systems to Kubernetes without changing Kubernetes core code.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "`CSI` is a standard interface so third-party storage providers can ship out-of-tree drivers. Kubernetes can then provision and attach their volumes without in-tree vendor code.",
        docs: {
          label: "Kubernetes docs: Volumes — CSI",
          url: "https://kubernetes.io/docs/concepts/storage/volumes/#csi"
        }
      },
      {
        type: "tf",
        prompt:
          "By default, running a container's process as root inside the container is impossible in Kubernetes.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Containers CAN run as root by default, which is a common security risk. Fields like `securityContext.runAsNonRoot` and policies enforced via Pod Security Standards are used to prevent it.",
        docs: {
          label: "Kubernetes docs: Pod Security Standards",
          url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Since Kubernetes removed the dockershim, which of the following is a widely used CRI-compliant container runtime on Kubernetes nodes?",
        choices: ["containerd", "Docker Compose", "Vagrant", "QEMU"],
        answer: 0,
        explanation:
          "`containerd` (a CNCF graduated project, originally extracted from Docker) implements the CRI and is one of the most common runtimes on Kubernetes nodes, alongside `CRI-O`.",
        docs: {
          label: "Kubernetes docs: Container Runtimes",
          url: "https://kubernetes.io/docs/setup/production-environment/container-runtimes/"
        }
      }
    ]
  },
  {
    id: "kcna-architecture",
    title: "3. Cloud Native Architecture",
    weight: "16%",
    description:
      "Autoscaling (HPA, VPA, Cluster Autoscaler), serverless, CNCF community and governance, project maturity levels, cloud native roles and personas, and open standards (OCI, CRI, CNI, CSI).",
    questions: [
      {
        type: "mcq",
        prompt:
          "Your web Deployment's CPU usage spikes during business hours. Which component automatically adjusts the NUMBER of Pod replicas based on observed metrics like CPU utilization?",
        choices: [
          "Vertical Pod Autoscaler (VPA)",
          "Horizontal Pod Autoscaler (HPA)",
          "Cluster Autoscaler",
          "kube-scheduler"
        ],
        answer: 1,
        explanation:
          "The `HorizontalPodAutoscaler` scales the replica count of a workload up and down based on metrics. The `VPA` adjusts CPU/memory requests per Pod, and the `Cluster Autoscaler` adds or removes nodes.",
        docs: {
          label: "Kubernetes docs: Horizontal Pod Autoscaling",
          url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/"
        }
      },
      {
        type: "mcq",
        prompt:
          "All the Pods in your cluster are scheduled but some remain Pending because no node has enough free capacity. Which autoscaler addresses this by provisioning additional nodes?",
        choices: [
          "Horizontal Pod Autoscaler",
          "Vertical Pod Autoscaler",
          "Cluster Autoscaler",
          "kube-controller-manager"
        ],
        answer: 2,
        explanation:
          "The `Cluster Autoscaler` watches for unschedulable Pods and grows the node pool (and shrinks it when nodes are underutilized). Pod-level autoscalers cannot help when the cluster itself is out of capacity.",
        docs: {
          label: "Kubernetes docs: Cluster Autoscaling",
          url: "https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/"
        }
      },
      {
        type: "mcq",
        prompt:
          "In the CNCF, what are the three project maturity levels, in order from earliest to most mature?",
        choices: [
          "Alpha, Beta, Stable",
          "Sandbox, Incubating, Graduated",
          "Draft, Candidate, Released",
          "Experimental, Supported, Enterprise"
        ],
        answer: 1,
        explanation:
          "CNCF projects progress from `Sandbox` (early stage) to `Incubating` and finally `Graduated` (like Kubernetes and Prometheus), based on adoption, governance, and community health criteria assessed by the TOC.",
        docs: {
          label: "CNCF: Project Maturity Levels",
          url: "https://www.cncf.io/projects/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which CNCF body is responsible for the technical direction of the foundation, including approving new projects and moving them between maturity levels?",
        choices: [
          "The Governing Board",
          "The Technical Oversight Committee (TOC)",
          "The End User Community",
          "The Marketing Committee"
        ],
        answer: 1,
        explanation:
          "The `TOC` provides CNCF's technical leadership: it defines and maintains the technical vision and approves projects for Sandbox, Incubating, and Graduated status. The Governing Board handles budget and business matters.",
        docs: {
          label: "CNCF: Technical Oversight Committee",
          url: "https://www.cncf.io/people/technical-oversight-committee/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which open standard defines specifications for container image formats and container runtimes, ensuring an image built with one tool can run with another?",
        choices: [
          "OCI (Open Container Initiative)",
          "CNI (Container Network Interface)",
          "SMI (Service Mesh Interface)",
          "CSI (Container Storage Interface)"
        ],
        answer: 0,
        explanation:
          "The `OCI` maintains the image-spec, runtime-spec, and distribution-spec. Because tools like Docker, Podman, and containerd follow these specs, container images are portable across builders, registries, and runtimes.",
        docs: {
          label: "CNCF: Open Container Initiative (glossary)",
          url: "https://glossary.cncf.io/open-container-initiative/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which role is best described as applying software engineering practices to operations, often defining reliability targets with SLIs, SLOs, and error budgets?",
        choices: [
          "Site Reliability Engineer (SRE)",
          "UX Designer",
          "Database Administrator",
          "Scrum Master"
        ],
        answer: 0,
        explanation:
          "`SRE` (Site Reliability Engineering) treats operations as a software problem. SREs measure service health with SLIs, commit to SLOs, and use error budgets to balance reliability work against feature velocity.",
        docs: {
          label: "CNCF: Site Reliability Engineering (glossary)",
          url: "https://glossary.cncf.io/site-reliability-engineering/"
        }
      },
      {
        type: "tf",
        prompt:
          "In a serverless (Functions-as-a-Service) model, developers no longer manage servers directly, and workloads can automatically scale down to zero when there is no traffic.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Serverless platforms (like `Knative` on Kubernetes, or cloud FaaS offerings) abstract away server management and typically scale to zero when idle, billing only for actual execution.",
        docs: {
          label: "CNCF: Serverless (glossary)",
          url: "https://glossary.cncf.io/serverless/"
        }
      },
      {
        type: "tf",
        prompt:
          "Kubernetes Special Interest Groups (SIGs) are community groups, each focused on a specific area of the project such as sig-network or sig-storage.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "The Kubernetes project is organized into `SIGs`, long-lived community groups that own particular areas (networking, storage, docs, etc.). Smaller, time-bounded efforts are handled by Working Groups.",
        docs: {
          label: "Kubernetes community: SIGs and Working Groups",
          url: "https://kubernetes.io/community/"
        }
      }
    ]
  },
  {
    id: "kcna-observability",
    title: "4. Cloud Native Observability",
    weight: "8%",
    description:
      "Telemetry and the three pillars of observability (metrics, logs, traces), Prometheus fundamentals, OpenTelemetry, and cost management.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which three signal types are commonly called the 'three pillars of observability'?",
        choices: [
          "Metrics, logs, and traces",
          "Alerts, dashboards, and reports",
          "CPU, memory, and disk",
          "Events, backups, and audits"
        ],
        answer: 0,
        explanation:
          "`Metrics` (numeric measurements over time), `logs` (timestamped event records), and `traces` (the path of a request through distributed services) together give insight into a system's internal state.",
        docs: {
          label: "CNCF: Observability (glossary)",
          url: "https://glossary.cncf.io/observability/"
        }
      },
      {
        type: "mcq",
        prompt:
          "In Prometheus, which metric type represents a cumulative value that only ever increases (or resets to zero on restart), such as total HTTP requests served?",
        choices: ["Gauge", "Counter", "Histogram", "Summary"],
        answer: 1,
        explanation:
          "A `counter` only goes up (or resets on restart) — ideal for totals like requests or errors. A `gauge` can go up and down (e.g., current memory usage); histograms and summaries capture value distributions.",
        docs: {
          label: "Prometheus docs: Metric Types",
          url: "https://prometheus.io/docs/concepts/metric_types/"
        }
      },
      {
        type: "mcq",
        prompt:
          "How does a Prometheus server normally collect metrics from the applications it monitors?",
        choices: [
          "Applications push metrics to Prometheus over gRPC",
          "Prometheus scrapes HTTP endpoints (commonly /metrics) that expose metrics in a text-based format",
          "Prometheus reads metrics directly from each container's log files",
          "Applications write metrics into etcd for Prometheus to read"
        ],
        answer: 1,
        explanation:
          "Prometheus uses a pull model: it periodically scrapes each target's HTTP metrics endpoint (typically `/metrics`), which serves samples in the Prometheus text exposition format.",
        docs: {
          label: "Prometheus docs: Overview",
          url: "https://prometheus.io/docs/introduction/overview/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which language do you use to query and aggregate time series data stored in Prometheus, for example `rate(http_requests_total[5m])`?",
        choices: ["SQL", "PromQL", "GraphQL", "JMESPath"],
        answer: 1,
        explanation:
          "`PromQL` is Prometheus's built-in query language. Functions like `rate()` operate over range vectors to compute per-second rates from counters, powering dashboards and alerting rules.",
        docs: {
          label: "Prometheus docs: Querying Prometheus",
          url: "https://prometheus.io/docs/prometheus/latest/querying/basics/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What is OpenTelemetry?",
        choices: [
          "A managed cloud service that stores telemetry data for you",
          "A vendor-neutral set of APIs, SDKs, and tools for generating and exporting telemetry (traces, metrics, logs)",
          "A Kubernetes controller that restarts unhealthy Pods",
          "A replacement for the Kubernetes API server"
        ],
        answer: 1,
        explanation:
          "`OpenTelemetry` is a CNCF observability framework: instrumentation APIs/SDKs plus the `Collector` for receiving, processing, and exporting telemetry to any compatible backend — it standardizes instrumentation, not storage or analysis.",
        docs: {
          label: "OpenTelemetry docs: What is OpenTelemetry?",
          url: "https://opentelemetry.io/docs/what-is-opentelemetry/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which practice most directly helps reduce wasted spend in a Kubernetes cluster?",
        choices: [
          "Removing resource requests from all Pods",
          "Right-sizing workload resource requests and scaling down idle capacity",
          "Running every workload in its own dedicated cluster",
          "Disabling autoscaling so usage stays constant"
        ],
        answer: 1,
        explanation:
          "Cost management in cloud native environments centers on right-sizing requests to match real usage, autoscaling, and eliminating idle capacity. Overprovisioned requests reserve capacity (and money) that is never used.",
        docs: {
          label: "CNCF: Cloud Native Glossary",
          url: "https://glossary.cncf.io/"
        }
      },
      {
        type: "tf",
        prompt:
          "A distributed trace is made up of spans, where each span represents one unit of work (such as a single service handling part of a request).",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "A trace records a request's journey through a distributed system as a tree of `spans`. Each span captures one operation with its timing and metadata, letting you pinpoint where latency or errors occur.",
        docs: {
          label: "OpenTelemetry docs: Traces",
          url: "https://opentelemetry.io/docs/concepts/signals/traces/"
        }
      },
      {
        type: "tf",
        prompt:
          "Prometheus includes Alertmanager functionality in its ecosystem, so alerting rules evaluated by Prometheus can be routed as notifications to channels like email or chat.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Prometheus evaluates alerting rules and fires alerts to the `Alertmanager`, which deduplicates, groups, and routes them to receivers such as email, PagerDuty, or Slack.",
        docs: {
          label: "Prometheus docs: Alerting Overview",
          url: "https://prometheus.io/docs/alerting/latest/overview/"
        }
      }
    ]
  },
  {
    id: "kcna-app-delivery",
    title: "5. Cloud Native Application Delivery",
    weight: "8%",
    description:
      "Application delivery fundamentals, GitOps (Argo CD, Flux, desired-state reconciliation), and CI/CD concepts.",
    questions: [
      {
        type: "mcq",
        prompt:
          "What is the core idea of GitOps?",
        choices: [
          "Developers apply changes to production clusters manually with kubectl",
          "A Git repository is the single source of truth for desired state, and an automated agent continuously reconciles the cluster to match it",
          "All application code must be written in Go because Kubernetes is written in Go",
          "Clusters push their current state into Git once per day as a backup"
        ],
        answer: 1,
        explanation:
          "In GitOps, declarative manifests in Git define the desired state. Tools like `Argo CD` or `Flux` continuously compare the live cluster against Git and reconcile any drift — changes flow through pull requests, not ad-hoc commands.",
        docs: {
          label: "Argo CD docs: Overview",
          url: "https://argo-cd.readthedocs.io/en/stable/"
        }
      },
      {
        type: "mcq",
        prompt:
          "In a CI/CD workflow, what is Continuous Integration (CI) primarily concerned with?",
        choices: [
          "Automatically building and testing code changes as they are merged into a shared repository",
          "Provisioning production Kubernetes clusters",
          "Collecting runtime metrics from production services",
          "Rotating TLS certificates for the API server"
        ],
        answer: 0,
        explanation:
          "`CI` automatically builds, tests, and validates every change pushed to the shared repository, catching integration problems early. `CD` then takes the validated artifact through delivery or deployment to environments.",
        docs: {
          label: "CNCF: Continuous Integration (glossary)",
          url: "https://glossary.cncf.io/continuous-integration/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which two CNCF projects are the best-known implementations of the GitOps pattern for Kubernetes?",
        choices: [
          "Argo CD and Flux",
          "Prometheus and Grafana",
          "Helm and kubectl",
          "Istio and Linkerd"
        ],
        answer: 0,
        explanation:
          "`Argo CD` and `Flux` are both CNCF graduated GitOps tools: they watch Git repositories for declarative manifests and continuously sync clusters to that desired state.",
        docs: {
          label: "Flux docs: Introduction",
          url: "https://fluxcd.io/flux/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A team routes 5% of production traffic to a new application version, watches its error rate, and only then gradually shifts the remaining traffic. What is this deployment strategy called?",
        choices: [
          "Blue-green deployment",
          "Canary deployment",
          "Recreate deployment",
          "Shadow deployment"
        ],
        answer: 1,
        explanation:
          "A `canary` release exposes a small slice of real traffic to the new version first, limiting blast radius. `Blue-green` instead switches all traffic at once between two complete environments.",
        docs: {
          label: "CNCF: Canary Deployment (glossary)",
          url: "https://glossary.cncf.io/canary-deployment/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which tool is a package manager for Kubernetes, bundling related manifests into versioned, configurable 'charts'?",
        choices: ["Helm", "npm", "Argo Rollouts", "Terraform"],
        answer: 0,
        explanation:
          "`Helm` packages Kubernetes manifests as charts with templated values, making applications easy to install, upgrade, and share. It is a CNCF graduated project widely used in application delivery pipelines.",
        docs: {
          label: "CNCF: Helm (glossary)",
          url: "https://glossary.cncf.io/helm/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this Argo CD Application so that it automatically syncs the cluster whenever the Git repository changes:",
        yaml:
          "apiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: guestbook\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/example/apps.git\n    path: guestbook\n    targetRevision: HEAD\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: guestbook\n  syncPolicy:\n    ______: {}",
        choices: ["automated", "manual", "forced", "scheduled"],
        answer: 0,
        explanation:
          "Setting `syncPolicy.automated` tells Argo CD to sync without human intervention whenever the live state drifts from the desired state in Git; options like `prune` and `selfHeal` refine that behavior.",
        docs: {
          label: "Argo CD docs: Automated Sync Policy",
          url: "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/"
        }
      },
      {
        type: "tf",
        prompt:
          "In a pull-based GitOps model, an agent running inside the cluster pulls the desired state from Git, so external CI systems do not need direct credentials to the cluster.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Pull-based GitOps (as used by `Flux` and `Argo CD`) keeps the reconciliation agent inside the cluster. This improves security because cluster admin credentials never have to be shared with external pipelines.",
        docs: {
          label: "Flux docs: Core Concepts",
          url: "https://fluxcd.io/flux/concepts/"
        }
      },
      {
        type: "tf",
        prompt:
          "Continuous Delivery and Continuous Deployment mean exactly the same thing: every change is released to production without any human involvement.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Continuous Delivery keeps every change ready to release, but a human may still approve the final push to production. Continuous Deployment goes further and releases every passing change automatically.",
        docs: {
          label: "CNCF: Continuous Delivery (glossary)",
          url: "https://glossary.cncf.io/continuous-delivery/"
        }
      }
    ]
  }
];
