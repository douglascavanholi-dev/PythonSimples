const TARGET = "https://nessan-ml-integration-admin-54851890.vercel.app/api/webhooks/mercadolivre";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const now = new Date().toISOString();
  const payload = {
    _id: "manual-contingency-2000019184579654",
    actions: ["contingency:manual_replay"],
    application_id: 3345817777045529,
    attempts: 2,
    received: now,
    resource: "/orders/2000019184579654",
    sent: now,
    topic: "orders_v2",
    user_id: 2680216888
  };

  try {
    const response = await fetch(TARGET, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let body = text;
    try { body = JSON.parse(text); } catch {}

    res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      target_status: response.status,
      target_response: body,
      replayed_resource: payload.resource
    });
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: String(error?.message || error),
      replayed_resource: payload.resource
    });
  }
}
