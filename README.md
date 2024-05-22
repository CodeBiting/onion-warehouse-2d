# onion-warehouse-2d

Web service that renders a warehouse in a 2D map

The warehouse is specified as follows:

1. One organization
2. One or more warehouses that belongs to the organization
3. One or more shelfs in each warehouse
4. One or more docks in each warehouse
5. One or more locations in each shelf

Each element (shelfs, docks, locations) has a start point (x, y, z).
When the element is a location has a startpoint from the shlef startpoint and a subtype with the size (x, y, z).
The units are in millimeters.

The coordenates axis is:

```text
            y     z
          + |  + /
            |   / 
            |  /
            | /
- __________|/__________ x
           /|         +
          / |
         /  |
      - / - |    
```

The 2D coordenates axis is:

Nothe that the z axis becomes the y

```text
 y
|
|
|
|
|___________ x
```



## Development guidelines

### How to work with the project

Project hosted on GitHub, to collaborate work as follows:

- Fork the project on your GitHub
- Clone the code locally
- Create the config/config.js file with the service configuration:
- Create a branch, give it a good name, indicate the type of change (bug, fix, feat, doc) and explain what it is about. Ex: "bug: error when array is null"
- Make changes and save them locally, each change with its commit, also with a good name
- Go to the master branch and sync your master branch with that of the original repository
- Save your changes to your GitHub
- Create the pull request

### API versions

See <https://semver.org/>

Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards compatible manner
- PATCH version when you make backwards compatible bug fixes

### Test and linter

In order to ensure that before each commit all the tests are passed and that nothing is uploaded to github that does not work, a package is added that allows the tests to be run in the development environment with [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

That's why we add the packages:

- [ESLint](https://github.com/eslint/eslint)
- [pre-commitment](https://pre-commit.com/)

#### Eslint configuration

We need to configure es-lint to ensure that style is respected and there are no static errors in the code. By default we have chosen the [standard](https://standardjs.com/). Configurable rules can be found [here](https://eslint.org/docs/latest/rules/indent#switchcase) We make some CodeBiting specific modifications there.

1. We install and configure eslint with the command `npm init @eslint/config`.
   1. We choose To check syntax, find problems, and enforce code style
   2. What type of modules does your project use? CommonJS (requires/exports)
   3. Which framework does your project use? None of these
   4. Does your project use TypeScript? No
   5. Where does your code run? Node
   6. Use a popular style guide Standard: <https://github.com/standard/standard>
   7. What format do you want your config file to be in? JavaScript
   8. Which package manager do you want to use? npm
2. Let's verify that the .eslintrc.js file has been created
3. Add the following rules to the .eslintrc.js file in the rules section

```javascript
    // Use 4 space identification to get the code more compact
    // In switch-case ident case https://eslint.org/docs/latest/rules/indent#switchcase
    indent: ['error', 4, { SwitchCase: 1 }],
    // Use semicolons to make the code easier to read
    semi: ['error', 'always']
```

Let's test that it works by running the eslint from a file with the command `node ./node_modules/.bin/eslint yourfile.js`

#### Pre-commit configuration

Let's install the precommit package: `npm install pre-commit --save-dev` The pre-commit package runs the tests configured in package.json, so we need to add a section indicating the commands that will be executed:

```json
  "scripts": {
    "start": "node ./bin/www",
    "test": "node ./node_modules/mocha/bin/mocha",
    "test-apis": "node ./node_modules/mocha/bin/mocha ./test/api/",
    "test-routes": "node ./bin/www & P1=$! && sleep 2 && node ./node_modules/mocha/bin/mocha ./test/routes/v1/ && kill $P1",
    "test-eslint": "node ./node_modules/.bin/eslint app.js",
    "nodemon": "nodemon ./bin/www"
  },
  "pre-commit": [
    "test-apis",
    "test-routes",
    "test-eslint"
  ],
```

#### GitHub actions

So that when the project is uploaded the tests are passed again, inside hithub the action "Node.js" is added which creates the `.github/workflows/node.js.yml` file where we specify the tests to be they have to run

Now every time we commit, apart from running the tests via git pre-commit, the tests will be uploaded and run on github. This test execution will be done in triplicate, one for each version of Node.js specified in the workflow configuration file `.github/workflows/node.js.yml`.

See:

- [Understand github actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)
- [Action test a Node.js application](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)
- `npm ci` bypasses a package’s package.json to install modules from a package’s lockfile. This ensures reproducible builds—you are getting exactly what you expect on every install. [More info](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable)
To see the logs of this action, within the project, on the "Actions" tab, you can see the executions of the workflows and the reason for the error, if any.
