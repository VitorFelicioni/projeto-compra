document.querySelectorAll('.caixa0').forEach(produto => { //  executa na hora que abre a tela

  // produto representa cada caixa da tela
  debugger;
  const addButton = produto.querySelector('button'); // botão de cada um dos produtos

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'button-wrapper';             
  addButton.parentElement.appendChild(buttonWrapper);
  buttonWrapper.appendChild(addButton); // cria a div(buttonwrapper) pra posicionar os botoes. Coloca a div no lugar do botao original e coloca add to cart dentro dessa div

  addButton.addEventListener('click', function () {  //  evento de clique
    if (produto.querySelector('.quantidade-controls')) return;  // evita duplicar

    addButton.style.display = 'none';   // esconde botao add cart

    const controls = document.createElement('div');
    controls.className = 'quantidade-controls';

    const minus = document.createElement('button');
    minus.textContent = '−';

    const quantity = document.createElement('span');
    quantity.textContent = '1';

    const plus = document.createElement('button');
    plus.textContent = '+';

    controls.appendChild(minus);    
    controls.appendChild(quantity);    // adciona os botoes - # + na div controls
    controls.appendChild(plus);
    buttonWrapper.appendChild(controls);   // adiciona controls em buttonwrapper
    
    let count = 1;

    plus.addEventListener('click', () => {
      count++;
      quantity.textContent = count;
    });

    minus.addEventListener('click', () => {
      count--;
      if (count <= 0) {
        controls.remove();
        addButton.style.display = 'block';  // se a contagem chegar em 0 volta o botao Add cart
      } else {
        quantity.textContent = count;
      }
    });
  });
});