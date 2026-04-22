import { factories } from '@strapi/strapi';
import ExcelJS from 'exceljs';

export default factories.createCoreController('api::registration.registration', ({ strapi }) => ({
  async exportExcel(ctx) {
    const { courseId } = ctx.query as Record<string, string>;

    // Construir filtros
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    if (courseId) {
      filters.course = { documentId: { $eq: courseId } };
    }

    const registrations = await strapi.documents('api::registration.registration').findMany({
      filters,
      populate: ['course'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Geração B-Bright';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Inscritos');

    // Cabeçalhos
    sheet.columns = [
      { header: 'Nome Completo',   key: 'name',       width: 30 },
      { header: 'Email',           key: 'email',      width: 30 },
      { header: 'Telefone',        key: 'phone',      width: 18 },
      { header: 'Idade',           key: 'age',        width: 10 },
      { header: 'Sexo',            key: 'sex',        width: 14 },
      { header: 'Ocupação',        key: 'occupation', width: 18 },
      { header: 'Curso',           key: 'course',     width: 36 },
      { header: 'Data Inscrição',  key: 'createdAt',  width: 20 },
      { header: 'Mensagem',        key: 'message',    width: 40 },
    ];

    // Estilo do cabeçalho
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B4F8A' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    sheet.getRow(1).height = 24;

    // Dados
    for (const reg of registrations) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = reg as any;
      sheet.addRow({
        name:       r.name ?? '',
        email:      r.email ?? '',
        phone:      r.phone ?? '',
        age:        r.age ?? '',
        sex:        r.sex ?? '',
        occupation: r.occupation ?? '',
        course:     r.course?.title ?? '',
        createdAt:  r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-PT') : '',
        message:    r.message ?? '',
      });
    }

    // Bordas nas células de dados
    const lastRow = sheet.lastRow?.number ?? 1;
    for (let rowNum = 2; rowNum <= lastRow; rowNum++) {
      sheet.getRow(rowNum).eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        };
        if (rowNum % 2 === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FF' } };
        }
      });
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `inscritos_${dateStr}.xlsx`;

    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`);

    const buffer = await workbook.xlsx.writeBuffer();
    ctx.body = buffer;
  },
}));
