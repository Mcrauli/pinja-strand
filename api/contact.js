const nodemailer = require("nodemailer");
const { services } = require("../src/_data/palvelut.json");

const MIN_FILL_MS = 3000;
const SERVICES = [...services.map((s) => s.name), "Muu"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9 +()\-]{5,30}$/;

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");
const oneLine = (s) => s.replace(/[\r\n]+/g, " ");

function parseBody(req) {
  const ct = String(req.headers["content-type"] || "");
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = ct.includes("application/json") ? JSON.parse(body) : Object.fromEntries(new URLSearchParams(body));
    } catch {
      body = {};
    }
  }
  return { body: body && typeof body === "object" ? body : {}, isJson: ct.includes("application/json") };
}

function validate(body) {
  const errors = {};
  const v = {
    nimi: clean(body.nimi, 100),
    email: clean(body.email, 200),
    puhelin: clean(body.puhelin, 30),
    palvelu: clean(body.palvelu, 100),
    paivamaara: clean(body.paivamaara, 10),
    paikka: clean(body.paikka, 200),
    viesti: clean(body.viesti, 5000),
  };

  if (!v.nimi) errors.nimi = "Kirjoita nimesi.";
  else if (v.nimi.length > 100) errors.nimi = "Nimi on liian pitkä (enintään 100 merkkiä).";

  if (!v.email) errors.email = "Kirjoita sähköpostiosoitteesi.";
  else if (v.email.length > 200 || !EMAIL_RE.test(v.email)) errors.email = "Tarkista sähköpostiosoite.";

  if (v.puhelin && !PHONE_RE.test(v.puhelin)) errors.puhelin = "Tarkista puhelinnumero.";

  if (v.palvelu && !SERVICES.includes(v.palvelu)) errors.palvelu = "Valitse palvelu listasta.";

  if (v.paivamaara) {
    const d = /^\d{4}-\d{2}-\d{2}$/.test(v.paivamaara) ? new Date(v.paivamaara + "T00:00:00Z") : null;
    if (!d || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v.paivamaara) errors.paivamaara = "Tarkista päivämäärä.";
  }

  if (v.paikka.length > 200) errors.paikka = "Paikka on liian pitkä (enintään 200 merkkiä).";

  if (!v.viesti) errors.viesti = "Kirjoita viesti.";
  else if (v.viesti.length < 10) errors.viesti = "Viestin tulee olla vähintään 10 merkkiä.";
  else if (v.viesti.length > 5000) errors.viesti = "Viesti on liian pitkä (enintään 5000 merkkiä).";

  return { v, errors };
}

function mailText(v) {
  return [
    `Nimi: ${v.nimi}`,
    `Sähköposti: ${v.email}`,
    `Puhelin: ${v.puhelin || "-"}`,
    `Palvelu: ${v.palvelu || "-"}`,
    `Toivottu päivämäärä: ${v.paivamaara || "-"}`,
    `Kuvauspaikka: ${v.paikka || "-"}`,
    "",
    "Viesti:",
    v.viesti,
    "",
  ].join("\n");
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { body, isJson } = parseBody(req);

  const fail = (status, payload) => {
    if (isJson) return res.status(status).json(payload);
    res.setHeader("Location", "/yhteystiedot.html?virhe=1");
    return res.status(303).end();
  };

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return fail(400, { error: "Viestiä ei voitu lähettää." });
  }

  // Non-JS posts cannot carry the timestamp, so it is only enforced when present or for fetch (JSON) requests.
  // Client clocks can run ahead of the server, so a render time far in the future is not treated as too fast.
  const t = Number(body.t);
  if (Number.isFinite(t) && t > 0) {
    const elapsed = Date.now() - t;
    if (elapsed < MIN_FILL_MS && elapsed > -60000) {
      return fail(400, { error: "Lomake lähetettiin liian nopeasti.", errors: { general: "Lomake lähetettiin liian nopeasti. Odota hetki ja yritä uudelleen." } });
    }
  } else if (isJson) {
    return fail(400, { error: "Virheellinen lomake.", errors: { general: "Lataa sivu uudelleen ja yritä uudelleen." } });
  }

  const { v, errors } = validate(body);
  if (Object.keys(errors).length) {
    return fail(400, { error: "Tarkista lomakkeen tiedot.", errors });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  const from = process.env.CONTACT_FROM || SMTP_USER;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !from) {
    return fail(503, { error: "Viestin lähetys ei ole tällä hetkellä käytössä." });
  }

  try {
    const port = Number(SMTP_PORT);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    await transport.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: { name: oneLine(v.nimi), address: v.email },
      subject: `Uusi yhteydenotto: ${v.palvelu || "Ei valittua palvelua"} – ${oneLine(v.nimi)}`,
      text: mailText(v),
    });
  } catch (err) {
    console.error("contact: sending failed", err && (err.code || err.responseCode || err.name));
    return fail(502, { error: "Viestin lähetys epäonnistui." });
  }

  if (isJson) return res.status(200).json({ ok: true });
  res.setHeader("Location", "/yhteystiedot.html?lahetetty=1");
  return res.status(303).end();
};
