import { factories } from '@strapi/strapi';
import ExcelJS from 'exceljs';

const GENDER_LABELS: Record<string, string> = {
  masculino:       'Masculino',
  feminino:        'Feminino',
  prefiro_nao_dizer: 'Prefiro não dizer',
};

const HOW_HEARD_LABELS: Record<string, string> = {
  amigo:        'Amigo',
  redes_sociais: 'Redes sociais',
  evento:       'Evento',
  outro:        'Outro',
};

export default factories.createCoreController('api::member.member', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body as { data?: Record<string, unknown> };
    const data = body?.data ?? {};
    const createData = { ...data, status: 'pendente' };

    const result = await strapi.documents('api::member.member').create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: createData as any,
    });

    return { data: result };
  },

  async exportExcel(ctx) {
    const { status } = ctx.query as Record<string, string>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    if (status && status !== 'todos') {
      filters.status = { $eq: status };
    }

    const members = await strapi.documents('api::member.member').findMany({
      filters,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Geração B-Bright';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Membros');

    sheet.columns = [
      { header: 'Nome Completo',      key: 'fullName',   width: 30 },
      { header: 'Email',              key: 'email',      width: 30 },
      { header: 'Telemóvel',          key: 'phone',      width: 18 },
      { header: 'Data Nascimento',    key: 'birthDate',  width: 18 },
      { header: 'Género',             key: 'gender',     width: 20 },
      { header: 'Morada',             key: 'address',    width: 36 },
      { header: 'Igreja',             key: 'church',     width: 24 },
      { header: 'Como Soube',         key: 'howHeard',   width: 18 },
      { header: 'Estado',             key: 'status',     width: 14 },
      { header: 'Data Registo',       key: 'createdAt',  width: 20 },
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B4F8A' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    sheet.getRow(1).height = 24;

    for (const m of members) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member = m as any;
      sheet.addRow({
        fullName:  member.fullName ?? '',
        email:     member.email ?? '',
        phone:     member.phone ?? '',
        birthDate: member.birthDate ?? '',
        gender:    GENDER_LABELS[member.gender] ?? member.gender ?? '',
        address:   member.address ?? '',
        church:    member.church ?? '',
        howHeard:  HOW_HEARD_LABELS[member.howHeard] ?? member.howHeard ?? '',
        status:    member.status ?? '',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleDateString('pt-PT') : '',
      });
    }

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
    const filename = `membros_${dateStr}.xlsx`;

    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    ctx.set('Content-Disposition', `attachment; filename="${filename}"`);

    const buffer = await workbook.xlsx.writeBuffer();
    ctx.body = buffer;
  },
}));
