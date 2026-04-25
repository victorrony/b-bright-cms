import type { Core } from '@strapi/strapi';
import { Resend } from 'resend';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['api::member.member'],

      async afterCreate(event) {
        const { result } = event;
        const member = result as Record<string, unknown>;
        const email = member.email as string;
        const fullName = member.fullName as string;

        if (!email || !fullName) return;

        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) return;

        const resend = new Resend(resendKey);
        const contactEmail = process.env.CONTACT_EMAIL;

        // 1. Email de confirmação ao novo membro
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Pedido de adesão recebido — Geração B-Bright',
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
              <h1 style="color:#1B4F8A;font-size:22px;margin-bottom:8px">Recebemos o teu pedido!</h1>
              <p style="color:#374151;font-size:15px;line-height:1.6">
                Olá <strong>${fullName}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6">
                O teu pedido de adesão à comunidade Geração B-Bright foi recebido com sucesso.
                A nossa equipa irá analisá-lo e enviar-te uma resposta em breve.
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6">
                Obrigado pelo teu interesse em fazer parte da família GBB!
              </p>
              <p style="color:#9CA3AF;font-size:13px;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
                Geração B-Bright · Cabo Verde
              </p>
            </div>
          `,
        });

        // 2. Notificação ao administrador
        if (contactEmail) {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: contactEmail,
            subject: `Novo pedido de membro: ${fullName}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
                <h1 style="color:#1B4F8A;font-size:20px;margin-bottom:8px">Novo pedido de adesão</h1>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Um novo visitante submeteu um pedido de adesão à GBB.
                </p>
                <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
                  <tr style="border-bottom:1px solid #E5E7EB">
                    <td style="padding:8px 0;color:#6B7280;width:140px">Nome</td>
                    <td style="padding:8px 0;color:#111827;font-weight:600">${fullName}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #E5E7EB">
                    <td style="padding:8px 0;color:#6B7280">Email</td>
                    <td style="padding:8px 0;color:#111827">${email}</td>
                  </tr>
                </table>
                <p style="color:#9CA3AF;font-size:13px;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
                  Geração B-Bright · Painel de Administração
                </p>
              </div>
            `,
          });
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        const newStatus = (result as Record<string, unknown>).status as string;
        const updatedFields = params?.data as Record<string, unknown> | undefined;

        if (!updatedFields || !('status' in updatedFields)) return;
        if (newStatus !== 'aprovado' && newStatus !== 'rejeitado') return;

        const member = result as Record<string, unknown>;
        const email = member.email as string;
        const fullName = member.fullName as string;

        if (!email || !fullName) return;

        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) return;

        const resend = new Resend(resendKey);
        const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

        if (newStatus === 'aprovado') {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'O seu pedido de adesão foi aprovado!',
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
                <h1 style="color:#1B4F8A;font-size:22px;margin-bottom:8px">Bem-vindo(a) à Geração B-Bright!</h1>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Olá <strong>${fullName}</strong>,
                </p>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  O seu pedido de adesão à comunidade Geração B-Bright foi <strong style="color:#16a34a">aprovado</strong>.
                  Bem-vindo(a) à família!
                </p>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Pode aceder à sua área de membro através do link abaixo:
                </p>
                <div style="text-align:center;margin:28px 0">
                  <a href="${siteUrl}/membro"
                    style="background-color:#1B4F8A;color:#fff;text-decoration:none;padding:14px 32px;border-radius:9999px;font-weight:700;font-size:14px;letter-spacing:0.05em">
                    ACEDER À MINHA ÁREA
                  </a>
                </div>
                <p style="color:#9CA3AF;font-size:13px;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
                  Geração B-Bright · Cabo Verde
                </p>
              </div>
            `,
          });
        } else if (newStatus === 'rejeitado') {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Atualização sobre o seu pedido de adesão',
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
                <h1 style="color:#1B4F8A;font-size:22px;margin-bottom:8px">Pedido de adesão</h1>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Olá <strong>${fullName}</strong>,
                </p>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Após análise, o seu pedido de adesão à Geração B-Bright não pôde ser aceite neste momento.
                </p>
                <p style="color:#374151;font-size:15px;line-height:1.6">
                  Se tiver questões ou acreditar que houve um engano, não hesite em contactar-nos.
                </p>
                <p style="color:#9CA3AF;font-size:13px;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
                  Geração B-Bright · Cabo Verde
                </p>
              </div>
            `,
          });
        }
      },
    });
  },
};
