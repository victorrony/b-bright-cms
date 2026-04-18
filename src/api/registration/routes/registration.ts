export default {
  routes: [
    {
      method: 'POST',
      path: '/registrations',
      handler: 'registration.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
