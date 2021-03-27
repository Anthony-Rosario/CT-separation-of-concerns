const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const twilio = require('../lib/utils/twilio');
jest.mock('../lib/utils/twilio.js')


jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('Place order routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    twilio.sendSms.mockClear();
  });

  it('creates a new order in our database', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
      
    expect(res.body).toEqual({
        id: '2',
        quantity: 10,
      });
  });

  it('sends a text message for new order placed', async () => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })

      expect(twilio.sendSms).toHaveBeenCalledTimes(1)
  });

  it('gets all orders from our database', async () => {
    const res = await request(app)
      .get('/api/v1/orders');

    expect(res.body).toEqual([{
      id: '1',
      quantity: 10,
    }]);
  });

  it('gets one order by its id', async () => {
    const res = await request(app)
      .get('/api/v1/orders/1')
      
    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('edits an entire order', async () => {
    const res = await request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 2 })

    expect(res.body).toEqual({
      id: '1',
      quantity: 2,
    });
  });

  it('sends a text message that the order was successfully updated', async() => {
    await request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 2 })

    expect(twilio.sendSms).toHaveBeenCalledTimes(1);
  });

  it('deletes a single item form the order', async () => {
    const res = await request(app)
      .delete('/api/v1/orders/1');

    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('sends a text that notifies you about deleting an item', async () => {
    await request(app)
      .delete('/api/v1/orders/1');

      expect(twilio.sendSms).toHaveBeenCalledTimes(1);
  });
});