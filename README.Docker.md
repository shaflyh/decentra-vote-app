### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:8080.

### Deploying your application to the cloud

Deploying to the Google Cloud Run:

```sh
docker build --platform=linux/amd64 -t decentra-vote-app .
docker tag decentra-vote-app gcr.io/decentra-vote/decentra-vote-app
docker push gcr.io/decentra-vote/decentra-vote-app
gcloud run deploy decentra-vote-app \
    --image gcr.io/decentra-vote/decentra-vote-app \
    --platform managed \
    --region asia-east1 \
    --allow-unauthenticated
```

# Deploy using Google Cloud Build
```sh
gcloud builds submit --config cloudbuild.yaml .
```

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)