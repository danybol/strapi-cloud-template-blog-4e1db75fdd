module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/calendar-availability/:id',
      handler: 'calendar-availability.getAvailability',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
