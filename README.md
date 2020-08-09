# testIstio
A test MERN stack application for understanding features of Istio service Mesh for kubernetes in action.

ToDo:
include mongodb with persistent volumes and claims.
## Setup Kubernetes cluster
### GKE 
**Using gcloud command line tool**(local shell)

Install the Kubernetes command-line tool kubectl using gcloud 
```sh
$ gcloud components install kubectl
```
Nodes with more than 1CPU is recommended for default installation of istio. For demo configuration profile,  Machine type n1-standard-1 should be enough.
```sh
$ export PROJECT_ID=`gcloud config get-value project`
$ export M_TYPE=n1-standard-1
$ export ZONE=<your_cluster_zone>
$ export CLUSTER_NAME=<your_cluster_name>
$ gcloud services enable container.googleapis.com
$ gcloud container clusters create $CLUSTER_NAME \
  --cluster-version latest \
  --machine-type=$M_TYPE \
  --num-nodes 2 \
  --zone $ZONE \
  --project $PROJECT_ID
```
Make sure your cluster is up and in RUNNING state using:
```sh
$ gcloud compute instances list
```
To be able to create necessary RBAC rules for Istio, you must have admin permission.

```sh
$ kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)
```

### Install Istio
```sh
$ curl -L https://istio.io/downloadIstio | sh -
$ cd istio-1.6.7
$ export PATH=$PWD/bin:$PATH
$ istioctl install --set profile=demo
```
Make sure all pods in istio-system namespace are up and in RUNNING state
```sh 
$ kubectl get pods -n istio-system
```
**To view the external IP of istio-ingressgateway**
```sh
$ kubectl get svc istio-ingressgateway -n istio-system
```

## Build images

### Backend
```sh
$ docker build -t <name>:<tag> ./backend/v1/
$ docker build -t <name>:<tag> ./backend/v2/
$ docker build -t <name>:<tag> ./backend/stress/
```
### Frontend

**IMPORTANT: We are using google oauth2.0 for Istio Request Authentication(end user authentication). Make sure to replace the clientID in ./frontend/v1/src/components/glogin.js with yours before you build the image**

To obtain the clientID follow these steps

1. Go to https://console.developers.google.com/apis/credentials
2. Make sure your **project ID** is selected
3. Press on **Create Credentials-->OAuth CLientID**
4. Give **Application Type** as  **Web Application**
5. **Name: <any-name>**
6. Under **Authorised JavaScript origins** press **Add URI** and 
add "**http://<external_IP_address_of_the_istio-ingressgateway>.xpr.io**"
We are using **".xpr.io"** as only a valid domain name is accepted here and not IP addresses.
Adding ".xpr.io" to the IP address is a simple workaround 
7. Under **Authorised redirect URIs** add "**http://<external_IP_address_of_the_istio-ingressgateway>.xpr.io/**"
8. Press on "Create" to get ClientID 
```sh
$ docker build -t <name>:<tag> ./frontend/v1/
```
**Make sure to change the image names in the respective deployment.yaml files**
## kubectl away
### Backend

```sh
$ kubectl create namespace bar
$ kubectl create -f backend-deployment.yaml
$ kubectl create -f ./backend/stress-deployment.yaml
$ kubectl create -f backend-sa-role.yaml
$ kubectl create -f backend-sa-rolebinding.yaml
```
**Create virtual services and Destination rules**
```sh
$ kubectl create -f backend-vs2.yaml
$ kubectl create -f backend-dr.yaml
$ kubectl create -f ./backend/stress-vs.yaml
$ kubectl create -f ./backend/stress-dr.yaml
```
**backend-vs2.yaml is a temporary workaround for sticky sessions (consistenthash) to work with canary deployments**

### Frontend
```sh
$ kubectl create namespace foo
$ kubectl create -f frontend-deployment.yaml
$ kubectl create -f frontend-sa-role.yaml
$ kubectl create -f frontend-sa-rolebinding.yaml
```
**Create virtual services and Destination rules**
```sh
$ kubectl create -f frontend-vs.yaml
$ kubectl create -f frontend-dr.yaml
```
**Expose frontend using gateway**
```sh
$ kubectl create -f gateway.yaml
```
___
#### Enable Istio Request Authentication (end user authentication)
```sh
$ kubectl create -f requestAuthn.yaml
```
#### Enable Istio Authorization Policy (end user authentication)
Policy defines to deny all requests to path "/info" and "/stress" that are not authenticated, i.e requests made without logging in with google(in our case)
```sh
$ kubectl create -f authz.yaml
```
#### Enable Istio Peer Authentication (service-service authentication)
Policy defines port level(8001 here) peer authentications policy. Rejects requests from pods without envoy proxy sidecar (injected by istio)
```sh
$ kubectl create -f peerAuthn.yaml
```
