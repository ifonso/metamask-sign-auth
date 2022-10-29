import { v4 } from "uuid";
import crypto from "crypto";
import NodeCache from "node-cache";
import ethUtil from "ethereumjs-util";
import sigUtil from "@metamask/eth-sig-util";

class AddressAuth {
  constructor() {
    this.cache = new NodeCache();
    this.secret = v4();
  }

  auth(address, challenge = null, signature = null) {
    // Verificar endereço
    if (!this.verifyAddress(address))
      return {
        name: "error",
        value: null,
        message: "invalid_address",
      };

    // Verificar se tem assinatura
    if (!signature)
      return {
        name: "approved",
        value: true,
        message: "auth_challenge",
        challenge: this.generateChallenge(address),
      };

    // Verificar a challenge
    if (this.verifySignature(challenge, signature)) {
      return {
        name: "approved",
        value: true,
        message: "auth_success",
      };
    } 
   
    return {
      name: "error",
      value: false,
      message: "auth_fail",
    }; 
  }

  // (address) -> returns a hash
  generateChallenge(address) {
    const hash = crypto
      .createHmac("sha256", this.secret)
      .update(address + v4())
      .digest("hex");

    this.cache.set(hash, address.toLowerCase(), 120);

    return hash;
  }

  // (hash, signature) -> Returns a bool
  verifySignature(challenge, signature) {
    const recovered = sigUtil.recoverPersonalSignature({
      data: challenge,
      signature,
    });

    const cacheChallenge = this.cache.get(recovered.toLowerCase());

    console.log(
      `\n[Process]\ncache: ${cacheChallenge}\nrecovered: ${recovered}\n`
    );

    if (cacheChallenge === challenge) {
      this.cache.del(recovered);
      return true;
    }

    return false;
  }

  // (address) -> Rturns a bool
  verifyAddress(address) {
    return ethUtil.isValidAddress(address);
  }
}

export default AddressAuth;