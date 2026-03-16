(function () {
  const variantInputs = document.querySelectorAll('.variant-input');
  const priceElement = document.querySelector('.price-main');
  const addToCartBtn = document.getElementById('AddToCart-Button'); 
  const variantIdInput = document.getElementById('product-variant-id');

  let productVariants = [];
  let variantId = null;

  
  async function initProduct() {
    try {
      const response = await fetch(`${window.location.pathname}.js`);
      const product = await response.json();
      productVariants = product.variants;
      
      variantId = variantIdInput ? variantIdInput.value : productVariants[0]?.id;
    } catch (error) {
      console.error("Erro ao carregar dados do produto:", error);
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  }

  function findVariant(selectedOptions) {
    
    return productVariants.find(variant =>
      JSON.stringify(variant.options) === JSON.stringify(selectedOptions)
    );
  }

  function updatePrice(price) {
    if (priceElement) {
      priceElement.innerText = formatPrice(price);
    }
  }

  function updateVariantInfo() {
    const selectedOptions = Array.from(document.querySelectorAll('.variant-input:checked')).map(i => i.value);
    const variant = findVariant(selectedOptions);

    if (!variant) return;

    variantId = variant.id;
    if (variantIdInput) variantIdInput.value = variantId;

    updatePrice(variant.price);
    
    const compareElem = document.querySelector('.price-compare');
    if (compareElem) {
      compareElem.innerText = variant.compare_at_price > variant.price ? formatPrice(variant.compare_at_price) : '';
    }
  }

  async function addToCart() {
    const payload = {
      id: variantId,
      quantity: 1
    };

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Erro ao adicionar produto');

      const result = await response.json();
      alert(`Produto adicionado: ${result.product_title}`);

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Houve um problema ao adicionar ao carrinho.');
    }
  }

  initProduct();

  variantInputs.forEach(input => {
    input.addEventListener('change', updateVariantInfo);
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart);
  }

})();