const form = document.querySelector('form');
const submitButton = form.querySelector('input[type="submit"]');
const orariPrenotati = {};

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const nome = form.nome.value;
  const email = form.email.value;
  const bagno = form.bagno.value;
  const orario = form.orario.value;

  if (orariPrenotati[orario]) {
    alert('Spiacenti, questo orario è già stato prenotato da qualcun altro.');
    return;
  }

  orariPrenotati[orario] = {
    nome: nome,
    email: email,
    bagno: bagno,
  };

  console.log(`Prenotazione effettuata: ${nome}, ${email}, ${bagno}, ${orario}`);
  alert('Prenotazione effettuata!');
  form.reset();

  // Invia un'email di conferma all'utente
  const sgApiKey = '<TUO_SENDGRID_API_KEY>';
  const sgFromEmail = '<LA_TUA_EMAIL_DI_SENDER>';
  const sgToEmail = email;
  const sgSubject = 'Conferma prenotazione bagno';
  const sgText = `Hai prenotato il bagno per l'orario ${orario}. Grazie per aver scelto il nostro servizio!`;

  const sgRequest = {
    method: 'POST',
    url: 'https://api.sendgrid.com/v2/mail/send.json',
    headers: {
      Authorization: `Bearer ${sgApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      to: sgToEmail,
      from: sgFromEmail,
      subject: sgSubject,
      text: sgText,
    },
    json: true,
  };

  try {
    const sgResponse = await fetch(sgRequest.url, {
      method: sgRequest.method,
      headers: sgRequest.headers,
      body: JSON.stringify(sgRequest.body),
    });

    console.log(`Email inviata a ${sgToEmail}: ${await sgResponse.text()}`);
  } catch (error) {
    console.error(`Errore durante l'invio dell'email: ${error}`);
  }
});
