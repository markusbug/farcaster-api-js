import axios from "axios";
import Web3 from "web3";

class Profile {
    constructor(addressActivityUrl, avatarUrl, displayName, proofUrl, timestamp, version) {
        this.addressActivityUrl = addressActivityUrl;
        this.avatarUrl = avatarUrl;
        this.displayName = displayName;
        this.proofUrl = proofUrl;
        this.timestamp = timestamp;
        this.version = version;
    }
}

class Cast {
    constructor(proof, signature, text) {
        this.proof = proof;
        this.signature = signature;
        this.text = text;
    }
}

class Client {
    constructor(provider) {
        if (typeof(provider) === 'string') {
            this.web3 = new Web3(provider);
        } else {
            this.web3 = provider;
        }
        this.farcasterAddress = "0xe3Be01D99bAa8dB9905b33a3cA391238234B79D1";
        this.farcasterABI = '[{"name":"getDirectoryUrl","inputs":[{"internalType":"bytes32","name":"username","type":"bytes32"}],"outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressToUsername","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]';
        this.farcasterContract = new this.web3.eth.Contract(JSON.parse(this.farcasterABI), this.farcasterAddress);
    }

    async getHostAddress(username) {
        const encodedName = this.web3.utils.utf8ToHex(username);
        const response = await this.farcasterContract.methods.getDirectoryUrl(encodedName).call();
        return response;
    }

    async getProfile(username) {
        const hostAddress = await this.getHostAddress(username);
        const response = await axios.get(hostAddress);
        return new Profile(response.data.body.addressActivityUrl, response.data.body.avatarUrl, response.data.body.displayName, response.data.body.proofUrl, response.data.body.timestamp, response.data.body.version);
    }

    async getCasts(username) {
        const userData = await this.getProfile(username);
        const response = await axios.get(userData.addressActivityUrl);
        const casts = response.data.map(cast => new Cast(cast.merkleRoot, cast.signature, cast.body.data.text));
        return casts;
    }
}

export { Profile, Cast, Client };