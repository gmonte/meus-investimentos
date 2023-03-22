# React web basic

Project created with [Vite](https://vitejs.dev/)

## Getting started

```sh
$ git clone https://gitlab.meta.com.br/meta/smart/react/react-web/react-web-basic.git
$ cd react-web-basic
$ yarn
```

## Scripts:

```sh
$ yarn dev # run development server

$ yarn build # create dist directory with bundle

$ yarn test # run all tests in watch mode
$ yarn test run # run all tests one time

$ yarn lint # run eslint to check code

$ yarn release # upgrade project version and create changelog file

$ cd scripts && ./deploy.development # build development mode and provide it with nginx http://localhost:3000
$ cd scripts && ./deploy.staging # build staging mode and provide it with nginx http://localhost:3030
$ cd scripts && ./deploy.production # build production mode and provide it with nginx http://localhost:80
```
