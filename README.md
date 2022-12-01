# Remove Duplicates From Mock

The application aims to eliminate duplicates that may exist in objects and scenes.

Once the application is executed, a new file will be obtained with the name:

clean_application.json

## Getting Started:

### Prerequisites

- [Node.js](https://nodejs.org)

Clone this repo and cd into the root directory

```
cd remove-duplicates-from-mock-main
```

```
npm install
```

In the terminal, you can now remove duplicates from a json file, given a Knack application format.

Run the following to output the new file file:

```
node app.js mock_application.json
```

## Testing

In the root directory run

```
npm test
```

Tests consist of unit tests on the main functions from utils/index.js using the test_mock_application.json file for testing data.

## Built With

- [Node.js](https://nodejs.org)

- [Jest](https://facebook.github.io/jest/)

## Author

Luis Trueba 




