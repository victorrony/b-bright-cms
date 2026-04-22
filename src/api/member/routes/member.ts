export default {
  routes: [
    {
      method: 'POST',
      path: '/members',
      handler: 'member.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/members/export',
      handler: 'member.exportExcel',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/members',
      handler: 'member.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/members/:id',
      handler: 'member.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/members/:id',
      handler: 'member.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/members/:id',
      handler: 'member.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
