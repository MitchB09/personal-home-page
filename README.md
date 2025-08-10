# Personal Home Page (PHP)
https://home.bilensky.ca

Personal home page and testing ground for vite apps


## Running UI

To build and run the ui for the first time, execute the following scripts. On subsequent runs, only running `npm start` in the `ui` folder is required

```bash
cd ui
npm install
npm start
```

## Deploying application
### Deploying Dev

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

Deploying to dev environment

```bash
sam deploy --config-file samconfig.toml
```

```bash
sam deploy --config-file samconfig.toml --config-env prod
```


