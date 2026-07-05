// KCSA Practice Questions — organized by the 6 official curriculum domains.
// Each question has: type, prompt, optional yaml, choices, answer (index), explanation, docs.
// Docs links point to kubernetes.io and other official documentation.

const KCSA_CURRICULUM = [
  {
    id: "kcsa-overview",
    title: "1. Overview of Cloud Native Security",
    weight: "14%",
    description:
      "The 4Cs of cloud native security (Cloud, Cluster, Container, Code), cloud provider and infrastructure security, security controls and frameworks, isolation techniques, artifact repository and image security, and workload/application code security.",
    questions: [
      {
        type: "mcq",
        prompt:
          "The '4Cs' model describes cloud native security as layers where each layer builds on the security of the layer outside it. Which option lists the four layers correctly, from outermost to innermost?",
        choices: [
          "Cloud, Cluster, Container, Code",
          "Cluster, Cloud, Code, Container",
          "Compliance, Cluster, Container, Credentials",
          "Cloud, Compute, Container, Configuration"
        ],
        answer: 0,
        explanation:
          "The 4Cs are `Cloud`, `Cluster`, `Container`, and `Code`. Each inner layer inherits risk from the layers around it, so you cannot fix a weak outer layer with controls applied only at an inner layer.",
        docs: {
          label: "Kubernetes docs: Cloud Native Security and the 4Cs",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Your cluster runs on a managed Kubernetes service from a public cloud provider. Under the typical shared responsibility model, which of these remains YOUR responsibility?",
        choices: [
          "Physical security of the datacenter",
          "Patching the hypervisor that runs the control plane VMs",
          "Configuring RBAC and securing the workloads you deploy",
          "Availability of the managed control plane API endpoint"
        ],
        answer: 2,
        explanation:
          "Cloud providers secure the underlying infrastructure and (for managed services) the control plane, but customers are always responsible for what they run: workload configuration, `RBAC`, Secrets handling, and application code.",
        docs: {
          label: "Kubernetes docs: Cloud Native Security — cloud provider security",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You must run untrusted, customer-supplied code alongside other tenants. Which option provides the STRONGEST isolation between the untrusted workload and other workloads?",
        choices: [
          "Running the workload in its own Kubernetes namespace",
          "Running the workload on dedicated nodes or in a sandboxed/VM-based runtime",
          "Giving the workload a distinct label and NetworkPolicy",
          "Running the workload under a different service account"
        ],
        answer: 1,
        explanation:
          "Namespaces, labels, and service accounts are logical (soft) isolation. Hardware/VM-level isolation — dedicated nodes or sandboxed runtimes such as gVisor or Kata Containers — provides a much stronger boundary because containers on the same node share the host kernel.",
        docs: {
          label: "Kubernetes docs: Runtime Class",
          url: "https://kubernetes.io/docs/concepts/containers/runtime-class/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which practice at the artifact repository (image registry) layer catches container images with known CVEs BEFORE they are deployed to the cluster?",
        choices: [
          "Enabling registry replication across regions",
          "Scanning images for known vulnerabilities in the registry or CI pipeline",
          "Tagging every image with `latest` so clusters always pull fresh builds",
          "Compressing image layers to reduce the attack surface"
        ],
        answer: 1,
        explanation:
          "Image vulnerability scanning compares image contents against known CVE databases and is a preventive supply-chain control when run in the registry or CI, before deployment. Replication, tags, and compression do not detect vulnerabilities.",
        docs: {
          label: "Kubernetes docs: Overview of Cloud Native Security — Container",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A security review finds that your web application ships with an outdated third-party library containing a known remote code execution flaw. Which class of control addresses this risk at the Code layer?",
        choices: [
          "Software composition analysis / dependency vulnerability scanning",
          "Enabling TLS on the kube-apiserver",
          "Restricting Pod-to-Pod traffic with NetworkPolicies",
          "Encrypting etcd data at rest"
        ],
        answer: 0,
        explanation:
          "Vulnerable third-party dependencies are a Code-layer problem, addressed by dependency (software composition) scanning and static analysis in the development pipeline. The other options are Cluster-layer controls that cannot fix vulnerable application code.",
        docs: {
          label: "Kubernetes docs: Cloud Native Security — Code",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Audit logging that records who accessed the Kubernetes API and what they did is best classified as which type of security control?",
        choices: [
          "Preventive control",
          "Detective control",
          "Corrective control",
          "Compensating control"
        ],
        answer: 1,
        explanation:
          "Detective controls identify and record security-relevant events after or as they happen; audit logs are the classic example. Preventive controls (like `RBAC` or admission policies) stop actions before they occur.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      },
      {
        type: "tf",
        prompt:
          "According to the 4Cs model, strong security at the Cloud layer makes security controls at the Code layer unnecessary.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Each layer must be secured independently. A hardened cloud environment does not protect against vulnerabilities in your application code — an outer layer provides a foundation, not a substitute, for inner-layer security.",
        docs: {
          label: "Kubernetes docs: Cloud Native Security and the 4Cs",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "tf",
        prompt:
          "Referencing a container image by its digest (e.g. `nginx@sha256:...`) guarantees you always run exactly the same image content, unlike a mutable tag such as `:latest`.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "A digest is a content-addressable hash of the image, so it can never point to different content. Tags like `latest` are mutable and can be repointed to a different (potentially malicious) image in the registry.",
        docs: {
          label: "Kubernetes docs: Images",
          url: "https://kubernetes.io/docs/concepts/containers/images/"
        }
      }
    ]
  },
  {
    id: "kcsa-components",
    title: "2. Kubernetes Cluster Component Security",
    weight: "22%",
    description:
      "Securing the kube-apiserver, controller-manager, scheduler, kubelet, container runtime, kube-proxy, Pods, etcd, container networking, client (kubeconfig) security, and storage.",
    questions: [
      {
        type: "mcq",
        prompt:
          "A cluster audit finds the kubelet accepts unauthenticated requests to its API. Which pair of kubelet settings hardens this?",
        choices: [
          "--anonymous-auth=false and --authorization-mode=Webhook",
          "--anonymous-auth=true and --authorization-mode=AlwaysAllow",
          "--read-only-port=10255 and --authorization-mode=AlwaysAllow",
          "--anonymous-auth=false and --authorization-mode=AlwaysAllow"
        ],
        answer: 0,
        explanation:
          "Setting `--anonymous-auth=false` rejects unauthenticated requests, and `--authorization-mode=Webhook` makes the kubelet delegate authorization decisions to the kube-apiserver instead of allowing everything. `AlwaysAllow` skips authorization entirely.",
        docs: {
          label: "Kubernetes docs: Kubelet authentication/authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Kubernetes component is the ONLY one that should communicate directly with etcd?",
        choices: [
          "kubelet",
          "kube-proxy",
          "kube-apiserver",
          "kube-controller-manager"
        ],
        answer: 2,
        explanation:
          "Only the `kube-apiserver` talks to etcd; all other components go through the API server. Restricting etcd access (firewalling and client certificate auth) to the API server prevents components or attackers from bypassing authentication, authorization, and admission control.",
        docs: {
          label: "Kubernetes docs: Operating etcd clusters for Kubernetes",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the kind of this API server configuration file, which enables encryption of Secret data before it is written to etcd:",
        yaml:
          "apiVersion: apiserver.config.k8s.io/v1\nkind: ______\nresources:\n  - resources:\n      - secrets\n    providers:\n      - aescbc:\n          keys:\n            - name: key1\n              secret: <BASE64-ENCODED-KEY>\n      - identity: {}",
        choices: [
          "EncryptionConfiguration",
          "EtcdEncryptionPolicy",
          "SecretEncryptionConfig",
          "EncryptionProvider"
        ],
        answer: 0,
        explanation:
          "An `EncryptionConfiguration` file, referenced by the kube-apiserver's `--encryption-provider-config` flag, tells the API server to encrypt listed resources (typically `secrets`) at rest in etcd using providers such as `aescbc`.",
        docs: {
          label: "Kubernetes docs: Encrypting Confidential Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You run a 3-node etcd cluster for Kubernetes. Which etcd configuration protects the replication traffic BETWEEN the etcd members themselves?",
        choices: [
          "--cert-file and --key-file for client connections",
          "--peer-cert-file, --peer-key-file, and --peer-client-cert-auth",
          "The kube-apiserver's --etcd-cafile flag",
          "Enabling encryption at rest with an EncryptionConfiguration"
        ],
        answer: 1,
        explanation:
          "The `--peer-*` flags configure TLS and mutual certificate authentication for etcd member-to-member (peer) traffic. Client TLS flags and `--etcd-cafile` cover apiserver-to-etcd connections, and encryption at rest protects data on disk, not in transit.",
        docs: {
          label: "Kubernetes docs: Operating etcd clusters — securing communication",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A developer accidentally pushed their kubeconfig file to a public Git repository. What is the most important immediate action?",
        choices: [
          "Delete the Git repository and consider the incident closed",
          "Rename the kubeconfig contexts so the leaked file no longer matches",
          "Rotate or revoke the credentials embedded in the kubeconfig and review audit logs for misuse",
          "Change the cluster's DNS name so the leaked server address is stale"
        ],
        answer: 2,
        explanation:
          "A kubeconfig contains live credentials (client certificates or tokens). Once exposed, they must be treated as compromised: revoke/rotate them and check audit logs for unauthorized access. Deleting the repo does not un-leak the credentials.",
        docs: {
          label: "Kubernetes docs: Organizing cluster access using kubeconfig files",
          url: "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Your platform must run a small number of untrusted workloads with stronger runtime isolation than standard containers, without moving them out of Kubernetes. Which mechanism lets a Pod request a sandboxed container runtime such as gVisor or Kata Containers?",
        choices: [
          "Setting `runtimeClassName` in the Pod spec via a RuntimeClass",
          "Setting `securityContext.privileged: false` on every container",
          "Adding a `sandbox: true` annotation on the Pod",
          "Scheduling the Pod with a node selector for `kernel=isolated`"
        ],
        answer: 0,
        explanation:
          "`RuntimeClass` lets a cluster offer multiple container runtime configurations; a Pod selects one with `runtimeClassName`. Sandboxed runtimes like gVisor or Kata give each Pod a user-space kernel or lightweight VM, reducing shared-kernel risk.",
        docs: {
          label: "Kubernetes docs: Runtime Class",
          url: "https://kubernetes.io/docs/concepts/containers/runtime-class/"
        }
      },
      {
        type: "tf",
        prompt:
          "Without encryption at rest, anyone who can read etcd's data (for example via a backup file or direct disk access) can read every Secret in the cluster.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "By default Kubernetes stores Secrets in etcd base64-encoded but unencrypted, so etcd data files and backups expose all Secret values. Enable encryption at rest and strictly limit access to etcd and its backups.",
        docs: {
          label: "Kubernetes docs: Encrypting Confidential Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "tf",
        prompt:
          "A user with write access to a node's static Pod manifest directory (e.g. `/etc/kubernetes/manifests`) can run arbitrary Pods on that node without going through the kube-apiserver's authorization or admission control.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "The kubelet creates static Pods directly from manifest files on the node, bypassing API server authentication, `RBAC`, and admission control. Filesystem access to that directory must therefore be tightly restricted.",
        docs: {
          label: "Kubernetes docs: Create static Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/"
        }
      }
    ]
  },
  {
    id: "kcsa-fundamentals",
    title: "3. Kubernetes Security Fundamentals",
    weight: "22%",
    description:
      "Pod Security Standards and Pod Security Admission, authentication (certificates, tokens, OIDC), authorization (RBAC, Node, Webhook), Secrets handling, namespace isolation and segmentation, audit logging, and NetworkPolicies.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Which Pod Security Standards profile requires containers to run as non-root and drop ALL Linux capabilities (with only NET_BIND_SERVICE allowed back)?",
        choices: ["privileged", "baseline", "restricted", "hardened"],
        answer: 2,
        explanation:
          "`restricted` is the most restrictive profile, enforcing `runAsNonRoot`, dropping `ALL` capabilities, disallowing privilege escalation, and requiring a seccomp profile. `baseline` only blocks known privilege escalations, and `privileged` is fully unrestricted. There is no `hardened` profile.",
        docs: {
          label: "Kubernetes docs: Pod Security Standards",
          url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the label so that Pod Security Admission REJECTS any Pod in this namespace that violates the restricted profile:",
        yaml:
          "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: prod\n  labels:\n    pod-security.kubernetes.io/______: restricted",
        choices: ["enforce", "require", "apply", "admit"],
        answer: 0,
        explanation:
          "Pod Security Admission supports three modes as namespace labels: `enforce` (rejects violating Pods), `audit` (records violations in the audit log), and `warn` (returns warnings to the client). Only `enforce` actually blocks the Pod.",
        docs: {
          label: "Kubernetes docs: Pod Security Admission",
          url: "https://kubernetes.io/docs/concepts/security/pod-security-admission/"
        }
      },
      {
        type: "mcq",
        prompt:
          "When a user authenticates to the kube-apiserver with an X.509 client certificate, how does Kubernetes determine the username and groups?",
        choices: [
          "From a User object stored in etcd that matches the certificate serial number",
          "Username from the certificate's Common Name (CN), groups from its Organization (O) fields",
          "Username from the certificate's SAN entries, groups from the issuing CA name",
          "Both are looked up in the cluster's OIDC provider"
        ],
        answer: 1,
        explanation:
          "Kubernetes has no `User` API object. With client certificate authentication, the subject `CN` becomes the username and each `O` (organization) field becomes a group — these are then evaluated by authorization (e.g. `RBAC`).",
        docs: {
          label: "Kubernetes docs: Authenticating",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/authentication/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which statement about Kubernetes RBAC is correct?",
        choices: [
          "RBAC rules are purely additive — you cannot write a rule that denies access",
          "A Role can grant access to resources in every namespace",
          "RBAC allows all requests by default unless a deny rule matches",
          "ClusterRoles can only be referenced by ClusterRoleBindings"
        ],
        answer: 0,
        explanation:
          "`RBAC` is deny-by-default and permissions are only ever granted, never denied — there are no deny rules. A `Role` is namespace-scoped, while a `ClusterRole` can also be referenced by a `RoleBinding` to grant its rules within a single namespace.",
        docs: {
          label: "Kubernetes docs: Using RBAC Authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A teammate argues that Kubernetes Secrets are safe to commit to Git because 'the values are encoded'. What is the accurate correction?",
        choices: [
          "Secrets are AES-encrypted by default, so committing them is fine",
          "Secret values are only base64-encoded, which is trivially reversible — it is encoding, not encryption",
          "Secrets are hashed with SHA-256, so the values cannot be recovered",
          "Secrets are safe in Git as long as the repository is private"
        ],
        answer: 1,
        explanation:
          "base64 is a reversible encoding, not a cryptographic protection. Secret manifests must be kept out of source control (or encrypted with external tooling), and clusters should combine `RBAC` restrictions with encryption at rest.",
        docs: {
          label: "Kubernetes docs: Secrets",
          url: "https://kubernetes.io/docs/concepts/configuration/secret/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want a default-deny posture for Pod-to-Pod traffic in the `payments` namespace, then allow only specific flows. What is the standard first step?",
        choices: [
          "Create a NetworkPolicy in `payments` that selects all Pods (`podSelector: {}`) and specifies no ingress rules",
          "Delete the kube-proxy DaemonSet so no traffic can be routed",
          "Annotate the namespace with `networking.kubernetes.io/deny-all: true`",
          "Set every Pod's `hostNetwork` field to false"
        ],
        answer: 0,
        explanation:
          "A NetworkPolicy with an empty `podSelector` selects every Pod in the namespace; declaring the `Ingress` policy type with no rules isolates them from all inbound traffic. You then add narrower policies to allow required flows.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "tf",
        prompt:
          "If no NetworkPolicy selects a Pod, Kubernetes allows all ingress and egress traffic for that Pod by default.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Pods are non-isolated by default: all traffic is permitted until a NetworkPolicy selects them. Note that enforcement also requires a CNI plugin that supports NetworkPolicy.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "tf",
        prompt:
          "Kubernetes API audit logging is enabled by default — every cluster records a full audit trail without any configuration.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Auditing must be explicitly configured on the kube-apiserver with an audit policy file (`--audit-policy-file`) and a backend such as `--audit-log-path`. Without this, API requests are not recorded in an audit trail.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      }
    ]
  },
  {
    id: "kcsa-threat-model",
    title: "4. Kubernetes Threat Model",
    weight: "16%",
    description:
      "Trust boundaries and data flow, persistence, denial of service, malicious code execution and compromised applications in containers, attackers on the network, access to sensitive data, and privilege escalation.",
    questions: [
      {
        type: "mcq",
        prompt:
          "When threat modelling a Kubernetes cluster, which of the following is a trust boundary — a point where data or requests cross between differently-trusted zones?",
        choices: [
          "Two containers running inside the same Pod",
          "The interface between a workload container and the node's shared kernel",
          "Two replicas of the same Deployment",
          "A Pod and the ConfigMap it mounts"
        ],
        answer: 1,
        explanation:
          "Containers share the node's kernel, so the container-to-kernel interface separates untrusted workload code from the trusted host — a classic trust boundary. Containers in one Pod share a security context and are inside the same boundary.",
        docs: {
          label: "OWASP: Kubernetes Top Ten",
          url: "https://owasp.org/www-project-kubernetes-top-ten/"
        }
      },
      {
        type: "mcq",
        prompt:
          "An attacker with temporary API access wants to KEEP access even after their stolen credentials are revoked. Which action gives them persistence in the cluster?",
        choices: [
          "Running `kubectl get pods` across all namespaces",
          "Creating a CronJob that periodically runs a container which calls back to their server",
          "Reading the kube-apiserver's version endpoint",
          "Deleting an application's ReplicaSet so it gets recreated"
        ],
        answer: 1,
        explanation:
          "Persistence means surviving remediation: a `CronJob` (or a rogue DaemonSet, mutating webhook, or backdoored image) keeps re-establishing attacker access on a schedule. Read-only queries give information but no lasting foothold.",
        docs: {
          label: "MITRE: ATT&CK for Containers",
          url: "https://attack.mitre.org/matrices/enterprise/containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A single tenant's buggy application spawns thousands of Pods and exhausts cluster resources, causing a denial of service for other tenants. Which control most directly limits this?",
        choices: [
          "ResourceQuota and LimitRange objects per namespace",
          "A restricted Pod Security Standards profile",
          "Encrypting Secrets at rest in etcd",
          "Enabling mutual TLS between services"
        ],
        answer: 0,
        explanation:
          "`ResourceQuota` caps aggregate resource consumption (Pod count, CPU, memory) per namespace, and `LimitRange` constrains per-container requests/limits — together they contain resource-exhaustion DoS. The other controls address different threats.",
        docs: {
          label: "Kubernetes docs: Resource Quotas",
          url: "https://kubernetes.io/docs/concepts/policy/resource-quotas/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which Pod specification setting most directly enables an attacker who compromises the container to escalate to full control of the node?",
        choices: [
          "securityContext.privileged: true",
          "imagePullPolicy: Always",
          "restartPolicy: Never",
          "terminationGracePeriodSeconds: 0"
        ],
        answer: 0,
        explanation:
          "A `privileged` container runs with nearly all host capabilities and device access, effectively removing the container/host boundary — code execution inside it is close to root on the node. The other fields have no privilege impact.",
        docs: {
          label: "Kubernetes docs: Configure a Security Context",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A web application Pod is compromised via an injection flaw. The attacker immediately finds a valid credential for the Kubernetes API inside the container. Where did it most likely come from?",
        choices: [
          "The cluster's root CA private key, mounted into every Pod",
          "The automounted service account token at /var/run/secrets/kubernetes.io/serviceaccount",
          "The node's kubeconfig, copied into all containers by the kubelet",
          "The etcd client certificate, injected via a ConfigMap"
        ],
        answer: 1,
        explanation:
          "By default every Pod gets its service account's token automounted, and a compromised app can use it against the API server. Set `automountServiceAccountToken: false` where API access is not needed, and keep service account `RBAC` minimal.",
        docs: {
          label: "Kubernetes docs: Configure Service Accounts for Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/"
        }
      },
      {
        type: "mcq",
        prompt:
          "An attacker achieves remote code execution inside a container. Which hardening setting limits their ability to download and install additional tooling into the container's filesystem?",
        choices: [
          "securityContext.readOnlyRootFilesystem: true",
          "spec.hostNetwork: true",
          "securityContext.runAsGroup: 0",
          "spec.dnsPolicy: ClusterFirst"
        ],
        answer: 0,
        explanation:
          "`readOnlyRootFilesystem: true` makes the container's root filesystem immutable, so malware and attack tools cannot be written to it — a common containment measure for compromised applications. `hostNetwork: true` would increase exposure, not reduce it.",
        docs: {
          label: "Kubernetes docs: Configure a Security Context",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "tf",
        prompt:
          "Because containers share the host's kernel, a successful kernel exploit launched from inside one container can compromise the entire node and every other container on it.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "The kernel is shared across all containers on a node, so a kernel-level escape breaks all container isolation on that host. This is why seccomp profiles, minimal capabilities, and sandboxed runtimes matter for untrusted workloads.",
        docs: {
          label: "Kubernetes docs: Cloud Native Security — Container",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "tf",
        prompt:
          "Denial-of-service attacks against the kube-apiserver can only originate from attackers outside the cluster.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Workloads inside the cluster can also overwhelm the API server — for example a misbehaving controller or a compromised Pod using its service account in a request flood. API Priority and Fairness plus rate limiting and quotas mitigate both directions.",
        docs: {
          label: "Kubernetes docs: API Priority and Fairness",
          url: "https://kubernetes.io/docs/concepts/cluster-administration/flow-control/"
        }
      }
    ]
  },
  {
    id: "kcsa-platform",
    title: "5. Platform Security",
    weight: "16%",
    description:
      "Supply chain security, image repositories and signing, observability for security, service mesh security (mTLS), PKI and certificates in Kubernetes, connectivity, and admission control with validating/mutating webhooks.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Your organization signs container images with a tool like Sigstore Cosign and verifies signatures at admission time. What does a valid signature actually prove about an image?",
        choices: [
          "The image contains no known vulnerabilities",
          "The image was produced or approved by the holder of the signing key and has not been modified since signing",
          "The image will pass the restricted Pod Security Standard",
          "The image's base layers come from Docker Hub"
        ],
        answer: 1,
        explanation:
          "Signing provides authenticity (who published it) and integrity (it hasn't been tampered with). It says nothing about vulnerabilities — signed images still need scanning, and signing complements rather than replaces it.",
        docs: {
          label: "SLSA: Supply-chain Levels for Software Artifacts",
          url: "https://slsa.dev/"
        }
      },
      {
        type: "mcq",
        prompt:
          "In a service mesh, what does enabling mutual TLS (mTLS) between workloads provide?",
        choices: [
          "Encryption of traffic in transit plus cryptographic authentication of BOTH the client and server workloads",
          "Encryption of traffic in transit only, with no authentication",
          "Authorization rules deciding which HTTP paths a workload may call",
          "Encryption of Secret data stored in etcd"
        ],
        answer: 0,
        explanation:
          "With mTLS, each side presents a certificate, so both workload identities are verified and the connection is encrypted — defeating on-path eavesdropping and workload impersonation. Authorization policy is a separate mesh feature layered on top of those identities.",
        docs: {
          label: "Istio docs: Security concepts (mTLS)",
          url: "https://istio.io/latest/docs/concepts/security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A production container that normally only serves HTTP suddenly spawns an interactive shell and starts making outbound connections to an unknown IP. Which capability is designed to DETECT this kind of behavior as it happens?",
        choices: [
          "Static image vulnerability scanning in the registry",
          "Runtime security monitoring of process and syscall activity (e.g. Falco-style tools)",
          "RBAC audit of Role and RoleBinding objects",
          "Enforcing image signature verification at admission"
        ],
        answer: 1,
        explanation:
          "Runtime threat detection observes live behavior — processes, syscalls, network connections — and alerts on anomalies like a shell in a production container. Image scanning, RBAC review, and signature checks are all pre-runtime or configuration-time controls.",
        docs: {
          label: "Falco docs: Cloud native runtime security",
          url: "https://falco.org/docs/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the kind of this admission configuration so the webhook can REJECT non-compliant Pods but can never modify them:",
        yaml:
          "apiVersion: admissionregistration.k8s.io/v1\nkind: ______\nwebhooks:\n  - name: policy.example.com\n    rules:\n      - apiGroups: [\"\"]\n        apiVersions: [\"v1\"]\n        operations: [\"CREATE\"]\n        resources: [\"pods\"]\n    clientConfig:\n      service:\n        name: policy-svc\n        namespace: platform\n        path: /validate",
        choices: [
          "ValidatingWebhookConfiguration",
          "MutatingWebhookConfiguration",
          "AdmissionWebhookConfiguration",
          "PolicyWebhookConfiguration"
        ],
        answer: 0,
        explanation:
          "Validating webhooks can only accept or reject requests, while mutating webhooks may also patch objects. Mutating webhooks run first, then validating webhooks see the final object — use validating for enforcement that must not alter workloads.",
        docs: {
          label: "Kubernetes docs: Dynamic Admission Control",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A platform component needs a TLS certificate signed by a certificate authority that the cluster trusts. Which Kubernetes API resource lets you submit a signing request that a cluster signer can approve and issue?",
        choices: [
          "CertificateSigningRequest",
          "TLSCertificate",
          "ClusterIssuer",
          "SecretSigningRequest"
        ],
        answer: 0,
        explanation:
          "The `certificates.k8s.io` API's `CertificateSigningRequest` resource carries a PEM-encoded CSR through an approve/deny workflow, after which a signer issues the certificate. Kubernetes itself uses this flow, e.g. for kubelet certificates.",
        docs: {
          label: "Kubernetes docs: Certificates and Certificate Signing Requests",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Policy requires that only images from the internal registry `registry.corp.example` may run in the cluster. What is the most reliable enforcement point?",
        choices: [
          "A wiki page instructing developers to use the internal registry",
          "An admission policy (webhook or ValidatingAdmissionPolicy) that rejects workloads whose image references are outside the approved registry",
          "A NetworkPolicy blocking Pod egress to public registries",
          "Naming conventions enforced by code review only"
        ],
        answer: 1,
        explanation:
          "Admission control evaluates every workload the API server accepts, so an image-registry policy there cannot be bypassed by a single team's process. Network blocks act on nodes (which pull images), not Pods, and documentation or review conventions are not enforcement.",
        docs: {
          label: "Kubernetes docs: Admission Control in Kubernetes",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/"
        }
      },
      {
        type: "tf",
        prompt:
          "Once a service mesh enforces mTLS between all workloads, Kubernetes NetworkPolicies no longer add any security value.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "mTLS authenticates and encrypts allowed connections, but NetworkPolicies control WHICH network paths exist at all (L3/L4), including for traffic that bypasses mesh sidecars. Using both is defense in depth, not redundancy.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "tf",
        prompt:
          "Kubernetes control plane components authenticate connections such as apiserver-to-kubelet using X.509 certificates issued from cluster certificate authorities, forming an internal PKI.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "A Kubernetes cluster relies on PKI: the API server, kubelets, etcd, and clients present certificates chained to cluster CAs for mutual authentication and TLS. Protecting CA keys and rotating certificates are core platform security tasks.",
        docs: {
          label: "Kubernetes docs: PKI certificates and requirements",
          url: "https://kubernetes.io/docs/setup/best-practices/certificates/"
        }
      }
    ]
  },
  {
    id: "kcsa-compliance",
    title: "6. Compliance and Security Frameworks",
    weight: "10%",
    description:
      "Compliance frameworks (NIST, CIS Benchmarks, PCI DSS awareness), threat modelling frameworks (STRIDE, MITRE ATT&CK for Containers), supply chain compliance (SLSA, SBOM), and automation and tooling.",
    questions: [
      {
        type: "mcq",
        prompt:
          "What does the CIS Kubernetes Benchmark provide?",
        choices: [
          "A legally binding certification required to run Kubernetes in production",
          "A set of prescriptive, checkable configuration hardening recommendations for Kubernetes components",
          "A vulnerability database of CVEs affecting Kubernetes releases",
          "A managed service that patches clusters automatically"
        ],
        answer: 1,
        explanation:
          "CIS Benchmarks are consensus-based hardening guides with concrete, auditable checks — e.g. kube-apiserver and kubelet flag settings, file permissions. They are best-practice guidance, not a legal certification or a CVE feed.",
        docs: {
          label: "CIS: Kubernetes Benchmark",
          url: "https://www.cisecurity.org/benchmark/kubernetes"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which NIST publication specifically provides guidance on the security of application containers?",
        choices: [
          "NIST SP 800-53 (Security and Privacy Controls)",
          "NIST SP 800-63 (Digital Identity Guidelines)",
          "NIST SP 800-190 (Application Container Security Guide)",
          "NIST SP 800-171 (Protecting Controlled Unclassified Information)"
        ],
        answer: 2,
        explanation:
          "`NIST SP 800-190` addresses container-specific risks — image, registry, orchestrator, container, and host OS countermeasures. SP 800-53 is a general control catalog, and the others cover identity and CUI respectively.",
        docs: {
          label: "NIST: SP 800-190 Application Container Security Guide",
          url: "https://csrc.nist.gov/pubs/sp/800/190/final"
        }
      },
      {
        type: "mcq",
        prompt:
          "During a STRIDE threat modelling session, you identify the risk that a compromised Pod could read another tenant's Secret data it was never authorized to see. Which STRIDE category does this threat belong to?",
        choices: [
          "Spoofing",
          "Repudiation",
          "Information Disclosure",
          "Elevation of Privilege"
        ],
        answer: 2,
        explanation:
          "STRIDE stands for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. Unauthorized reading of data is `Information Disclosure` — a violation of confidentiality.",
        docs: {
          label: "OWASP: Threat Modeling",
          url: "https://owasp.org/www-community/Threat_Modeling"
        }
      },
      {
        type: "mcq",
        prompt:
          "What is MITRE ATT&CK for Containers most useful for?",
        choices: [
          "Mapping detections and defenses to real-world adversary tactics and techniques observed against container environments",
          "Generating Kubernetes RBAC policies automatically",
          "Certifying that a registry is free of malicious images",
          "Benchmarking cluster performance under attack-like load"
        ],
        answer: 0,
        explanation:
          "ATT&CK is a knowledge base of adversary tactics (like Initial Access, Persistence, Privilege Escalation) and techniques drawn from real incidents. The Containers matrix helps teams assess detection coverage and structure threat-informed defense.",
        docs: {
          label: "MITRE: ATT&CK for Containers",
          url: "https://attack.mitre.org/matrices/enterprise/containers/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What problem does the SLSA framework primarily address?",
        choices: [
          "Encrypting Kubernetes Secrets at rest",
          "The integrity of the software supply chain, via graded levels of build provenance and tamper resistance",
          "Scoring the severity of CVEs from 0.0 to 10.0",
          "Isolating multi-tenant workloads at the kernel level"
        ],
        answer: 1,
        explanation:
          "`SLSA` (Supply-chain Levels for Software Artifacts) defines progressive levels of assurance about how an artifact was built — signed provenance, hardened build platforms — so consumers can trust that artifacts weren't tampered with. CVE scoring is CVSS.",
        docs: {
          label: "SLSA: Supply-chain Levels for Software Artifacts",
          url: "https://slsa.dev/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A critical vulnerability is announced in a popular logging library. Which artifact lets your team quickly determine WHICH of your container images actually include the affected component?",
        choices: [
          "A Software Bill of Materials (SBOM) for each image",
          "The images' Cosign signatures",
          "The cluster's audit log",
          "The CIS Benchmark report for the cluster"
        ],
        answer: 0,
        explanation:
          "An `SBOM` is a machine-readable inventory (e.g. SPDX or CycloneDX) of every component and dependency inside an artifact. When a new CVE lands, querying SBOMs identifies affected images without rescanning everything from scratch.",
        docs: {
          label: "CISA: Software Bill of Materials (SBOM)",
          url: "https://www.cisa.gov/sbom"
        }
      },
      {
        type: "tf",
        prompt:
          "A cluster that passes every check in the CIS Kubernetes Benchmark is automatically compliant with PCI DSS.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "CIS Benchmarks are technical hardening baselines, while `PCI DSS` is a broader compliance standard covering processes, cardholder data handling, access management, and audits. Passing one does not certify the other, though hardening supports compliance efforts.",
        docs: {
          label: "CIS: Kubernetes Benchmark",
          url: "https://www.cisecurity.org/benchmark/kubernetes"
        }
      },
      {
        type: "tf",
        prompt:
          "Tools such as kube-bench can automatically check a cluster's configuration against the CIS Kubernetes Benchmark instead of auditing every setting by hand.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Compliance checking is highly automatable: `kube-bench` runs the CIS Kubernetes Benchmark checks against nodes and control plane configuration and reports pass/fail results, making continuous compliance scanning practical.",
        docs: {
          label: "kube-bench: CIS Kubernetes Benchmark tool",
          url: "https://github.com/aquasecurity/kube-bench"
        }
      }
    ]
  }
];
