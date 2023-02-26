# Wk-name-search

The Wikimedia Name Search API is a RESTful API that leverages the MediaWiki API to produce short descriptions of individuals based on their English Wikipedia page content. The API takes the name of the person as input, queries the MediaWiki API using their name, and returns the short description found on their English Wikipedia page. The API is designed to be easy to use and can be integrated into various applications to provide a quick and concise summary of an individual's profession or occupation.


#### Installation Guide
This guide will walk you through the steps to install and run the application on your local machine.

There are three ways to install and run the project:

- Raw Node.js installation
- Docker container installation
- Helm chart installation with Scaler,Grafana,Prometheus


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

###### API Documentation
This API is documented using Swagger. Swagger provides a user-friendly interface for exploring and testing the API endpoints.
To access the Swagger documentation:
1. Start the application.
2. Navigate to http://localhost:3000/api in your web browser.

The Swagger documentation includes:
- A list of all available endpoints
- Details about each endpoint, including its parameters, responses, and example requests and responses

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
5. The server should now be running at http://localhost:3000.

###### API Documentation
This API is documented using Swagger. Swagger provides a user-friendly interface for exploring and testing the API endpoints.
To access the Swagger documentation:
1. Start the application.
2. Navigate to http://localhost:3000/api in your web browser.

The Swagger documentation includes:
- A list of all available endpoints
- Details about each endpoint, including its parameters, responses, and example requests and responses

##### Helm Chart Installation
When installing the application using Helm, an autoscaler is included by default. This means that if the CPU process usage exceeds 50% for a single instance, the autoscaler will automatically deploy multiple replicas of the instance, with the minimum number of replicas set to 1 and the maximum number set to 5. This ensures that the application can handle increased traffic and load without downtime or performance issues. Here's how to install the application using Helm. Ensure you checkout the load test section to see how to increase CPU usage.

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
<<<<<<< HEAD
6. Additionally we can access grafana to visually see the metrics scrapped by prometheus. Follow the steps below to view analytics.

###### Accessing Grafana
1. Access the Grafana dashboard by entering the URL http://localhost:<DYNAMIC_PORT> in your web browser. For example, if the Grafana service is running locally on port 31763, the URL would be http://localhost:31763.

2. Use "admin" as the username to log in to Grafana.

3. Obtain the password by running the following command in your terminal:

=======
6. Additionally we can access grafana to visually see the metrics scrapped by prometheus. Follow the steps below to view analytics using grafana
- Access the grafana dashboard from `http://localhost:<DYNAMIC_PORT>`. For example from the above we can see that wk-name-search-grafana is running locally as `http://localhost:31763`
- Use admin as username. Password can be obtained by running the command
>>>>>>> 157511454d1808e7ecb329a605499bade9924272
```console
$ kubectl get secret --namespace default wk-name-search-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```
This will output the admin password which you can use to log in to Grafana.

4. Once you have logged in to Grafana, click on the gear icon in the left corner of the sidebar to access the settings page.
5. Click on "Add data source" and select "Prometheus" from the list of available data sources.
6. In the "HTTP" section of the settings page, change the URL to `http://wk-name-search-prometheus-server:80`. Leave all other settings at their default values.
7. Click "Save & Test". If everything has been configured correctly, a green notification should appear in the top left of the screen.
8. To import a dashboard, click on the dashboard icon in the sidebar and select "New" -> "Import".
9. Select "Import from grafana.com" and enter the ID of the Node.js dashboard you want to import, which can be found at https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/.
10. Select "Load" and choose "Prometheus" as the data source.
11. If everything has been configured correctly, you should now be able to view metrics in the Node.js dashboard.

![alt text](https://firebasestorage.googleapis.com/v0/b/github-resources.appspot.com/o/Grafana%20Dashboard%2FScreenshot%202023-02-26%20at%2015.52.05.jpg?alt=media&token=dd9ddef9-c0d9-4ade-8fef-a7af97300136)

###### API Documentation
This API is documented using Swagger. Swagger provides a user-friendly interface for exploring and testing the API endpoints.
To access the Swagger documentation:
- Navigate to http://localhost:<DYNAMIC_PORT>/api in your web browser. Make sure you insert appropriate port for wk-name-search server.

The Swagger documentation includes:
- A list of all available endpoints
- Details about each endpoint, including its parameters, responses, and example requests and responses

#### Load Tests
When helm is used for installation we can run various load tests on our system. A dynamic script has been  used to test server for availability and reliability. 



You will first have to install artillery on your system in order to run tests to check for horizontal scaling.

Install Artillery
```console
$ npm install -g artillery
```

Open the script and configure dynamic port assigned by Kubernetes to point to wk-name-search server PORT.
```console
$ nano ./k8s/load-tester/artillery-config.yaml
```
Run script
```console
$ artillery run ./k8s/load-tester/artillery-config.yaml
```
Check scaling using kubectl command
```console
$ kubectl get hpa
$ kubectl get hpa --watch
```
If you get an error you will have to check if scaler was installed
```console
$ kubectl get scaledobject
$ kubectl describe scaledobject <name>
```
If you don't get any scaler you will have to update chart dependencies by running the command below to reinstall scaler. Ensure you update <DYNAMIC_PORT> fields as they will get updated as well.

```console
$ helm update wk-name-search ./k8s  
```


#### Unit and E2E tests
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
