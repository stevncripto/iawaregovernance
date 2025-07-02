const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Reemplaza por tu dirección real si cambió

(async () => {
  const abi = await fetch("abi.json").then(res => res.json());
  const discordWebhookURL = "https://discord.com/api/webhooks/1390061176007954482/-fNlEcLk63RHIcL2_qVjK7bUOO7YvCEQx2cVZ0T_k3X5P7Iv_c2CrOoaTTVjC3UpSuqL";

  async function sendDiscordNotification(description) {
    await fetch(discordWebhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🧠 Nueva propuesta en IAware:\n**${description}**\n🔗 [Vótala aquí](https://stevncripto.github.io/iawaregovernance/)`,
        username: "IAware DAO Bot",
        avatar_url: "https://stevncripto.github.io/iawaregovernance/iaware-logo.png"
      })
    });
  }

  if (!window.ethereum) {
    alert("Instala MetaMask para usar esta DApp");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  async function loadProposals() {
    const count = await contract.proposalCount();
    const container = document.getElementById("proposalCards");
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const p = await contract.proposals(i);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>#${i}</h3>
        <p>${p.description}</p>
        <p><strong>Votos:</strong> ${p.voteCount}</p>
        <button onclick="vote(${i})">Votar</button>
      `;
      container.appendChild(card);
    }
  }

  document.getElementById("newProposalBtn").onclick = async () => {
    const desc = prompt("Ingresa la descripción de tu propuesta:");
    if (!desc) return;
    await contract.createProposal(desc);
    await sendDiscordNotification(desc);
    await loadProposals();
  };

  window.vote = async (id) => {
    await contract.vote(id);
    await loadProposals();
  };

  await loadProposals();
})();
