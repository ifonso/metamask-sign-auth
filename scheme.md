[CLIENTE] (request.challenge)

[SERVIDOR]
1° generateChallenge:
[retorno]
[
  {
    type: "string",
    name: "banner",
    value: "unchainedDavid",
  },
  {
    type: "string",
    name: "challenge",
    value: "SeuJorgeMeno",
  },
] -> request.metaAuth.challenge

[CLIENTE]
repsonse -> Object.challenge

signature = await web3.currentProvider
.sendAsync(
  {
    'eth_signTypedData',
    [challenge, address],
    from: address
  }
).result

fetch(/auth) => [challenge[1].value, signature]

[SERVIDOR]
