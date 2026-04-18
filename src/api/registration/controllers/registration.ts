import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::registration.registration', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body as { data?: Record<string, unknown> };
    const data = body?.data ?? {};
    const { course, ...rest } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createData: Record<string, any> = { ...rest };

    if (typeof course === 'string' && course.length > 0) {
      createData.course = { connect: [{ documentId: course }] };
    } else if (course && typeof course === 'object') {
      createData.course = course;
    }

    const result = await strapi.documents('api::registration.registration').create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: createData as any,
      populate: ['course'],
    });

    return { data: result };
  },
}));
