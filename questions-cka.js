// CKA Practice Questions — organized by the 5 official curriculum domains.
// Each question has: type, prompt, optional yaml, choices, answer (index), explanation, docs.
// Docs links point to official documentation.

const CKA_CURRICULUM = [
  {
    id: "cka-storage",
    title: "1. Storage",
    weight: "10%",
    description:
      "StorageClasses, dynamic provisioning, PersistentVolumes and PersistentVolumeClaims, access modes, reclaim policies, and volume types.",
    questions: [
      {
        type: "mcq",
        prompt:
          "A PersistentVolume holds critical data. You want the underlying volume and its data to be kept (not deleted) when the bound PVC is removed. Which reclaim policy should the PV use?",
        choices: ["Delete", "Retain", "Recycle", "Preserve"],
        answer: 1,
        explanation:
          "With `persistentVolumeReclaimPolicy: Retain`, deleting the PVC leaves the PV (and its data) intact in a `Released` state. `Delete` removes the backing storage; `Recycle` is deprecated.",
        docs: {
          label: "Kubernetes docs: Persistent Volumes — Reclaiming",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this StorageClass so that volume binding and dynamic provisioning are delayed until a Pod using the PVC is actually scheduled (useful for topology-aware provisioning):",
        yaml:
          "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: fast-local\nprovisioner: ebs.csi.aws.com\nvolumeBindingMode: ______",
        choices: ["WaitForFirstConsumer", "Immediate", "DelayedBinding", "OnPodScheduled"],
        answer: 0,
        explanation:
          "`WaitForFirstConsumer` delays PV binding and provisioning until a Pod using the PVC is scheduled, so the volume is created in the right zone/node topology. `Immediate` (the default) binds as soon as the PVC is created.",
        docs: {
          label: "Kubernetes docs: Storage Classes",
          url: "https://kubernetes.io/docs/concepts/storage/storage-classes/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A shared reports volume must be mounted read-write by pods running simultaneously on several different nodes. Which access mode must the PersistentVolume support?",
        choices: ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany", "ReadWriteOncePod"],
        answer: 2,
        explanation:
          "`ReadWriteMany` (RWX) allows the volume to be mounted read-write by many nodes at once. `ReadWriteOnce` limits read-write mounting to a single node, and `ReadWriteOncePod` to a single pod.",
        docs: {
          label: "Kubernetes docs: Persistent Volumes — Access Modes",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so this PVC requests dynamic provisioning from the StorageClass named `fast-ssd`:",
        yaml:
          "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: db-data\nspec:\n  accessModes:\n    - ReadWriteOnce\n  ______: fast-ssd\n  resources:\n    requests:\n      storage: 5Gi",
        choices: ["storageClassName", "storageClass", "className", "provisioner"],
        answer: 0,
        explanation:
          "A PVC selects its StorageClass with `spec.storageClassName`. If the class has a provisioner, a matching PV is created dynamically; `provisioner` is a field on the StorageClass itself, not the PVC.",
        docs: {
          label: "Kubernetes docs: Dynamic Volume Provisioning",
          url: "https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/"
        }
      },
      {
        type: "mcq",
        prompt:
          "PVCs created without a `storageClassName` are not being provisioned in your cluster. Which annotation on a StorageClass marks it as the cluster default so such PVCs use it automatically?",
        choices: [
          "storageclass.kubernetes.io/is-default-class: \"true\"",
          "kubernetes.io/default-storage-class: \"true\"",
          "storage.k8s.io/default: \"enabled\"",
          "storageclass.kubernetes.io/auto-provision: \"true\""
        ],
        answer: 0,
        explanation:
          "Setting the annotation `storageclass.kubernetes.io/is-default-class: \"true\"` on a StorageClass makes it the default, so PVCs that omit `storageClassName` are provisioned from it.",
        docs: {
          label: "Kubernetes docs: Change the default StorageClass",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/"
        }
      },
      {
        type: "tf",
        prompt:
          "A PVC requesting 3Gi can bind to a pre-created PersistentVolume whose capacity is 10Gi.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "Binding requires the PV to satisfy at least the requested size and access modes. A 10Gi PV can bind a 3Gi claim — the claim then gets the whole PV, since binding is one-to-one.",
        docs: {
          label: "Kubernetes docs: Persistent Volumes — Binding",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#binding"
        }
      },
      {
        type: "mcq",
        prompt:
          "You delete a PVC that was bound to a PV with reclaim policy `Retain`. `kubectl get pv` now shows the PV in a phase where it cannot be claimed by a new PVC. Which phase is that?",
        choices: ["Available", "Bound", "Released", "Terminating"],
        answer: 2,
        explanation:
          "With `Retain`, the PV enters the `Released` phase after its claim is deleted. It still holds the old claim reference and data, so an admin must manually clean it up before it can become `Available` again.",
        docs: {
          label: "Kubernetes docs: Persistent Volumes — Phase",
          url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/#phase"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this StorageClass so that PVCs provisioned from it can later be resized by editing the PVC's requested storage:",
        yaml:
          "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: expandable\nprovisioner: ebs.csi.aws.com\nreclaimPolicy: Delete\n______: true",
        choices: ["allowVolumeExpansion", "resizePolicy", "volumeExpansion", "allowResize"],
        answer: 0,
        explanation:
          "`allowVolumeExpansion: true` on the StorageClass permits users to expand volumes by increasing `spec.resources.requests.storage` on the PVC. Shrinking is not supported.",
        docs: {
          label: "Kubernetes docs: Storage Classes — Allow volume expansion",
          url: "https://kubernetes.io/docs/concepts/storage/storage-classes/"
        }
      }
    ]
  },
  {
    id: "cka-workloads",
    title: "2. Workloads & Scheduling",
    weight: "15%",
    description:
      "Deployments, rolling updates and rollbacks, ConfigMaps and Secrets in workloads, resource requests/limits, autoscaling, node affinity, taints and tolerations.",
    questions: [
      {
        type: "mcq",
        prompt:
          "A bad image was rolled out with `kubectl set image deployment/web web=nginx:1.99`. Which command reverts the Deployment to the previous working revision?",
        choices: [
          "kubectl rollout undo deployment/web",
          "kubectl rollout restart deployment/web",
          "kubectl rollout resume deployment/web",
          "kubectl replace deployment/web --revision=1"
        ],
        answer: 0,
        explanation:
          "`kubectl rollout undo` rolls a Deployment back to the previous revision (or a specific one with `--to-revision`). `rollout restart` just re-creates pods with the same, still-broken spec.",
        docs: {
          label: "Kubernetes docs: Deployments — Rolling Back",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the Deployment strategy so pods are replaced gradually, with at most one extra pod created above the desired count during the update:",
        yaml:
          "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 4\n  strategy:\n    type: ______\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27",
        choices: ["RollingUpdate", "Recreate", "Rolling", "Canary"],
        answer: 0,
        explanation:
          "`strategy.type: RollingUpdate` replaces pods incrementally, honoring `maxSurge` and `maxUnavailable`. `Recreate` kills all old pods before starting new ones and ignores those fields.",
        docs: {
          label: "Kubernetes docs: Deployments — Strategy",
          url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You run `kubectl taint nodes gpu-node dedicated=ml:NoExecute`. What happens to pods already running on `gpu-node` that have no matching toleration?",
        choices: [
          "They keep running but no new pods are scheduled",
          "They are evicted from the node",
          "They are restarted in place with the taint applied",
          "Nothing until the kubelet is restarted"
        ],
        answer: 1,
        explanation:
          "The `NoExecute` effect evicts already-running pods that don't tolerate the taint, in addition to blocking new ones. `NoSchedule` would only prevent new pods from being scheduled.",
        docs: {
          label: "Kubernetes docs: Taints and Tolerations",
          url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the affinity field so this Pod can ONLY be scheduled on nodes labeled `disktype=ssd` (a hard requirement, not a preference):",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: cache\nspec:\n  affinity:\n    nodeAffinity:\n      ______:\n        nodeSelectorTerms:\n          - matchExpressions:\n              - key: disktype\n                operator: In\n                values: [\"ssd\"]\n  containers:\n    - name: cache\n      image: redis",
        choices: [
          "requiredDuringSchedulingIgnoredDuringExecution",
          "preferredDuringSchedulingIgnoredDuringExecution",
          "requiredDuringSchedulingRequiredDuringExecution",
          "nodeSelectorRequired"
        ],
        answer: 0,
        explanation:
          "`requiredDuringSchedulingIgnoredDuringExecution` is a hard rule the scheduler must satisfy; `preferred...` is only a weighted preference. The `RequiredDuringExecution` variant does not exist for node affinity.",
        docs: {
          label: "Kubernetes docs: Assigning Pods to Nodes",
          url: "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You created an HPA with `kubectl autoscale deployment web --cpu-percent=70 --min=2 --max=8`, but `kubectl get hpa` shows TARGETS as `<unknown>/70%`. What is the most likely cause?",
        choices: [
          "The metrics-server is not installed or not serving pod metrics",
          "The Deployment has more replicas than the HPA max",
          "HPAs only support memory metrics, not CPU",
          "The HPA needs a `scaleTargetRef` added manually"
        ],
        answer: 0,
        explanation:
          "The HPA reads CPU utilization from the Metrics API, provided by `metrics-server`. If it is missing (or the containers lack CPU requests), current utilization shows `<unknown>` and no scaling happens.",
        docs: {
          label: "Kubernetes docs: Horizontal Pod Autoscaling",
          url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A ConfigMap `app-config` has 20 keys and the whole set should be exposed to a container as environment variables without listing each key. Which pattern do you use?",
        choices: [
          "envFrom with a configMapRef to app-config",
          "env with one valueFrom.configMapKeyRef per key",
          "A volume mount with subPath for each key",
          "An annotation config.kubernetes.io/inject-env on the Pod"
        ],
        answer: 0,
        explanation:
          "`envFrom` with `configMapRef` imports every key of the ConfigMap as an environment variable in one stanza. `valueFrom.configMapKeyRef` pulls a single key at a time.",
        docs: {
          label: "Kubernetes docs: ConfigMaps",
          url: "https://kubernetes.io/docs/concepts/configuration/configmap/"
        }
      },
      {
        type: "tf",
        prompt:
          "Adding a toleration for a node's taint to a Pod guarantees that the Pod will be scheduled onto that tainted node.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "A toleration only allows the pod to land on the tainted node — it does not attract it there. To force placement you combine tolerations with `nodeSelector` or node affinity.",
        docs: {
          label: "Kubernetes docs: Taints and Tolerations",
          url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Fill in the field so the scheduler reserves 250m CPU and 128Mi memory for this container when choosing a node:",
        yaml:
          "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: myapp:2.1\n      resources:\n        ______:\n          cpu: \"250m\"\n          memory: \"128Mi\"\n        limits:\n          cpu: \"500m\"\n          memory: \"256Mi\"",
        choices: ["requests", "reservations", "minimum", "guaranteed"],
        answer: 0,
        explanation:
          "`resources.requests` is what the scheduler uses to find a node with enough allocatable capacity; `limits` caps what the container may consume at runtime.",
        docs: {
          label: "Kubernetes docs: Resource Management for Pods and Containers",
          url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/"
        }
      }
    ]
  },
  {
    id: "cka-networking",
    title: "3. Services & Networking",
    weight: "20%",
    description:
      "Pod connectivity, ClusterIP/NodePort/LoadBalancer Services, Ingress and Gateway API, CoreDNS, and CNI plugins.",
    questions: [
      {
        type: "mcq",
        prompt:
          "You expose a Deployment with a NodePort Service but do not specify the `nodePort` value. From which port range will Kubernetes allocate it by default?",
        choices: ["30000-32767", "1024-65535", "8000-9000", "32768-65535"],
        answer: 0,
        explanation:
          "NodePort Services allocate ports from the range configured by the API server's `--service-node-port-range` flag, which defaults to `30000-32767`.",
        docs: {
          label: "Kubernetes docs: Service — type NodePort",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this Ingress rule so that requests to /shop AND any subpath like /shop/cart are routed to the backend:",
        yaml:
          "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: shop-ingress\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /shop\n            pathType: ______\n            backend:\n              service:\n                name: shop\n                port:\n                  number: 80",
        choices: ["Prefix", "Exact", "ImplementationSpecific", "Regex"],
        answer: 0,
        explanation:
          "`pathType: Prefix` matches the path and everything under it split on `/`, so `/shop` and `/shop/cart` both match. `Exact` matches only the literal `/shop`, and `Regex` is not a valid pathType.",
        docs: {
          label: "Kubernetes docs: Ingress",
          url: "https://kubernetes.io/docs/concepts/services-networking/ingress/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A pod in namespace `frontend` needs to reach the Service `db` in namespace `backend` via DNS. Which name is guaranteed to resolve, regardless of the pod's namespace?",
        choices: [
          "db.backend.svc.cluster.local",
          "db.svc.backend.cluster.local",
          "backend.db.svc.cluster.local",
          "db.cluster.local"
        ],
        answer: 0,
        explanation:
          "CoreDNS creates A/AAAA records for Services as `<service>.<namespace>.svc.<cluster-domain>`, so the fully qualified name is `db.backend.svc.cluster.local`. The short name `db` only works from within the same namespace.",
        docs: {
          label: "Kubernetes docs: DNS for Services and Pods",
          url: "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/"
        }
      },
      {
        type: "mcq",
        prompt:
          "Which cluster component watches Services and EndpointSlices and programs iptables/IPVS rules on each node so traffic to a ClusterIP reaches a backend pod?",
        choices: ["kube-proxy", "CoreDNS", "kube-scheduler", "the CNI plugin"],
        answer: 0,
        explanation:
          "`kube-proxy` runs on every node and translates Service virtual IPs into rules (iptables or IPVS) that DNAT traffic to backend pod IPs. The CNI plugin handles pod networking itself, not Service VIPs.",
        docs: {
          label: "Kubernetes docs: Virtual IPs and Service Proxies",
          url: "https://kubernetes.io/docs/reference/networking/virtual-ips/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this Gateway so it is managed by the controller registered for the class named `nginx-gateway`:",
        yaml:
          "apiVersion: gateway.networking.k8s.io/v1\nkind: Gateway\nmetadata:\n  name: web-gateway\nspec:\n  ______: nginx-gateway\n  listeners:\n    - name: http\n      protocol: HTTP\n      port: 80",
        choices: ["gatewayClassName", "ingressClassName", "controllerName", "gatewayClass"],
        answer: 0,
        explanation:
          "A Gateway selects its implementation with `spec.gatewayClassName`, referencing a GatewayClass. `ingressClassName` is the analogous field on Ingress resources, and `controllerName` lives on the GatewayClass.",
        docs: {
          label: "Kubernetes docs: Gateway API",
          url: "https://kubernetes.io/docs/concepts/services-networking/gateway/"
        }
      },
      {
        type: "mcq",
        prompt:
          "On a managed cloud cluster, you need a Service that gets its own external IP address provisioned automatically by the cloud provider. Which Service type do you choose?",
        choices: ["LoadBalancer", "NodePort", "ClusterIP", "ExternalName"],
        answer: 0,
        explanation:
          "`type: LoadBalancer` asks the cloud controller manager to provision an external load balancer and populate `status.loadBalancer.ingress` with its IP/hostname. `ExternalName` merely returns a CNAME record.",
        docs: {
          label: "Kubernetes docs: Service — type LoadBalancer",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      },
      {
        type: "tf",
        prompt:
          "A Service of type ClusterIP is reachable from clients outside the cluster without any additional configuration.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "A ClusterIP is a virtual IP routable only inside the cluster. External access requires NodePort, LoadBalancer, an Ingress/Gateway, or `kubectl port-forward`.",
        docs: {
          label: "Kubernetes docs: Service",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      },
      {
        type: "yaml",
        prompt:
          "The container listens on 8080, but clients should connect to the Service on port 80. Fill in the missing field:",
        yaml:
          "apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n    - port: 80\n      ______: 8080\n      protocol: TCP",
        choices: ["targetPort", "containerPort", "nodePort", "backendPort"],
        answer: 0,
        explanation:
          "`port` is what the Service exposes; `targetPort` is the port on the backend pods the traffic is forwarded to. `containerPort` belongs in the Pod spec, not the Service.",
        docs: {
          label: "Kubernetes docs: Service — Defining a Service",
          url: "https://kubernetes.io/docs/concepts/services-networking/service/"
        }
      }
    ]
  },
  {
    id: "cka-troubleshooting",
    title: "4. Troubleshooting",
    weight: "30%",
    description:
      "Cluster and node troubleshooting, evaluating logs, monitoring applications, container stdout/stderr, application failures, control-plane component failures, and networking troubleshooting.",
    questions: [
      {
        type: "mcq",
        prompt:
          "A pod is in CrashLoopBackOff and `kubectl logs api-pod` returns nothing because the current container just restarted. Which command shows the output of the container instance that crashed?",
        choices: [
          "kubectl logs api-pod --previous",
          "kubectl logs api-pod --since=0s",
          "kubectl describe pod api-pod --logs",
          "kubectl get events api-pod -o logs"
        ],
        answer: 0,
        explanation:
          "`kubectl logs --previous` (or `-p`) retrieves the stdout/stderr of the last terminated container instance, which usually contains the crash reason. `describe` shows events and state, not container output.",
        docs: {
          label: "Kubernetes docs: Debug Running Pods",
          url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/"
        }
      },
      {
        type: "mcq",
        prompt:
          "`kubectl get nodes` shows worker-2 as NotReady. You SSH to the node. What is the most direct first check?",
        choices: [
          "systemctl status kubelet, then journalctl -u kubelet for errors",
          "kubectl delete node worker-2 and let it re-register",
          "iptables -L to inspect Service rules",
          "systemctl restart containerd on the control-plane node"
        ],
        answer: 0,
        explanation:
          "A NotReady node most often means the kubelet is down or unhealthy. Check its service state with `systemctl status kubelet` and read `journalctl -u kubelet` for the failure cause (cert issues, container runtime down, disk pressure, etc.).",
        docs: {
          label: "Kubernetes docs: Troubleshooting Clusters",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/"
        }
      },
      {
        type: "mcq",
        prompt:
          "On a kubeadm cluster, `kubectl` suddenly fails with 'connection refused' to port 6443. You suspect the kube-apiserver static pod is broken. Where do you find its manifest to inspect and fix it?",
        choices: [
          "/etc/kubernetes/manifests/kube-apiserver.yaml on the control-plane node",
          "/var/lib/kubelet/pods/kube-apiserver.yaml on the control-plane node",
          "kubectl -n kube-system edit pod kube-apiserver",
          "/etc/systemd/system/kube-apiserver.service"
        ],
        answer: 0,
        explanation:
          "kubeadm runs control-plane components as static pods whose manifests live in `/etc/kubernetes/manifests` (the kubelet's `staticPodPath`). Editing the file there makes the kubelet recreate the pod — you can't fix it via the API when the API server itself is down.",
        docs: {
          label: "Kubernetes docs: Create static Pods",
          url: "https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Pods report 'could not resolve host' for in-cluster Services. Complete the command to check whether the CoreDNS pods are running:",
        yaml:
          "# 1. Check the DNS pods\nkubectl get pods -n ______ -l k8s-app=kube-dns\n\n# 2. Then test resolution from a client pod\nkubectl run dnstest --rm -it --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default",
        choices: ["kube-system", "kube-dns", "coredns", "default"],
        answer: 0,
        explanation:
          "CoreDNS runs as a Deployment in the `kube-system` namespace, labeled `k8s-app=kube-dns` for historical compatibility. If those pods are down or crashing, cluster-wide name resolution fails.",
        docs: {
          label: "Kubernetes docs: Debugging DNS Resolution",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/"
        }
      },
      {
        type: "yaml",
        prompt:
          "The kubelet on worker-1 was found inactive. Complete the commands to start it and follow its logs to confirm it stays healthy:",
        yaml:
          "sudo systemctl start kubelet\nsudo systemctl enable kubelet\nsudo journalctl -u ______ -f",
        choices: ["kubelet", "kube-proxy", "containerd", "kubeadm"],
        answer: 0,
        explanation:
          "The kubelet runs as a systemd service on each node, so its logs are read with `journalctl -u kubelet`. Following with `-f` lets you confirm it registers the node and stops erroring.",
        docs: {
          label: "Kubernetes docs: Troubleshooting Clusters",
          url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A pod stays Pending and `kubectl describe pod` shows: '0/3 nodes are available: 3 Insufficient cpu.' What does this mean and what is a valid fix?",
        choices: [
          "The pod's CPU request exceeds the free allocatable CPU on every node; lower the request or add capacity",
          "The node CPUs are too slow; the pod needs faster hardware",
          "The CPU limit is missing; add a limit so the scheduler can place it",
          "kube-proxy is down on all nodes; restart it to free CPU"
        ],
        answer: 0,
        explanation:
          "The scheduler places pods based on `resources.requests` versus each node's allocatable capacity. If no node has enough unreserved CPU, the pod stays Pending — reduce the request, free capacity, or add nodes.",
        docs: {
          label: "Kubernetes docs: Debugging Pods",
          url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/"
        }
      },
      {
        type: "tf",
        prompt:
          "`kubectl logs` for a pod still works even when the kubelet on that pod's node is down, because logs are stored centrally on the control plane.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "The API server proxies `kubectl logs` requests to the kubelet on the pod's node, which reads the container log files locally. If that kubelet is unreachable, the request fails — Kubernetes has no built-in central log store.",
        docs: {
          label: "Kubernetes docs: Logging Architecture",
          url: "https://kubernetes.io/docs/concepts/cluster-administration/logging/"
        }
      },
      {
        type: "tf",
        prompt:
          "A pod status of ImagePullBackOff and a status of CrashLoopBackOff indicate the same underlying problem: the container image could not be downloaded.",
        choices: ["True", "False"],
        answer: 1,
        explanation:
          "`ImagePullBackOff` means the image pull failed (bad name/tag, missing registry credentials), so the container never started. `CrashLoopBackOff` means the image ran but the process keeps exiting — diagnose it with `kubectl logs --previous` and `describe`.",
        docs: {
          label: "Kubernetes docs: Debugging Pods",
          url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/"
        }
      }
    ]
  },
  {
    id: "cka-cluster",
    title: "5. Cluster Architecture, Installation & Configuration",
    weight: "25%",
    description:
      "RBAC, kubeadm cluster installation and lifecycle, upgrades, highly-available control planes, etcd backup and restore, Helm and Kustomize, CRDs and operators.",
    questions: [
      {
        type: "mcq",
        prompt:
          "Developer `jane` should be able to list and read pods only in the `dev` namespace, and nothing else. Which pair of RBAC objects is the correct, least-privilege choice?",
        choices: [
          "A Role in dev with get/list/watch on pods, plus a RoleBinding to jane",
          "A ClusterRole with get/list/watch on pods, plus a ClusterRoleBinding to jane",
          "A Role in dev with the wildcard verb *, plus a ClusterRoleBinding to jane",
          "A ServiceAccount in dev bound to the cluster-admin ClusterRole"
        ],
        answer: 0,
        explanation:
          "A `Role` is namespaced, so a Role in `dev` plus a `RoleBinding` grants access only there. A `ClusterRoleBinding` would grant the permissions in every namespace, which over-provisions.",
        docs: {
          label: "Kubernetes docs: Using RBAC Authorization",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete the command to take a backup of etcd on a kubeadm control-plane node:",
        yaml:
          "ETCDCTL_API=3 etcdctl snapshot ______ /backup/etcd-snapshot.db \\\n  --endpoints=https://127.0.0.1:2379 \\\n  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\\n  --cert=/etc/kubernetes/pki/etcd/server.crt \\\n  --key=/etc/kubernetes/pki/etcd/server.key",
        choices: ["save", "backup", "dump", "export"],
        answer: 0,
        explanation:
          "`etcdctl snapshot save <file>` writes a point-in-time backup of the etcd keyspace; you restore it later with `etcdutl snapshot restore` (formerly `etcdctl snapshot restore`). The TLS flags authenticate against the etcd serving certs under `/etc/kubernetes/pki/etcd`.",
        docs: {
          label: "Kubernetes docs: Operating etcd clusters — Backing up",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You are upgrading a kubeadm cluster from v1.32 to v1.33. On the FIRST control-plane node, what is the correct order of operations?",
        choices: [
          "Upgrade the kubeadm package, run kubeadm upgrade plan, then kubeadm upgrade apply v1.33.x, then drain the node and upgrade kubelet/kubectl",
          "Upgrade kubelet first, restart it, then run kubeadm upgrade apply",
          "Run kubeadm upgrade apply directly; it upgrades kubeadm, kubelet, and kubectl for you",
          "Delete the control-plane node and re-join it with a v1.33 kubeadm init"
        ],
        answer: 0,
        explanation:
          "The kubeadm flow is: upgrade the `kubeadm` binary, verify with `kubeadm upgrade plan`, apply with `kubeadm upgrade apply`, then drain the node and upgrade `kubelet` and `kubectl`. kubeadm never upgrades the kubelet package for you.",
        docs: {
          label: "Kubernetes docs: Upgrading kubeadm clusters",
          url: "https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this kustomization.yaml so that Kustomize includes both manifests when you run `kubectl apply -k .`:",
        yaml:
          "apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nnamespace: staging\ncommonLabels:\n  env: staging\n______:\n  - deployment.yaml\n  - service.yaml",
        choices: ["resources", "manifests", "files", "includes"],
        answer: 0,
        explanation:
          "The `resources` field lists the YAML files (or directories/bases) that Kustomize loads and transforms. `kubectl apply -k` then applies the rendered output with the namespace and labels added.",
        docs: {
          label: "Kubernetes docs: Declarative Management with Kustomize",
          url: "https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/"
        }
      },
      {
        type: "mcq",
        prompt:
          "You want to deploy a Helm chart so that it installs the release if it does not exist, or upgrades it in place if it does — ideal for CI pipelines. Which command does this?",
        choices: [
          "helm upgrade --install myapp ./chart -f values.yaml",
          "helm install --force myapp ./chart -f values.yaml",
          "helm apply myapp ./chart -f values.yaml",
          "helm rollout myapp ./chart -f values.yaml"
        ],
        answer: 0,
        explanation:
          "`helm upgrade --install` (often written `helm upgrade -i`) is idempotent: it installs the release when absent and upgrades it otherwise. `helm apply` and `helm rollout` are not real Helm commands.",
        docs: {
          label: "Helm docs: helm upgrade",
          url: "https://helm.sh/docs/helm/helm_upgrade/"
        }
      },
      {
        type: "mcq",
        prompt:
          "A monitoring agent needs read access to `nodes` and `persistentvolumes` across the whole cluster. Why can't a Role grant this?",
        choices: [
          "Roles are namespaced and cannot grant access to cluster-scoped resources; use a ClusterRole with a ClusterRoleBinding",
          "Roles cannot include the get and list verbs; only ClusterRoles can",
          "Roles only apply to ServiceAccounts, not monitoring agents",
          "Roles can grant it, but only when created in the kube-system namespace"
        ],
        answer: 0,
        explanation:
          "`nodes` and `persistentvolumes` are cluster-scoped resources, so permissions on them must come from a `ClusterRole` bound with a `ClusterRoleBinding`. A namespaced `Role` can only cover namespaced resources within its own namespace.",
        docs: {
          label: "Kubernetes docs: RBAC — Role and ClusterRole",
          url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/"
        }
      },
      {
        type: "tf",
        prompt:
          "When building a highly-available kubeadm cluster with multiple control-plane nodes, you should pass `--control-plane-endpoint` (pointing at a load balancer) to `kubeadm init` on the first node.",
        choices: ["True", "False"],
        answer: 0,
        explanation:
          "`--control-plane-endpoint` sets a shared address (typically a load balancer in front of all API servers) that goes into certificates and kubeconfigs, letting you add control-plane nodes later. Without it, converting a single control-plane cluster to HA is much harder.",
        docs: {
          label: "Kubernetes docs: Creating Highly Available Clusters with kubeadm",
          url: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/"
        }
      },
      {
        type: "yaml",
        prompt:
          "Complete this CustomResourceDefinition so that Database objects are created inside individual namespaces (not cluster-wide):",
        yaml:
          "apiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition\nmetadata:\n  name: databases.stable.example.com\nspec:\n  group: stable.example.com\n  ______: Namespaced\n  names:\n    plural: databases\n    singular: database\n    kind: Database\n  versions:\n    - name: v1\n      served: true\n      storage: true\n      schema:\n        openAPIV3Schema:\n          type: object",
        choices: ["scope", "level", "namespacing", "visibility"],
        answer: 0,
        explanation:
          "The CRD's `spec.scope` field is either `Namespaced` or `Cluster` and determines whether the custom resources live inside namespaces. Operators typically watch such namespaced custom resources and reconcile real workloads from them.",
        docs: {
          label: "Kubernetes docs: Extend the API with CustomResourceDefinitions",
          url: "https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/"
        }
      }
    ]
  }
];
