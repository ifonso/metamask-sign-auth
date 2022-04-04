import { v4 } from "uuid";
import crypto from "crypto";
import NodeCach from "node-cache";
import ethUtil from "ethereumjs-util";
import sigUtil from "@metamask/eth-sig-util";

class AddressAuth {
  constructor() {
    this.cache = new NodeCach({
      stdTTL: 120,
    });

    this.secret = v4();
  }

  auth(address, challenge = null, signature = null) {
    // 1° verificar endereço
    if (!this.verifyAddress(address))
      return {
        name: "error",
        value: null,
        message: "invalid_address",
      };

    // 2° Verificar se tem assinatura
    if (!signature)
      return {
        challenge: this.generateChallenge(address),
      };

    // 3° Verificar a challenge
    if (this.verifySignature(challenge, signature)) {
      return {
        name: "approved",
        value: true,
        message: "auth_success",
      };
    } else {
      return {
        name: "approved",
        value: false,
        message: "auth_fail",
      };
    }
  }

  generateChallenge(address) {
    // const hash = crypto
    //   .createHmac("sha256", this.secret)
    //   .update(address + v4())
    //   .digest("hex");
    const hash = "SeuJorge";
    this.cache.set(address.toLowerCase(), hash);

    const challenge = {
      name: "challenge",
      value: hash,
    };

    return challenge;
  }

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

  verifyAddress(address) {
    return ethUtil.isValidAddress(address);
  }
}

export default AddressAuth;
