const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';

(async () => {
  const abi = await fetch('abi.json').then(res => res.json());

  if (!window.ethereum) {
    alert('Instala MetaMask para usar esta DApp');
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  async function loadProposals() {
    const count = await contract.proposalCount();
    const container = document.getElementById('proposalCards');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
      const p = await contract.proposals(i);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>#${i}</h3>
        <p>${p.description}</p>
        <p><strong>Votos:</strong> ${p.voteCount}</p>
        <button onclick="vote(${i})">Votar</button>
      `;
      container.appendChild(card);
    }
  }

  document.getElementById('newProposalBtn').onclick = async () => {
    const desc = prompt('Ingresa la descripción de tu propuesta:');
    if (!desc) return;
    await contract.createProposal(desc);
    await loadProposals();
  };

  window.vote = async (id) => {
    await contract.vote(id);
    await loadProposals();
  };

  await loadProposals();
})();