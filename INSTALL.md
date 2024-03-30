# Installation instructions

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (>= 12.0.0)
- Yarn

## Installation steps

### Step 1: Clone the project

You need to clone the project using git

```
git clone https://github.com/jvdprates/pfc-hdl-flow.git
```

### Step 2: Go to the project's directory

Once the project is cloned, go to the new directory

```
cd pfc-hdl-flow
```

### Step 3: Install project dependencies

Use yarn to install project dependencies

```
yarn install
```

This command will install all the necessary dependencies defined in **package.json**

### Step 4: Build for production

Once you are done with development, you can build your project for production using:

```
yarn build
```

This command will generate an optimized build of your project in the **dist** directory.

## Additional Commands

- yarn dev: Use this to run the project in development mode.
- yarn lint: Lint your code.

## Relevant documentations

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev)
- [Yarn Documentation](https://classic.yarnpkg.com/en/docs/getting-started)
