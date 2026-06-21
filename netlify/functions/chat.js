exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, business } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: `Du bist der freundliche Empfangs-Assistent für ein Geschäft mit dem Profil "${business}". Antworte kurz, höflich und auf Deutsch. Hilf bei Fragen zu Terminen, Öffnungszeiten, Preisen und Leistungen. Erfinde keine konkreten Preise oder Zeiten, falls sie dir nicht genannt wurden — verweise stattdessen freundlich auf eine telefonische Rückfrage.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Danke für deine Nachricht! Wir melden uns zeitnah.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Entschuldigung, da ist etwas schiefgelaufen. Bitte versuch es später noch einmal.' })
    };
  }
};
