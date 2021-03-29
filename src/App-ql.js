import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listProducts } from './graphql/queries';
import { createProduct as createProductMutation, deleteProduct as deleteProductMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '',price: 0 }

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const apiData = await API.graphql({ query: listProducts });
    setProducts(apiData.data.listProducts.items);
    const apiData2 = await API.get('product', '/product');
    console.log({ apiData2 });
  }

  async function createProduct() {
    if (!formData.name || !formData.description || !formData.price) return;
    await API.graphql({ query: createProductMutation, variables: { input: formData } });
    setProducts([ ...products, formData ]);
    setFormData(initialFormState);
  }

  async function deleteProduct({ id }) {
    const newProductsArray = products.filter(product => product.id !== id);
    setProducts(newProductsArray);
    await API.graphql({ query: deleteProductMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Products App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Product name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Product description"
        value={formData.description}
      />
      <input
        onChange={e => setFormData({ ...formData, 'price': e.target.value})}
        placeholder="Product price"
        value={formData.price}
      />
      <button onClick={createProduct}>Create Product</button>
      <div style={{marginBottom: 30}}>
        {
          products.map(product => (
            <div key={product.id || product.name}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <button onClick={() => deleteProduct(product)}>Delete product</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);