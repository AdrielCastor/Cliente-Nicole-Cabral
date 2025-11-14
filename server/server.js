const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
const TOKEN_STORE = process.env.TOKEN_STORE_PATH || path.join(__dirname, 'tokens.json');

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function saveTokens(tokens){ fs.writeFileSync(TOKEN_STORE, JSON.stringify(tokens, null, 2)); }
function loadTokens(){ try{ return JSON.parse(fs.readFileSync(TOKEN_STORE,'utf8')); }catch(e){ return null } }

app.get('/api/google/auth', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const url = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
  res.redirect(url);
});

app.get('/api/google/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if(!code) return res.status(400).send('Missing code');
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    saveTokens(tokens);
    res.send('Autenticação concluída! Tokens salvos.');
  } catch(err) {
    console.error(err);
    res.status(500).send('Erro ao trocar código por tokens.');
  }
});

async function ensureAuth(req,res,next){
  const tokens = loadTokens();
  if(!tokens) return res.status(401).send('Serviço Google não autenticado. Visite /api/google/auth');
  oAuth2Client.setCredentials(tokens);
  next();
}

app.post('/api/google/create-event', ensureAuth, async (req, res) => {
  try{
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const { summary, description, start, end, attendees } = req.body;
    const event = { summary, description, start, end, attendees: attendees || [] };
    const created = await calendar.events.insert({ calendarId: CALENDAR_ID, resource: event, sendUpdates: 'all' });
    const logPath = path.join(__dirname,'events_log.json');
    const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
    log.push({ created: created.data, payload: req.body, createdAt: new Date().toISOString() });
    fs.writeFileSync(logPath, JSON.stringify(log,null,2));
    res.json({ ok:true, event: created.data });
  }catch(err){
    console.error(err);
    res.status(500).send('Erro ao criar evento: ' + (err.message||''));
  }
});

app.get('/api/google/status', (req,res) => {
  const tokens = loadTokens();
  res.json({ authenticated: !!tokens, tokensExist: !!tokens });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`Server rodando na porta ${PORT}`));
