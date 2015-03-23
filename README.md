Siz Web App
===========

**All these commands run in `development` mode by default.**

**Set `NODE_ENV` environment variable to `production` for production mode.**

### Launch server
```
node server.js
open https://localhost/stories/ball-pit-plus-mongooses-awesome
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
```
npm run gulp
```

TODO
====

- Update Dockerfile
- Update Vagrantfile
- Delete `provisioning` folder ?
