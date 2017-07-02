const taskResponseSchema = {
  type: 'object',
  required: [
    'id',
    'content',
    'labelId',
    'priority',
    'completed',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'integer',
    },
    content: {
      type: 'string',
    },
    labelId: {
      type: 'integer',
    },
    priority: {
      type: 'integer',
    },
    completed: {
      type: 'boolean',
    },
    createdAt: {
      type: ['string', 'object'],
    },
    updatedAt: {
      type: ['string', 'object'],
    },
  },
};
module.exports = taskResponseSchema;
