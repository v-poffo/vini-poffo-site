const axios = require('axios');

module.exports = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      state,
    }, {
      headers: {
        Accept: 'application/json',
      },
    });

    const { access_token, error, error_description } = response.data;

    if (error) {
      return res.status(400).send(error_description || error);
    }

    // O Decap CMS espera uma mensagem postMessage para fechar a janela e receber o token
    const script = `
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("Recieved message:", e.data);
            if (e.data !== "authorizing:github") return;
            
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token: access_token, provider: 'github' })}',
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;
    res.send(script);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
