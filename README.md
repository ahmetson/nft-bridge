# NFT Bridge
A Trustless, decentralized NFT bridge between Ethereum and Smartchain.   
The trustless, decentralized nature of this bridge achieved through direct Smartcontract interaction on two different blockchains through Decentralized Oracles provided by [Chainlink](https://chain.link).

> This Documentation assumes that you are familiar with Professional Development tools, as it doesn't describe what they do or how to install them.

# How to use

1. Install [git](https://git-scm.com/), [Docker](https://www.docker.com/get-started), and [Docker Compose](https://docs.docker.com/compose/install/).

2. Clone repository
```
git clone https://github.com/ahmetson/nft-bridge
```

3. Create `website/.env` based on `website/.example.env`.
4. Create `smartcontract/.env` based on `smartcontract/.example.env`. The committed environment file uses Rinkeby testnet. Also, the example uses Alchemy's public Ethereum service node.
5. Create `oracle/postgres.env` based on `oracle/.example.postgres.env`.
6. Create `oracle/chainlink.env` based on `oracle/.example.chainlink.env`. The comitted environment file uses Rinkeby testnet. Adapt it accordingly.
7. Create `oracle\adapters\target-gas-price\.env` based on `oracle\adapters\target-gas-price\.example.env`.
8. Create `oracle\adapters\eth-wrapped-verifier\.env` based on `oracle\adapters\eth-wrapped-verifier\.example.env`.
9. Build and run with docker-compose

* Build with default values, which you can adapt if needed inside the `Dockerfile`
```
docker-compose up --d
```

* First build with your own build args and then run:

```
$ docker-compose build --build-arg API_USER_EMAIL=my@test.com

$ docker-compose up
```

4. Browse to `localhost:6688` and log in with your credentials.

Default credentials:
- username: `user@example.com`
- password: `PA@SSword1234!567`
- wallet password: `PA@SSword1234!567`

# Run with your own Ethereum local node

1. Add the following into `docker-compose.yaml`:

- Service:
```
ethereum:
    image: ethereum/client-go:v1.10.1
    ports:
      - 8546:8546
    command: --ropsten --syncmode light --ws --ipcdisable --ws.addr 0.0.0.0 --ws.origins="*" --datadir /geth
    volumes: 
      - geth:/geth
```

- Volume:
```
geth:
```

So the end result would be:
```
volumes: 
  geth:
  db-data:
  chainlink_data:
```

2. Change `ETH_URL` inside `chainlink.env` to:
```
ETH_URL=ws://ethereum:8546
```

3. Run again:

```
$ docker-compose up --build
```

# Disclaimer

This is a basic setup to quickly get you up and running with a Chainlink local node for development. Please acknolwedge that this setup does not take into account any node security nor high-availability (HA) settings, therefore cannot be used in production as is.

# Contributions

Feel free to open issues with questions or send in PRs in case you have an idea!

# Licence

MIT Licence
