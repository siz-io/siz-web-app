Siz Web App
===========

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

All these commands run in `development` mode by default.
Set `NODE_ENV` environment variable to `production` for production mode.

### Start server
```bash
npm start
```

### Lint (check syntax)
```bash
# JS
npm run gulp lint-js

# All
npm run gulp lint
```

### Build
```bash
# Client js
npm run gulp build-client-js

# All
npm run gulp build
```

### Lint + Build
```bash
npm run gulp
```
