# Development commands
All you need is ~~love~~ [Vagrant](https://www.vagrantup.com/downloads.html).

## Launch development server

```bash
vagrant up
vagrant ssh
npm start

# Do the dev stuff you want...
npm install --save a-cool-module
npm run gulp # cf infra
# ...
```

Visit [http://localhost:1515/stories/ball-pit-plus-mongooses-awesome](http://localhost:1515/stories/ball-pit-plus-mongooses-awesome)

## Destroy development environment

```bash
vagrant destroy
```

## Commands
All these commands are for development (there's no JS/CSS minification, for example).<br>For production, there is only `npm run gulp --production`, which bundles everything for production.

### Start server

```bash
npm start
```

### Lint (i.e. check syntax)

```bash
# JS
npm run gulp lint-js

# All
npm run gulp lint
```

### Build

```bash
# Client JS
npm run gulp build-client-js

# CSS
npm run gulp build-css

# Copy images from src to dist
npm run gulp copy-img

# All of above
npm run gulp build
```

### Lint + Build

```bash
npm run gulp
# or to do it automatically when files change :
npm run gulp watch
```
