## react-superforms
Supercharged forms API and components for React


- [react-superforms](#react-superforms)
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
  - [Through yarn](#through-yarn)
  - [Through NPM](#through-npm)
- [Get started](#get-started)
  - [1. Setup](#1-setup)
- [Development & test](#development--test)
- [Licence](#licence)

## Demo

– Gif

## Features
– Works out of the box
– Zero-config
– Controlled & uncontolled
– Works with JSON-schema, custom state, supermodel
– 

## Installation

### Through yarn
```
yarn add react-superforms
```

### Through NPM
```
npm install react-superforms --save
```

## Get started

### 1. Setup

```javascript
import Form from 'react-superforms'
export default () => 
  <Form
    defaultValue={{
      username: '',
      email: ''
    }}
  />
```


## Development & test

```
git clone https://github.com/ekorzun/react-superforms.git
cd react-superforms
yarn install
yarn test
```

## Licence 
MIT.

