let address;

window.onload = () => {
  const btn = document.getElementById("login");

  if (!window.ethereum) {
    alert("Please install metamask.");
    btn.classList = "login-btn-deactive";
  } else {
    btn.addEventListener("click", metaLogin);
  }
};

async function metaLogin() {
  address = await ethereum.request({ method: "eth_requestAccounts" });

  let challenge;

  if (!address[0]) {
    alert("erro");
    return;
  }

  fetch("http://localhost:5500/auth", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ address: address[0] }),
  })
    .then((data) => data.json())
    // Assinar a challenge
    .then((data) => {
      challenge = data.challenge;
      return authChallenge(challenge);
    })
    // Verificar a assinatura
    .then((signature) => verify(challenge, signature))
    // Tratar o resultado
    .then((result) => result.json())
    .then((json) => console.log(json))
    // Tratar erros
    .catch((err) => console.log(err));
}

async function authChallenge(challenge) {
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [challenge, address[0]],
    from: address[0],
  });
  return signature;
}

async function verify(challenge, signature) {
  const result = await fetch("http://localhost:5500/auth", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ address: address[0], challenge, signature }),
  });
  return result;
}