// CKS Practice Questions — organized by the 6 official curriculum domains.
// Each question has: type, prompt, optional yaml, choices, answer (index), explanation, docs.
// Docs links point to official documentation (kubernetes.io, falco.org, tool docs).

const CKS_CURRICULUM = [
  {
    id: "cks-cluster-setup",
    title: "1. Cluster Setup",
    weight: "15%",
    description:
      "NetworkPolicies to restrict cluster-level access, CIS benchmarks with kube-bench, Ingress with TLS, protecting node metadata endpoints, and verifying platform binaries.",
    questions: [
      {
        type: "mcq",
        prompt:
          "You must deny ALL incoming traffic to every pod in the `prod` namespace unless explicitly allowed by another policy. Which NetworkPolicy spec achieves this?",
        choices: [
          "podSelector: {} with policyTypes: [Ingress] and no ingress rules",
          "podSelector: {} with an ingress rule of from: []",
          "podSelector: {matchLabels: {deny: 'all'}} with policyTypes: [Ingress]",
          "No podSelector, with policyTypes: [Egress] and no egress rules"
        ],
        answer: 0,
        explanation:
          "An empty `podSelector: {}` selects every pod in the namespace, and listing `Ingress` in `policyTypes` with no `ingress` rules means no inbound traffic is allowed. Other policies can then whitelist specific traffic additively.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You run `kube-bench run --targets=master` on a control-plane node. What is kube-bench checking your cluster against?",
        choices: [
          "The Kubernetes conformance test suite",
          "The CIS Kubernetes Benchmark recommendations",
          "The Pod Security Standards (baseline and restricted)",
          "The NSA/CISA network segmentation requirements only"
        ],
        answer: 1,
        explanation:
          "`kube-bench` audits component configuration (API server, etcd, kubelet, etc.) against the CIS Kubernetes Benchmark and reports PASS/FAIL/WARN items with remediation steps.",
        docs: {
          label: "kube-bench docs: Running kube-bench",
          url: "https://github.com/aquasecurity/kube-bench"
        }
      },
      {
        type: "mcq",
        prompt:
          "kube-bench reports FAIL: \"Ensure that the --profiling argument is set to false\" for the API server on a kubeadm cluster. Where do you make the fix?",
        choices: [
          "Edit /etc/kubernetes/manifests/kube-apiserver.yaml and add --profiling=false to the command",
          "Run kubectl edit deployment kube-apiserver -n kube-system",
          "Edit /var/lib/kubelet/config.yaml and set profiling: false",
          "Run kubeadm upgrade apply --set profiling=false"
        ],
        answer: 0,
        explanation:
          "On kubeadm clusters the API server is a static pod defined in `/etc/kubernetes/manifests/kube-apiserver.yaml`. The kubelet watches this file and recreates the pod when you edit the flags — it is not managed by a Deployment.",
        docs: {
          label: "Kubernetes docs: Create static Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A NetworkPolicy should allow ingress to `db` pods only from pods running in namespaces labeled `team=backend`. Which field selects the allowed source namespaces?",
        choices: [
          "from: - namespaceSelector: matchLabels: team: backend",
          "from: - podSelector: matchLabels: team: backend",
          "from: - ipBlock: namespace: backend",
          "allowedNamespaces: [backend]"
        ],
        answer: 0,
        explanation:
          "`namespaceSelector` inside a `from` entry matches namespaces by their labels. A bare `podSelector` in `from` only matches pods in the policy's own namespace.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the Ingress so it terminates TLS for `secure.example.com` using the certificate stored in the Secret `web-tls`:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: web\nspec:\n  tls:\n    - hosts:\n        - secure.example.com\n      ______: web-tls\n  rules:\n    - host: secure.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80",
        choices: ["secretName", "tlsSecret", "certificateRef", "secretRef"],
        answer: 0,
        explanation:
          "The `tls` section of an Ingress references a Secret of type `kubernetes.io/tls` by `secretName`. The Secret must contain `tls.crt` and `tls.key` and live in the same namespace as the Ingress.",
        docs: {
          label: "Kubernetes docs: Ingress — TLS",
          url: "https://kubernetes.io/docs/concepts/services-networking/ingress/#tls"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this egress policy lets pods reach any address EXCEPT the cloud metadata endpoint 169.254.169.254:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: block-metadata\nspec:\n  podSelector: {}\n  policyTypes:\n    - Egress\n  egress:\n    - to:\n        - ipBlock:\n            cidr: 0.0.0.0/0\n            ______:\n              - 169.254.169.254/32",
        choices: ["except", "exclude", "deny", "notCIDR"],
        answer: 0,
        explanation:
          "An `ipBlock` can carve exceptions out of its `cidr` using the `except` list. Blocking `169.254.169.254/32` prevents compromised pods from stealing node credentials from the cloud metadata service.",
        docs: {
          label: "Kubernetes docs: Network Policies",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the command so it verifies the downloaded kubectl binary against the official SHA-256 checksum file:",
        yaml:
          "curl -LO \"https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl\"\ncurl -LO \"https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl.sha256\"\necho \"$(cat kubectl.sha256)  kubectl\" | sha256sum ______",
        choices: ["--check", "--verify", "--validate", "--digest"],
        answer: 0,
        explanation:
          "`sha256sum --check` (or `-c`) reads \"<hash>  <filename>\" pairs from stdin or a file and reports `kubectl: OK` if the binary's checksum matches. Always verify platform binaries before installing them.",
        docs: {
          label: "Kubernetes docs: Install kubectl on Linux",
          url: "https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/"
        }
      },
      {
        type: "tf",
        prompt:
          "NetworkPolicies are enforced by the cluster's CNI network plugin; if the plugin does not support them, creating a NetworkPolicy has no effect.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "The API server happily stores NetworkPolicy objects, but enforcement is done by the network plugin (e.g. Calico, Cilium). With a plugin that lacks support, traffic remains unrestricted.",
        docs: {
          label: "Kubernetes docs: Network Policies — Prerequisites",
          url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/"
        }
      }
    ]
  },
  {
    id: "cks-cluster-hardening",
    title: "2. Cluster Hardening",
    weight: "15%",
    description:
      "Restricting access to the Kubernetes API, RBAC least privilege, ServiceAccount hygiene, and keeping Kubernetes updated.",
    questions: [
      {
        type: "mcq",
        prompt:
          "A CI pipeline only needs to `get` and `list` Deployments in the `ci` namespace. Following least privilege, which RBAC objects should you create?",
        choices: [
          "A Role in the ci namespace plus a RoleBinding to the pipeline's ServiceAccount",
          "A ClusterRole plus a ClusterRoleBinding to the pipeline's ServiceAccount",
          "A ClusterRole plus a ClusterRoleBinding to the system:authenticated group",
          "A RoleBinding to the built-in cluster-admin ClusterRole in the ci namespace"
        ],
        answer: 0,
        explanation:
          "A namespaced `Role` with only the needed verbs/resources, bound by a `RoleBinding`, grants the minimum required access. ClusterRoleBindings grant access in every namespace, and `cluster-admin` grants everything.",
        docs: {
          label: "Kubernetes docs: Using RBAC Authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want to confirm whether the ServiceAccount `app-sa` in namespace `prod` is allowed to delete Secrets there. Which command answers this directly?",
        choices: [
          "kubectl auth can-i delete secrets -n prod --as=system:serviceaccount:prod:app-sa",
          "kubectl get rolebindings -n prod -o wide | grep app-sa",
          "kubectl describe serviceaccount app-sa -n prod",
          "kubectl auth reconcile -f app-sa.yaml -n prod"
        ],
        answer: 0,
        explanation:
          "`kubectl auth can-i` with `--as=system:serviceaccount:<namespace>:<name>` asks the authorizer directly and prints yes/no. Inspecting bindings by hand is error-prone because permissions can come from many Roles and ClusterRoles.",
        docs: {
          label: "Kubernetes docs: Authorization — Checking API access",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/authorization/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want to stop kubelets from modifying Node labels and Pods that belong to other nodes, limiting the blast radius of a compromised node. Which admission controller enforces this?",
        choices: [
          "NodeRestriction",
          "PodNodeSelector",
          "LimitRanger",
          "NamespaceLifecycle"
        ],
        answer: 0,
        explanation:
          "The `NodeRestriction` admission plugin (enabled via `--enable-admission-plugins=NodeRestriction`) restricts each kubelet to modifying only its own Node object and the Pods bound to it.",
        docs: {
          label: "Kubernetes docs: Admission Controllers — NodeRestriction",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#noderestriction"
        }
      },
      {
        type: "mcq",
        prompt:
          "You are upgrading a kubeadm cluster from 1.29 to 1.30. What is the correct order of operations?",
        choices: [
          "Upgrade kubeadm on the control plane, run kubeadm upgrade apply, upgrade kubelet/kubectl there, then upgrade worker nodes one at a time",
          "Upgrade the kubelet on all workers first, then run kubeadm upgrade apply on the control plane",
          "Run kubeadm upgrade apply simultaneously on all nodes to avoid version skew",
          "Delete the control-plane static pods and reinstall the new version with kubeadm init"
        ],
        answer: 0,
        explanation:
          "Control-plane components are upgraded first with `kubeadm upgrade apply`, followed by the control-plane kubelet, then workers are drained and upgraded one by one with `kubeadm upgrade node`. Kubelets must never be newer than the API server.",
        docs: {
          label: "Kubernetes docs: Upgrading kubeadm clusters",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/"
        }
      },
      {
        type: "yaml",
        prompt:
          "This pod does not talk to the Kubernetes API. Fill in the field that prevents its ServiceAccount token from being mounted into the container:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: worker\nspec:\n  serviceAccountName: worker-sa\n  ______: false\n  containers:\n    - name: worker\n      image: registry.local/worker:1.4",
        choices: [
          "automountServiceAccountToken",
          "mountServiceAccountToken",
          "enableServiceLinks",
          "serviceAccountTokenProjection"
        ],
        answer: 0,
        explanation:
          "`automountServiceAccountToken: false` (settable on the Pod spec or the ServiceAccount itself) stops the token from being mounted at `/var/run/secrets/kubernetes.io/serviceaccount`, removing an easy credential for attackers.",
        docs: {
          label: "Kubernetes docs: Configure Service Accounts for Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the RoleBinding so the Role `pod-reader` is granted to the ServiceAccount `app-sa` in the `prod` namespace:",
        yaml:
          "apiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: read-pods\n  namespace: prod\nsubjects:\n  - kind: ______\n    name: app-sa\n    namespace: prod\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io",
        choices: ["ServiceAccount", "User", "Group", "Subject"],
        answer: 0,
        explanation:
          "RoleBinding subjects can be of kind `User`, `Group`, or `ServiceAccount`. ServiceAccount subjects also require a `namespace` field, since they are namespaced objects.",
        docs: {
          label: "Kubernetes docs: Using RBAC Authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "tf",
        prompt:
          "When a ClusterRole is referenced by a RoleBinding (not a ClusterRoleBinding), the permissions it grants apply only within the RoleBinding's namespace.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "A `RoleBinding` may reference a ClusterRole to reuse a common permission set, but the grant is scoped to the binding's namespace. Only a `ClusterRoleBinding` makes it cluster-wide.",
        docs: {
          label: "Kubernetes docs: RBAC — RoleBinding and ClusterRoleBinding",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding"
        }
      },
      {
        type: "tf",
        prompt:
          "The Kubernetes project only provides security patches for the most recent minor releases, so clusters running old versions accumulate known, unpatched CVEs.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Only the latest three minor releases receive patch (including security) updates. Upgrading frequently is itself a hardening measure because it keeps known CVE fixes applied.",
        docs: {
          label: "Kubernetes docs: Version Skew Policy",
          url: "https://kubernetes.io/releases/version-skew-policy/"
        }
      }
    ]
  },
  {
    id: "cks-system-hardening",
    title: "3. System Hardening",
    weight: "10%",
    description:
      "Minimizing the host OS footprint, least-privilege IAM, reducing external network exposure, and kernel hardening with AppArmor and seccomp.",
    questions: [
      {
        type: "mcq",
        prompt:
          "You wrote an AppArmor profile at /etc/apparmor.d/k8s-deny-write on a worker node. Which command loads it into the kernel so pods can reference it?",
        choices: [
          "apparmor_parser /etc/apparmor.d/k8s-deny-write",
          "aa-status /etc/apparmor.d/k8s-deny-write",
          "kubectl apply -f /etc/apparmor.d/k8s-deny-write",
          "systemctl reload k8s-deny-write"
        ],
        answer: 0,
        explanation:
          "`apparmor_parser` loads (or with `-r`, replaces) a profile into the kernel. Kubernetes does not distribute profiles for you — they must already be loaded on every node where the pod can run. `aa-status` only shows loaded profiles.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Access to Resources with AppArmor",
          url: "https://kubernetes.io/docs/tutorials/security/apparmor/"
        }
      },
      {
        type: "mcq",
        prompt:
          "While hardening a worker node you want to find unexpected services listening on network ports, including which process owns each socket. Which command is most appropriate?",
        choices: [
          "ss -tulpn",
          "iptables -L -v",
          "lsmod",
          "df -h"
        ],
        answer: 0,
        explanation:
          "`ss -tulpn` lists TCP/UDP listening sockets with the owning process. Unneeded listeners (e.g. an old FTP daemon) should be stopped and disabled to shrink the node's attack surface.",
        docs: {
          label: "Kubernetes docs: Security — Cloud Native Security overview",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Your worker nodes run in a cloud provider with an attached IAM role. Which practice best limits what an attacker gains by compromising a pod on those nodes?",
        choices: [
          "Scope the node IAM role to the minimum permissions the cluster actually needs",
          "Attach an administrator IAM role so kubelet never hits permission errors",
          "Share one IAM access key across all pods via a ConfigMap for auditability",
          "Disable IAM entirely and hardcode credentials in the container image"
        ],
        answer: 0,
        explanation:
          "Pods can often reach the node's cloud credentials (e.g. via the metadata endpoint), so the node role must follow least privilege. Broad roles turn any pod compromise into a cloud-account compromise.",
        docs: {
          label: "Kubernetes docs: Security — Cloud Native Security overview",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "What is the effect of setting `securityContext.seccompProfile.type: RuntimeDefault` on a container?",
        choices: [
          "The container runtime's default seccomp profile filters the container's syscalls",
          "All seccomp filtering is disabled for the container",
          "The kubelet generates a custom profile from the container's observed syscalls",
          "The container is forced to run in a user namespace"
        ],
        answer: 0,
        explanation:
          "`RuntimeDefault` applies the container runtime's built-in seccomp profile (e.g. containerd's default), which blocks dozens of dangerous syscalls while remaining compatible with most workloads.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Syscalls with seccomp",
          url: "https://kubernetes.io/docs/tutorials/security/seccomp/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this container is confined by the AppArmor profile `k8s-deny-write` already loaded on the node:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: hardened\nspec:\n  containers:\n    - name: app\n      image: busybox\n      command: ['sh', '-c', 'sleep 3600']\n      securityContext:\n        ______:\n          type: Localhost\n          localhostProfile: k8s-deny-write",
        choices: ["appArmorProfile", "apparmor", "seLinuxOptions", "profileRef"],
        answer: 0,
        explanation:
          "Since Kubernetes 1.30, AppArmor is configured with the `appArmorProfile` field in `securityContext` (replacing the old beta annotation). `type: Localhost` references a profile pre-loaded on the node.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Access to Resources with AppArmor",
          url: "https://kubernetes.io/docs/tutorials/security/apparmor/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the securityContext so the pod uses the custom seccomp profile file `profiles/audit.json` from the node's kubelet seccomp directory:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: audited\nspec:\n  securityContext:\n    seccompProfile:\n      type: ______\n      localhostProfile: profiles/audit.json\n  containers:\n    - name: app\n      image: nginx",
        choices: ["Localhost", "RuntimeDefault", "Unconfined", "CustomProfile"],
        answer: 0,
        explanation:
          "`type: Localhost` tells the kubelet to load the JSON profile at `localhostProfile`, relative to the kubelet's seccomp root (`/var/lib/kubelet/seccomp` by default). `RuntimeDefault` and `Unconfined` do not take a profile path.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Syscalls with seccomp",
          url: "https://kubernetes.io/docs/tutorials/security/seccomp/"
        }
      },
      {
        type: "tf",
        prompt:
          "If a pod sets no `seccompProfile` at all and the kubelet has no special configuration, the container runs with the runtime's default seccomp profile applied.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "With no profile set, containers run `Unconfined` — no syscall filtering — unless the kubelet enables `seccompDefault` to make `RuntimeDefault` the fallback. Explicitly setting a profile is a key hardening step.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Syscalls with seccomp",
          url: "https://kubernetes.io/docs/tutorials/security/seccomp/"
        }
      },
      {
        type: "tf",
        prompt:
          "An AppArmor `Localhost` profile referenced by a pod must already be loaded on every node where that pod might be scheduled, or the pod will fail to start there.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Kubernetes does not copy AppArmor profiles between nodes. If the referenced profile is not loaded on the scheduled node, the container is rejected — so distribute profiles with node provisioning tooling or a DaemonSet.",
        docs: {
          label: "Kubernetes docs: Restrict a Container's Access to Resources with AppArmor",
          url: "https://kubernetes.io/docs/tutorials/security/apparmor/"
        }
      }
    ]
  },
  {
    id: "cks-microservice-vulns",
    title: "4. Minimize Microservice Vulnerabilities",
    weight: "20%",
    description:
      "Pod and container securityContext, Pod Security Standards and Admission, Secrets encryption at rest, sandboxed runtimes with RuntimeClass, and pod-to-pod mTLS.",
    questions: [
      {
        type: "mcq",
        prompt:
          "After you set `readOnlyRootFilesystem: true`, your app crashes because it writes cache files to /tmp. What is the recommended fix that keeps the root filesystem read-only?",
        choices: [
          "Mount an emptyDir volume at /tmp",
          "Set readOnlyRootFilesystem back to false for that one container",
          "Add the SYS_ADMIN capability so the app can remount / as writable",
          "Run the container as root so it can bypass the read-only flag"
        ],
        answer: 0,
        explanation:
          "Mounting an `emptyDir` (or other volume) at the specific writable path keeps the image's root filesystem immutable while giving the app scratch space. Granting `SYS_ADMIN` or root defeats the hardening entirely.",
        docs: {
          label: "Kubernetes docs: Configure a Security Context for a Pod or Container",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You must enforce the `restricted` Pod Security Standard on the `payments` namespace so violating pods are rejected. What do you apply?",
        choices: [
          "The label pod-security.kubernetes.io/enforce: restricted on the namespace",
          "The annotation security.kubernetes.io/policy: restricted on each pod",
          "A PodSecurityPolicy object named restricted in the namespace",
          "The label pod-security.kubernetes.io/audit: restricted on the namespace"
        ],
        answer: 0,
        explanation:
          "Pod Security Admission is configured with namespace labels. The `enforce` mode rejects violating pods, while `audit` and `warn` only log or warn. PodSecurityPolicy was removed in Kubernetes 1.25.",
        docs: {
          label: "Kubernetes docs: Pod Security Admission",
          url: "https://kubernetes.io/docs/concepts/security/pod-security-admission/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You created an EncryptionConfiguration file so Secrets are encrypted at rest in etcd. Which kube-apiserver flag activates it?",
        choices: [
          "--encryption-provider-config=/etc/kubernetes/enc/enc.yaml",
          "--secret-encryption-config=/etc/kubernetes/enc/enc.yaml",
          "--etcd-encryption-file=/etc/kubernetes/enc/enc.yaml",
          "--enable-encryption-at-rest=true"
        ],
        answer: 0,
        explanation:
          "`--encryption-provider-config` points the API server at the `EncryptionConfiguration` file. Remember that existing Secrets stay plaintext until rewritten, e.g. with `kubectl get secrets -A -o json | kubectl replace -f -`.",
        docs: {
          label: "Kubernetes docs: Encrypting Confidential Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "mcq",
        prompt:
          "An untrusted workload must run with stronger isolation using the gVisor sandbox. gVisor (runsc) is installed and configured in containerd on your nodes. What remains to be done in Kubernetes?",
        choices: [
          "Create a RuntimeClass with handler runsc, then set runtimeClassName on the pod spec",
          "Set securityContext.sandboxed: true on the pod",
          "Add the annotation io.kubernetes.sandbox: gvisor to the pod",
          "Set the kubelet flag --container-runtime=runsc on every node"
        ],
        answer: 0,
        explanation:
          "A `RuntimeClass` maps a name to a runtime `handler` (like `runsc` for gVisor or `kata` for Kata Containers), and pods opt in with `spec.runtimeClassName`. There is no `sandboxed` securityContext field.",
        docs: {
          label: "Kubernetes docs: Runtime Class",
          url: "https://kubernetes.io/docs/concepts/containers/runtime-class/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Harden this container by removing ALL Linux capabilities. Fill in the missing field:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: locked-down\nspec:\n  containers:\n    - name: app\n      image: registry.local/app:2.1\n      securityContext:\n        runAsNonRoot: true\n        allowPrivilegeEscalation: false\n        capabilities:\n          ______:\n            - ALL",
        choices: ["drop", "remove", "deny", "revoke"],
        answer: 0,
        explanation:
          "`capabilities.drop: [\"ALL\"]` removes every capability; specific ones can then be re-added with `add` (e.g. `NET_BIND_SERVICE`). Dropping ALL is required by the `restricted` Pod Security Standard.",
        docs: {
          label: "Kubernetes docs: Configure a Security Context for a Pod or Container",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this RuntimeClass so pods referencing it are executed by the gVisor runtime configured in containerd as `runsc`:",
        yaml:
          "apiVersion: node.k8s.io/v1\nkind: RuntimeClass\nmetadata:\n  name: gvisor\n______: runsc",
        choices: ["handler", "runtime", "containerRuntime", "sandbox"],
        answer: 0,
        explanation:
          "`handler` names the CRI runtime configuration on the node (e.g. the containerd runtime section for `runsc`). Pods select it with `spec.runtimeClassName: gvisor`.",
        docs: {
          label: "Kubernetes docs: Runtime Class",
          url: "https://kubernetes.io/docs/concepts/containers/runtime-class/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the EncryptionConfiguration so Secrets are encrypted with AES-CBC with PKCS#7 padding before being written to etcd:",
        yaml:
          "apiVersion: apiserver.config.k8s.io/v1\nkind: EncryptionConfiguration\nresources:\n  - resources:\n      - secrets\n    providers:\n      - ______:\n          keys:\n            - name: key1\n              secret: c2VjcmV0IGlzIHNlY3VyZQ==\n      - identity: {}",
        choices: ["aescbc", "kms", "secretbox", "identity"],
        answer: 0,
        explanation:
          "`aescbc` is the AES-CBC with PKCS#7 padding provider. `identity` stores data unencrypted, and listing it after `aescbc` only allows reading legacy plaintext data during migration. `kms` delegates to an external key service.",
        docs: {
          label: "Kubernetes docs: Encrypting Confidential Data at Rest",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/"
        }
      },
      {
        type: "tf",
        prompt:
          "A service mesh (e.g. Istio) can provide mutual TLS between pods by injecting sidecar proxies, without changing the application code.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Sidecar proxies intercept pod traffic and handle certificate issuance, rotation, and mTLS handshakes transparently, so both peers are authenticated and traffic is encrypted in transit with no application changes.",
        docs: {
          label: "Istio docs: Security concepts",
          url: "https://istio.io/latest/docs/concepts/security/"
        }
      }
    ]
  },
  {
    id: "cks-supply-chain",
    title: "5. Supply Chain Security",
    weight: "20%",
    description:
      "Minimizing base image footprint, SBOMs, image signing and allowlisting with admission controllers, static analysis of manifests and Dockerfiles, and vulnerability scanning.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Why does basing a production image on `gcr.io/distroless/static` instead of `ubuntu:22.04` improve security?",
        choices: [
          "It removes the shell and package manager, drastically shrinking the attack surface",
          "It automatically signs the image with cosign at build time",
          "It forces the container to run with a read-only root filesystem",
          "It enables seccomp filtering that full distributions do not support"
        ],
        answer: 0,
        explanation:
          "Distroless images contain only the application and its runtime dependencies — no shell, no package manager, far fewer libraries. Fewer components means fewer CVEs and fewer tools for an attacker who lands inside.",
        docs: {
          label: "Distroless docs: GoogleContainerTools/distroless",
          url: "https://github.com/GoogleContainerTools/distroless"
        }
      },
      {
        type: "mcq",
        prompt:
          "Your CI pipeline runs `trivy image registry.local/app:v2`. Which flag makes the pipeline step fail (non-zero exit) when vulnerabilities are found?",
        choices: [
          "--exit-code 1",
          "--fail-on-vuln",
          "--strict",
          "--severity-threshold error"
        ],
        answer: 0,
        explanation:
          "`trivy image --exit-code 1` returns exit code 1 when findings match the filters, which is how you gate a CI pipeline. By default Trivy exits 0 even when vulnerabilities are reported.",
        docs: {
          label: "Trivy docs: Documentation",
          url: "https://aquasecurity.github.io/trivy/latest/docs/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Company policy: the API server must ask an external service to approve or reject every image before a pod is admitted. Which admission controller implements this?",
        choices: [
          "ImagePolicyWebhook",
          "AlwaysPullImages",
          "DenyServiceExternalIPs",
          "ServiceAccount"
        ],
        answer: 0,
        explanation:
          "`ImagePolicyWebhook` sends an ImageReview request to an external backend for each pod's images and admits or rejects based on the response. Its `defaultAllow` setting controls what happens when the backend is unreachable.",
        docs: {
          label: "Kubernetes docs: Admission Controllers — ImagePolicyWebhook",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook"
        }
      },
      {
        type: "mcq",
        prompt:
          "An auditor asks for the SBOM of your container image. What are they asking for?",
        choices: [
          "A machine-readable inventory of every package, library, and dependency inside the image",
          "The cryptographic signature proving who built the image",
          "The list of CVEs currently affecting the image",
          "The Dockerfile used to build the image"
        ],
        answer: 0,
        explanation:
          "A Software Bill of Materials lists the components an artifact contains (commonly in SPDX or CycloneDX format), so you can answer \"are we affected?\" when a new CVE drops. Tools like `trivy image --format cyclonedx` or syft generate them.",
        docs: {
          label: "Trivy docs: SBOM",
          url: "https://aquasecurity.github.io/trivy/latest/docs/supply-chain/sbom/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the multi-stage Dockerfile so only the compiled binary from the build stage is copied into the minimal final image:",
        yaml:
          "FROM golang:1.22 AS build\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /src/app .\n\nFROM gcr.io/distroless/static\nCOPY ______ /src/app /app\nENTRYPOINT [\"/app\"]",
        choices: ["--from=build", "--stage=build", "--source=build", "build:"],
        answer: 0,
        explanation:
          "`COPY --from=<stage>` copies files out of an earlier named build stage. The toolchain, source code, and intermediate layers stay behind, leaving a tiny final image with just the binary.",
        docs: {
          label: "Docker docs: Multi-stage builds",
          url: "https://docs.docker.com/build/building/multi-stage/"
        }
      },
      {
        type: "yaml",
        prompt:
          "A static analysis tool (hadolint) flags this Dockerfile because the container will run as root. Fill in the instruction that fixes it:",
        yaml:
          "FROM gcr.io/distroless/base\nCOPY app /app\n______ 10001\nENTRYPOINT [\"/app\"]",
        choices: ["USER", "RUN", "UID", "ONBUILD"],
        answer: 0,
        explanation:
          "The `USER` instruction sets the UID (or username) the container runs as; using a high numeric UID like 10001 also satisfies `runAsNonRoot` checks, which can only verify numeric IDs without inspecting the image.",
        docs: {
          label: "Docker docs: Dockerfile reference — USER",
          url: "https://docs.docker.com/reference/dockerfile/#user"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the command so Trivy scans the image but reports only HIGH and CRITICAL vulnerabilities:",
        yaml:
          "trivy image ______ HIGH,CRITICAL registry.local/app:v2",
        choices: ["--severity", "--level", "--filter", "--min-cvss"],
        answer: 0,
        explanation:
          "`--severity` filters findings to the listed levels (UNKNOWN, LOW, MEDIUM, HIGH, CRITICAL). Combined with `--exit-code 1` it lets CI fail only on serious vulnerabilities.",
        docs: {
          label: "Trivy docs: Documentation",
          url: "https://aquasecurity.github.io/trivy/latest/docs/"
        }
      },
      {
        type: "tf",
        prompt:
          "Referencing an image by digest (e.g. `nginx@sha256:abc123...`) guarantees you always run exactly the same image content, whereas a tag like `nginx:1.25` can be re-pointed to different content.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "A digest is a content-addressed hash of the image manifest, so it is immutable. Tags are mutable pointers that a registry owner (or attacker) can move to a different image — pinning digests defends against that.",
        docs: {
          label: "Kubernetes docs: Images",
          url: "https://kubernetes.io/docs/concepts/containers/images/"
        }
      }
    ]
  },
  {
    id: "cks-runtime-security",
    title: "6. Monitoring, Logging and Runtime Security",
    weight: "20%",
    description:
      "Behavioral analytics and threat detection with Falco, container immutability, and Kubernetes audit logging with policy levels.",
    questions: [
      {
        type: "mcq",
        prompt:
          "In a Kubernetes audit Policy, which level records the request body (e.g. the manifest being applied) but NOT the response body?",
        choices: ["Metadata", "Request", "RequestResponse", "None"],
        answer: 1,
        explanation:
          "`Request` logs event metadata plus the request body; `RequestResponse` adds the response body; `Metadata` logs only who/what/when; `None` suppresses matching events entirely.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      },
      {
        type: "mcq",
        prompt:
          "How does Falco detect that a process inside a running container suddenly spawned a shell or read /etc/shadow?",
        choices: [
          "By observing system calls via a kernel driver or eBPF probe and matching them against rules",
          "By scanning the container image layers for malicious binaries",
          "By parsing kube-apiserver audit logs for exec events only",
          "By diffing the container filesystem against the original image every minute"
        ],
        answer: 0,
        explanation:
          "Falco instruments the kernel (kernel module or eBPF) to stream syscalls in real time and evaluates them against its rules, producing alerts on anomalous behavior. Image scanning and audit logs are complementary, not how Falco works.",
        docs: {
          label: "Falco docs: The Falco Project",
          url: "https://falco.org/docs/"
        }
      },
      {
        type: "mcq",
        prompt:
          "During an incident review you find someone ran `kubectl exec` into a production container and installed a debugging package with apt. Which response best restores and preserves container immutability?",
        choices: [
          "Rebuild the image with the required tooling (or fix the bug), redeploy, and restrict exec via RBAC",
          "Keep the patched container running but document the change in a runbook",
          "Snapshot the modified container with docker commit and push it as the new prod image",
          "Schedule a nightly cron job that re-runs the same apt install after each restart"
        ],
        answer: 0,
        explanation:
          "Immutable containers are never modified in place — changes go through the image build and deploy pipeline, where they are reviewed and scanned. Live-patched containers drift from their image and evade supply-chain controls.",
        docs: {
          label: "Kubernetes docs: Security — Cloud Native Security overview",
          url: "https://kubernetes.io/docs/concepts/security/cloud-native-security/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A request to the API server matches several rules in your audit Policy file. Which rule determines the audit level applied to that request?",
        choices: [
          "The first matching rule in the file",
          "The last matching rule in the file",
          "The rule with the most verbose level wins",
          "All matching rules apply, producing one event per rule"
        ],
        answer: 0,
        explanation:
          "Audit policy rules are evaluated top-down and the first match sets the level, so put specific rules (e.g. `Metadata` for secrets) before broad catch-all rules.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Secrets must be audited without ever writing their values to the audit log. Fill in the appropriate level:",
        yaml:
          "apiVersion: audit.k8s.io/v1\nkind: Policy\nrules:\n  - level: ______\n    resources:\n      - group: \"\"\n        resources: [\"secrets\"]\n  - level: RequestResponse\n    resources:\n      - group: \"\"\n        resources: [\"pods\"]",
        choices: ["Metadata", "Request", "RequestResponse", "None"],
        answer: 0,
        explanation:
          "`Metadata` records who accessed which Secret and when, but omits the request and response bodies — so the Secret data itself never lands in the audit log. `Request` or `RequestResponse` would leak the payload.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this Falco rule so it fires when a shell process starts inside a container:",
        yaml:
          "- rule: Terminal shell in container\n  desc: A shell was spawned inside a container\n  ______: >\n    spawned_process and container\n    and proc.name in (bash, sh, zsh)\n  output: >\n    Shell spawned in container (user=%user.name container=%container.id image=%container.image.repository)\n  priority: WARNING",
        choices: ["condition", "filter", "match", "trigger"],
        answer: 0,
        explanation:
          "A Falco rule's `condition` is the filter expression evaluated against events; when it matches, the `output` template is rendered at the given `priority`. Rules can reuse macros like `spawned_process` and `container`.",
        docs: {
          label: "Falco docs: Rules",
          url: "https://falco.org/docs/rules/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Enable audit logging on a kubeadm control plane by completing the kube-apiserver flag that sets where audit events are written:",
        yaml:
          "# /etc/kubernetes/manifests/kube-apiserver.yaml (excerpt)\nspec:\n  containers:\n    - command:\n        - kube-apiserver\n        - --audit-policy-file=/etc/kubernetes/audit-policy.yaml\n        - --______=/var/log/kubernetes/audit/audit.log\n        - --audit-log-maxage=30",
        choices: ["audit-log-path", "audit-log-file", "audit-output-path", "audit-log-dir"],
        answer: 0,
        explanation:
          "`--audit-log-path` sets the file the log backend writes audit events to, and `--audit-policy-file` selects which events are recorded at which level. Remember to mount both paths into the static pod with hostPath volumes.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      },
      {
        type: "tf",
        prompt:
          "Kubernetes audit logs are generated by the kubelet on each worker node, so you must aggregate them from every node in the cluster.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "Audit events are produced by the kube-apiserver as requests pass through its handler chain, and written by its configured backend (log file or webhook) on the control plane — not by kubelets on workers.",
        docs: {
          label: "Kubernetes docs: Auditing",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/"
        }
      }
    ]
  }
];
