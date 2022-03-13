# JS Farcaster API

### How to install this package

```bash
npm install farcaster_api_js
```

### How to use this package

```js
// First import the client and the types
import { Client, Profile, Cast } from "farcaster_api_js";

// Initialize the client using a web3js object or an URL to a HTTP Provider
const client = new Client("https://rinkeby.infura.io/v3/XXXXXXXXXXXX");

// Get profile info for a specific username, returns the "Profile" type
client.getProfile("markus").then(console.log)

// Get the Casts of a user, returns an array of the type "Cast"
client.getCasts("markus").then(console.log)
```

