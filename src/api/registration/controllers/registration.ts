import { factories } from '@strapi/strapi';
import ExcelJS from 'exceljs';

const COLUMNS = [
  { header: 'Nome Completo',  key: 'name',      width: 30 },
  { header: 'Email',          key: 'email',     width: 30 },
  { header: 'Telefone',       key: 'phone',     width: 18 },
  { header: 'Data Inscrição', key: 'createdAt', width: 20 },
];

function styleHeader(sheet: ExcelJS.Worksheet) {
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B4F8A' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  sheet.getRow(1).height = 24;
}

function styleRows(sheet: ExcelJS.Worksheet) {
  const lastRow = sheet.lastRow?.number ?? 1;
  for (let rowNum = 2; rowNum <= lastRow; rowNum++) {
    sheet.getRow(rowNum).eachCell((cell) => {
      cell.border = {
        top:    { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left:   { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right:  { style: 'thin', color: { argb: 'FFD0D0D0' } },
      };
      if (rowNum % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FF' } };
      }
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addRows(sheet: ExcelJS.Worksheet, registrations: any[]) {
  for (const reg of registrations) {
    sheet.addRow({
      name:      reg.name ?? '',
      email:     reg.email ?? '',
      phone:     reg.phone ?? '',
      createdAt: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('pt-PT') : '',
    });
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
}

export default factories.createCoreController('api::registration.registration', ({ strapi }) => ({
  async exportExcel(ctx) {
    const { courseId } = ctx.query as Record<string, string>;
    const dateStr = new Date().toISOString().slice(0, 10);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Geração B-Bright';
    workbook.created = new Date();

    let filename: string;

    if (courseId) {
      // --- Exportação de um único curso ---
      const [course, registrations] = await Promise.all([
        strapi.documents('api::course.course').findOne({ documentId: courseId }),
        strapi.documents('api::registration.registration').findMany({
          filters: { course: { documentId: { $eq: courseId } } },
          populate: ['course'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const courseTitle = (course as any)?.title ?? courseId;
      const sheetName = courseTitle.slice(0, 31); // Excel limita a 31 caracteres

      const sheet = workbook.addWorksheet(sheetName);
      sheet.columns = COLUMNS;
      styleHeader(sheet);
      addRows(sheet, registrations);
      styleRows(sheet);

      filename = `inscritos_${slugify(courseTitle)}_${dateStr}.xlsx`;
    } else {
      // --- Exportação múltipla: uma aba por curso ---
      const registrations = await strapi.documents('api::registration.registration').findMany({
        populate: ['course'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Agrupar por curso
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const byCourse = new Map<string, { title: string; rows: any[] }>();
      for (const reg of registrations) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = reg as any;
        const key: string = r.course?.documentId ?? 'sem_curso';
        const title: string = r.course?.title ?? 'Sem curso';
        if (!byCourse.has(key)) byCourse.set(key, { title, rows: [] });
        byCourse.get(key)!.rows.push(r);
      }

      for (const { title, rows } of byCourse.values()) {
        const sheetName = title.slice(0, 31);
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = COLUMNS;
        styleHeader(sheet);
        addRows(sheet, rows);
        styleRows(sheet);
      }

      filename = `inscritos_todos_os_cursos_${dateStr}.xlsx`;
    }

    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`);

    const buffer = await workbook.xlsx.writeBuffer();
    ctx.body = buffer;
  },
}));
