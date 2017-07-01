const sharedUser = {
  type: 'object',
  required: ['id', 'username', 'requestStatus'],
  properties: {
    id: {
      type: 'number',
    },
    username: {
      type: 'string',
    },
    requestStatus: {
      type: 'string',
    },
  },
};

const labelResponseSchema = {
  type: 'object',
  required: [
    'id',
    'priority',
    'visibled',
    'sharedUsers',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'integer',
    },
    priority: {
      type: 'integer',
    },
    visibled: {
      type: 'boolean',
    },
    sharedUsers: {
      type: 'array',
      items: sharedUser,
    },
    createdAt: {
      type: ['string', 'object'],
    },
    updatedAt: {
      type: ['string', 'object'],
    },
  },
};
module.exports = labelResponseSchema;
