const fs = require('fs');

class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
        ...product,
        id: products.length + 1 
        };
    products.push(newProduct);
    await this.writeProducts(products);
    return newProduct;
    }


    async getProducts() {
        try {
        const productsData = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(productsData);
        return products;
        } catch (error) {
        console.log(`Error al leer el archivo: ${error}`);
        return [];
        }
    }


    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(product => product.id === id);
        return product;
    }


    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
        products[index] = {
        ...updatedProduct,
        id
        };
        await this.writeProducts(products);
        return products[index];
        } else {
        return null;
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
        products.splice(index, 1);
        await this.writeProducts(products);
        return true;
        } else {
        return false;
        }
    }

    async writeProducts(products) {
        try {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
        console.log(`Error al escribir en el archivo: ${error}`);
        }
    }
}



const productManager = new ProductManager('products.json');
(async () => {
    const product1 = await productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción para el producto 1',
    price: 10.99,
    thumbnail: 'https://ejemplo.com/producto1.jpg',
    code: 'ABC123',
    stock: 5
    });

console.log(product1);
    const products = await productManager.getProducts();
console.log(products);
    const product2 = await productManager.getProductById(2);
console.log(product2);
    const updatedProduct = await productManager.updateProduct(3, {
    title: 'Nuevo título',
    description: 'Nueva descripción',
    price: 20.99,
    thumbnail: 'https://ejemplo.com/producto3-nuevo.jpg',
    code: 'DEF456',
    stock: 10
    });
    console.log(updatedProduct);
    const deleted = await productManager.deleteProduct(1);
    console.log(deleted);
})();




