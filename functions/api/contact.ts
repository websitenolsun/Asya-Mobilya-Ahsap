interface ContactPayload {
  name?: unknown;
  phone?: unknown;
  project?: unknown;
}

interface ContactEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
}

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function onRequestPost({ request, env }: { request: Request; env: ContactEnv }): Promise<Response> {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'E-posta gönderim servisi yapılandırılmamış.' }, 500);
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'Geçersiz istek gövdesi.' }, 400);
  }

  const form = {
    name: clean(payload.name),
    phone: clean(payload.phone).replace(/[\s\-().]/g, ''),
    project: clean(payload.project),
  };

  if (!form.name || !form.phone || !form.project) {
    return json({ ok: false, error: 'Tüm alanlar gereklidir.' }, 400);
  }

  if (!/^(?:0|\+90)?5\d{9}$/.test(form.phone)) {
    return json({ ok: false, error: 'Geçerli bir cep telefonu numarası girin.' }, 400);
  }

  const resend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM ?? 'onboarding@resend.dev',
      to: [env.RESEND_TO ?? 'asyamobilyaweb@proton.me'],
      subject: `İletişim formu — ${form.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2e241e;">
          <h2 style="margin-bottom: 20px;">Yeni iletişim formu</h2>
          <p><strong>Ad:</strong> ${escapeHtml(form.name)}</p>
          <p><strong>Cep telefonu:</strong> ${escapeHtml(form.phone)}</p>
          <p><strong>Mesaj:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(form.project)}</p>
        </div>
      `,
    }),
  });

  if (!resend.ok) {
    return json({ ok: false, error: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.' }, 502);
  }

  return json({ ok: true, message: 'Mesajınız alındı.' }, 200);
}