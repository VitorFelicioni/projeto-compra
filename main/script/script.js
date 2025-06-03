document.querySelectorAll('.caixa0').forEach(produto => {
  const addButton = produto.querySelector('button');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'button-wrapper';
  addButton.parentElement.appendChild(buttonWrapper);
  buttonWrapper.appendChild(addButton);

  addButton.addEventListener('click', function () {
    if (produto.querySelector('.quantity-controls')) return;

    addButton.style.display = 'none';

    const controls = document.createElement('div');
    controls.className = 'quantity-controls';

    const minus = document.createElement('button');
    minus.textContent = '−';

    const quantity = document.createElement('span');
    quantity.textContent = '1';

    const plus = document.createElement('button');
    plus.textContent = '+';

    controls.appendChild(minus);
    controls.appendChild(quantity);
    controls.appendChild(plus);
    buttonWrapper.appendChild(controls);

    let count = 1;

    plus.addEventListener('click', () => {
      count++;
      quantity.textContent = count;
    });

    minus.addEventListener('click', () => {
      count--;
      if (count <= 0) {
        controls.remove();
        addButton.style.display = 'block';
      } else {
        quantity.textContent = count;
      }
    });
  });
});