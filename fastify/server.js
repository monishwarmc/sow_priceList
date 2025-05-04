
// server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import product from './product.js';  // Ensure proper extension here

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.get('/', async (request, reply) => {
  reply.send({ status: 'ok' });
});

// get all products
fastify.get('/products', async (request, reply) => {
  try{
    const Products = await product.findAll();
    reply.send(Products);
  }
  catch (error){
    console.error('Error fetching Products:', error);
  }
});


fastify.get('/products/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const Product = await product.findOne({
      where: { id: id },
    });

    if (Product) {
      reply.send(Product);
    } else {
      reply.status(404).send({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching Product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// add product
fastify.post('/products', async (request, reply) => {
  const { article_no, name, in_price, price, unit, in_stock, description } = request.body;
  try {
    const newProduct = await product.create({
      article_no,
      name,
      in_price,
      price,
      unit,
      in_stock,
      description,
    });
    reply.send(newProduct);
  } catch (error) {
    console.error('Error creating Product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// update product
fastify.put('/products/:id', async (request, reply) => {
  const { id } = request.params;
  const { article_no, name, in_price, price, unit, in_stock, description } = request.body;
  try {
    const [updatedRows] = await product.update({
      article_no,
      name,
      in_price,
      price,
      unit,
      in_stock,
      description,
    }, {
      where: { id: id }
    });

    if (updatedRows > 0) {
      const updatedProduct = await product.findByPk(id);
      reply.send(updatedProduct);
    } else {
      reply.status(404).send({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating Product:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});


// delete product
fastify.delete('/products/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const deletedRows = await product.destroy({
      where: { id: id },
    });
    if (deletedRows > 0) {
      reply.send({ message: 'Product deleted successfully' });
    } else {
      reply.status(404).send({ error: 'Product not found' });
    }
  }
  catch (error){
    console.error('Error deleting Product:', error);
  }
});

const PORT = process.env.PORT || 5000;

fastify.listen({ port: PORT, host: '0.0.0.0' }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});
