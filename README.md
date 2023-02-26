# Wk-name-search

The Wikimedia Name Search API is a RESTful API that leverages the MediaWiki API to produce short descriptions of individuals based on their English Wikipedia page content. The API takes the name of the person as input, queries the MediaWiki API using their name, and returns the short description found on their English Wikipedia page. The API is designed to be easy to use and can be integrated into various applications to provide a quick and concise summary of an individual's profession or occupation.



#### Installation Guide
This guide will walk you through the steps to install and run the application on your local machine.

There are three ways to install and run the project:

- Raw Node.js installation
- Docker container installation
- Helm chart installation


Choose the installation method that best fits your environment and requirements. The following sections provide detailed instructions for each method.

##### Raw Node.js installation
###### Requirements

Before installing the application, you will need to have the following installed on your machine:

- Node.js (version 14 or higher)
- npm (included with Node.js)

###### Installation Steps
1. Clone the repository to your local machine:
```shell
$ git clone https://github.com/alvinchirchir/wk-name-search.git
```
2. Navigate to the root directory of the project:
```shell
$ cd wk-name-search
```
3. Install the project dependencies using npm:
```shell
$ npm install
```
4. Create a .env file in the root directory of the project and set the following environment variables:
```shell
NODE_ENV=DEV
PORT=3000
WIKIPEDIA_API_URL=https://en.wikipedia.org/w/api.php
WIKIPEDIA_ACTION=query
WIKIPEDIA_PROP=revisions
WIKIPEDIA_RV_LIMIT=1
WIKIPEDIA_FORMAT=json
WIKIPEDIA_FORMAT_VERSION=2
WIKIPEDIA_RV_PROP=content
```
5. Start the server in development mode:
```shell
$ npm run start:dev
```
6. (Optional) To run the server in production mode, build the project using:
```shell
$ npm run build
```
Then start the server using:
```shell
$ npm run start:prod
```

7. The server should now be running at http://localhost:3000.

##### Docker container installation
To install and run the project using Docker container, follow these steps:

###### Requirements
To run this project, you will need:
- Docker

1. Clone the repository to your local machine:
```shell
$ git clone https://github.com/alvinchirchir/wk-name-search.git
```

2. Navigate to the root directory of the project:
```shell
$ cd wk-name-search
```

3. Then build the Docker image:
```shell
$ docker build -t wk-name-search .
```
4. Once the image is built, you can run the application in a Docker container:

```shell
$ docker run -p 3000:3000 wk-name-search
```
##### Helm Chart Installation

###### Requirements
- A Kubernetes cluster up and running, with kubectl configured and pointing to the cluster.
- Helm v3 preferably (v3.11.1) installed on your local machine.

To install and run the project using Helm chart, follow these steps:

1. Clone the repository to your local machine:
```shell
$ git clone https://github.com/alvinchirchir/wk-name-search.git
```
2. Navigate to the k8s directory of the project:

```shell
$ cd wk-name-search/k8s
```
3. Install chart:
```sh
helm install wk-name-search .
```
4. See installed components and fetch dynamic ports 

You can use `kubectl get services` to view all of the services. We will need to extract dynamic external ports assigned.

For example:
```console
$ kubectl get services

NAME                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes                          ClusterIP   10.96.0.1       <none>        443/TCP          11d
wk-name-search                      NodePort    10.98.97.140    <none>        3000:30560/TCP   11m
wk-name-search-grafana              NodePort    10.107.36.113   <none>        80:31763/TCP     11m
wk-name-search-kube-state-metrics   ClusterIP   10.106.86.49    <none>        8080/TCP         11m
wk-name-search-prometheus-server    ClusterIP   10.99.185.33    <none>        80/TCP           11m

```
5. The wk-name-search server should now be running at `http://localhost:<DYNAMIC_PORT>`. For example from the above we can access the server from `http://localhost:30560`
6. Additionally we can access grafana to visually see the metrics scrapped by prometheus. Follow the steps below to view analytics using grafana
- Access the grafana dashboard from `http://localhost:<DYNAMIC_PORT>`. For example from the above we can see that wk-name-search-grafana is running locally as `http://localhost:31763`
- Use admin as username. Password can be obtained by running the command
```console
$ kubectl get secret --namespace default wk-name-search-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```
- Once logged in we first need to add prometheus as a source provider. 
- Go to settings using the gear icon left corner in the sidebar. Select Add data source -> Search and choose Prometheus. We only need to change the url setting. Insert `http://wk-name-search-prometheus-server:80` and leave the rest as default. Proceed to select save and test. If configured correctly a green notification should appear in the top left.
- We then proceed to import a dashboard.Select dashboard icon from side menu. Select 'New' -> 'Import'. You should see import from grafana.com. Since we are using nodejs we will import a nodejs dashboard from  https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/ . Copy the ID from the link and Load into grafana. Proceed to select prometheus as data source. If all has been configured correctly you should be able to view metrics.

![alt text](https://firebasestorage.googleapis.com/v0/b/github-resources.appspot.com/o/Grafana%20Dashboard%2FScreenshot%202023-02-26%20at%2015.52.05.jpg?alt=media&token=dd9ddef9-c0d9-4ade-8fef-a7af97300136)



#### Usage
Once the application is running, you can access it by visiting http://localhost:3000 in your web browser.

#### API Documentation
This API is documented using Swagger. Swagger provides a user-friendly interface for exploring and testing the API endpoints.
To access the Swagger documentation:
1. Start the application.
2. Navigate to http://localhost:3000/api in your web browser.

The Swagger documentation includes:

- A list of all available endpoints
- Details about each endpoint, including its parameters, responses, and example requests and responses

#### Running Tests
The application has both unit tests and end-to-end (e2e) tests.

##### Unit Tests
To run the unit tests, use the following command:
```shell
$ npm run test:unit
```
##### End-to-End (E2E) Tests
To run the end-to-end tests, use the following command:
```shell
$ npm run test:e2e
```



## License

MIT
**Free Software!**
