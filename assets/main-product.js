(function () {

  const sizeInputs = document.querySelectorAll('.variant-input'); 
  const priceElement = document.querySelector('.price-main');
  const addToCartBtn = document.getElementById('AddToCart-Button');
  const productImage = document.getElementById('MainProductImage');

  
  const variants = window.productVariants || [];
  let variantId = variants[0]?.id;

  function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  }

  function findVariant(size) {
    return variants.find(variant =>
      variant.options.includes(size)
    );
  }

  function updatePrice(price) {
    if (priceElement) {
      priceElement.innerText = formatPrice(price);
    }
  }

  function updateImage(image) {
    if (image && productImage) {
      productImage.src = image.src;
    }
  }

  function updateVariantInfo() {
    const checkedInput = document.querySelector('.variant-input:checked');
    if (!checkedInput) return;

    const selectedSize = checkedInput.value;
    const variant = findVariant(selectedSize);

    if (!variant) return;

    variantId = variant.id;
    updatePrice(variant.price);
    
    if (variant.featured_image) {
      updateImage(variant.featured_image);
    }
  }

  async function addToCart() {
    
    console.log('--- TENTANDO ADICIONAR ID:', variantId, '---');

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

      
      console.log('OBJETO COMPLETO:', result);

      alert(`Produto adicionado: ${result.product_title}`);

    } catch (error) {
      console.error('ERRO:', error);
      alert('Houve um problema ao adicionar ao carrinho.');
    }
  }

  sizeInputs.forEach(input => {
    input.addEventListener('change', updateVariantInfo);
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart);
  }
})();