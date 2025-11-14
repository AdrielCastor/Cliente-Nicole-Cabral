import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Phone, Heart, MessageSquare, Menu, X } from "lucide-react";
import { DateTime } from "luxon";

export default function LandingNicole() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors, isSubmitting, isSubmitSuccessful } = formState;
  const [menuAberto, setMenuAberto] = useState(false);

  function aoEnviar(dados) {
    return new Promise((resolver) => {
      setTimeout(() => { console.log('Form enviado:', dados); reset(); resolver(); }, 800);
    });
  }

  const fadeInUp = { oculto: { opacity: 0, y: 18 }, mostrar: (delay = 0) => ({ opacity:1, y:0, transition:{duration:0.6, delay} }) };
  const float = { inicial:{y:0}, flutuando:{ y: [-6,6,-6], transition:{duration:6, repeat:Infinity, ease:'easeInOut'} } };
  const cardHover = { hover: { y: -8, boxShadow: '0 20px 40px rgba(2,6,23,0.12)' } };

  function abrirGoogleCalendar({ startUTCforGoogle, endUTCforGoogle, titulo, detalhes, local }){
    const titleEnc = encodeURIComponent(titulo);
    const detailsEnc = encodeURIComponent(detalhes);
    const locationEnc = encodeURIComponent(local || 'Consulta online / Consultório de Nicole Cabral');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEnc}&dates=${startUTCforGoogle}/${endUTCforGoogle}&details=${detailsEnc}&location=${locationEnc}&sf=true&output=xml`;
    window.open(url,'_blank');
  }

  function baixarICS({ startDT, endDT, titulo, descricao }){
    const startUTC = DateTime.fromISO(startDT).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endUTC = DateTime.fromISO(endDT).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const icsLines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NicoleCabral//PT-BR','BEGIN:VEVENT',
      `UID:${Date.now()}@nicolecabral`,
      `DTSTAMP:${DateTime.utc().toFormat("yyyyMMdd'T'HHmmss'Z'")}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:${titulo}`,
      `DESCRIPTION:${descricao.replace(/\n/g, '\\n')}`,
      'END:VEVENT','END:VCALENDAR'
    ];
    const ics = icsLines.join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'consulta-nicole-cabral.ics';
    document.body.appendChild(link); link.click(); link.remove();
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 antialiased overflow-x-hidden">
      <motion.div initial="inicial" animate="flutuando" variants={float} className="pointer-events-none absolute -left-40 -top-20 w-72 h-72 rounded-full bg-rose-100/70 blur-3xl mix-blend-multiply" />
      <motion.div initial="inicial" animate="flutuando" variants={float} transition={{ delay: 1 }} className="pointer-events-none absolute -right-40 top-40 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl mix-blend-multiply" />

      <header className="fixed w-full z-40 backdrop-blur-sm bg-white/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.06 }} className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-semibold shadow">NC</motion.div>
            <div>
              <h1 className="text-lg font-semibold">Nicole Cabral</h1>
              <p className="text-xs text-slate-500">Psicóloga Clínica & Aconselhamento</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#sobre" className="hover:text-rose-600 transition-colors">Sobre</a>
            <a href="#atendimentos" className="hover:text-rose-600 transition-colors">Atendimentos</a>
            <a href="#depoimentos" className="hover:text-rose-600 transition-colors">Depoimentos</a>
            <a href="#contato" className="px-4 py-2 rounded-md bg-rose-600 text-white shadow hover:brightness-95 transition-all">Agende</a>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setMenuAberto((s) => !s)} className="p-2 rounded-md hover:bg-slate-100">
              {menuAberto ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>{ menuAberto && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="md:hidden bg-white/95 border-t border-slate-100">
            <div className="px-6 py-4 flex flex-col gap-3">
              <a href="#sobre" onClick={() => setMenuAberto(false)} className="py-2">Sobre</a>
              <a href="#atendimentos" onClick={() => setMenuAberto(false)} className="py-2">Atendimentos</a>
              <a href="#depoimentos" onClick={() => setMenuAberto(false)} className="py-2">Depoimentos</a>
              <a href="#contato" onClick={() => setMenuAberto(false)} className="py-2 rounded-md bg-rose-600 text-white text-center">Agende</a>
            </div>
          </motion.div>
        )}</AnimatePresence>
      </header>

      <main className="pt-28">
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial="oculto" whileInView="mostrar" viewport={{ once: true, amount: 0.2 }} custom={0} variants={fadeInUp}>
            <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }} className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-rose-50 text-rose-600 w-max">Bem-vinda — Acolhimento seguro</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} className="mt-6 text-3xl md:text-4xl font-extrabold leading-tight">Nicole Cabral<br /><span className="text-rose-600">Psicóloga Clínica</span></motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} className="mt-4 text-slate-600">Você não precisa carregar tudo sozinho(a). Na escuta e no cuidado, construímos caminhos de leveza e transformação.</motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35 } }} className="mt-6 flex gap-4 flex-wrap">
              <motion.a whileHover={{ scale: 1.03 }} href="#contato" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-medium shadow">Agende uma sessão</motion.a>
              <motion.a whileHover={{ scale: 1.03 }} href="#atendimentos" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-200 text-slate-700">Conheça os atendimentos</motion.a>
            </motion.div>

            <motion.div className="mt-8 grid grid-cols-2 gap-4">
              <motion.div variants={cardHover} whileHover="hover" className="flex items-start gap-3">
                <motion.div whileHover={{ rotate: 5 }} className="p-3 rounded-lg bg-rose-50 text-rose-600 shadow-sm"><Heart size={20} /></motion.div>
                <div><div className="text-sm font-semibold">Atenção Individual</div><div className="text-xs text-slate-500">Plano de terapia personalizado</div></div>
              </motion.div>

              <motion.div variants={cardHover} whileHover="hover" className="flex items-start gap-3">
                <motion.div whileHover={{ rotate: -5 }} className="p-3 rounded-lg bg-rose-50 text-rose-600 shadow-sm"><MessageSquare size={20} /></motion.div>
                <div><div className="text-sm font-semibold">Confidencialidade</div><div className="text-xs text-slate-500">Ambiente seguro e ético</div></div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }} className="relative">
            <motion.div initial={{ scale: 0.98 }} whileHover={{ scale: 1 }} transition={{ type: 'spring', stiffness: 120 }} className="w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-100">
              <img src="/images/nicole.png" alt="Nicole Cabral sorrindo" className="w-full h-96 object-cover" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80'}}/>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }} className="mt-4 text-sm text-slate-500">Atendimento humano, baseado em evidência — com foco no seu bem-estar.</motion.div>
          </motion.div>
        </section>

        <section id="sobre" className="max-w-6xl mx-auto px-6 py-12">
          <motion.div initial="oculto" whileInView="mostrar" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-bold">Sobre Nicole</motion.h3>
              <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0, transition: { delay: 0.08 } }} className="mt-3 text-slate-600">Nicole é psicóloga com formação em psicologia clínica e experiência em terapia cognitivo-comportamental. Trabalha com adolescentes e adultos, oferecendo um espaço seguro de escuta e estratégias práticas para melhoria da qualidade de vida.</motion.p>

              <motion.ul initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0, transition: { delay: 0.16 } }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="text-sm text-slate-700">✔️ Atendimento presencial e online</li>
                <li className="text-sm text-slate-700">✔️ Terapia breve e psicoterapia de apoio</li>
                <li className="text-sm text-slate-700">✔️ Trabalha com ansiedade, depressão e autoestima</li>
                <li className="text-sm text-slate-700">✔️ Acolhimento ético e confidencial</li>
              </motion.ul>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1, transition: { delay: 0.24 } }} className="mt-6 flex gap-3">
                <a href="#contato" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-50 text-rose-700 border border-rose-100">Marcar consulta</a>
                <a href="#atendimentos" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200">Ver métodos</a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow">
              <h4 className="font-semibold">Informações Rápidas</h4>
              <dl className="mt-4 text-sm text-slate-600 grid gap-3">
                <div className="flex justify-between"><dt>Formação</dt><dd>Psicologia Clínica</dd></div>
                <div className="flex justify-between"><dt>Idiomas</dt><dd>Português | Inglês básico</dd></div>
                <div className="flex justify-between"><dt>Atendimentos</dt><dd>Online / Presencial</dd></div>
                <div className="flex justify-between"><dt>Planos</dt><dd>Sessões avulsas / Pacotes</dd></div>
              </dl>
            </motion.div>
          </motion.div>
        </section>

        <section id="atendimentos" className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-bold">Atendimentos</motion.h3>
            <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0, transition: { delay: 0.06 } }} className="mt-2 text-slate-600">Abordagens práticas e acolhedoras para diferentes demandas.</motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {titulo: 'Terapia Individual', descricao: 'Sessões para explorar emoções, padrões e encontrar estratégias práticas.'},
              {titulo: 'Apoio para Ansiedade', descricao: 'Técnicas baseadas em evidências para redução de sintomas e manejo do dia a dia.'},
              {titulo: 'Autoconhecimento', descricao: 'Trabalho com autoestima, identidade e objetivos de vida.'},
            ].map((servico, idx) => (
              <motion.div key={servico.titulo} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} transition={{ duration: 0.35, delay: idx * 0.06 }} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg">
                <h4 className="font-semibold text-lg">{servico.titulo}</h4>
                <p className="mt-3 text-slate-600 text-sm">{servico.descricao}</p>
                <div className="mt-4"><a href="#contato" className="text-rose-600 text-sm font-medium">Agende uma sessão →</a></div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="depoimentos" className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl font-bold">Depoimentos</motion.h3>
            <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0, transition: { delay: 0.06 } }} className="mt-2 text-slate-600">Histórias reais de quem encontrou apoio.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {nome: 'Carla, 28', texto: 'Me senti ouvida e aprendi técnicas práticas que mudaram minha rotina.'},
              {nome: 'Lucas, 34', texto: 'A abordagem foi objetiva e acolhedora — recomendo.'},
              {nome: 'Mariana, 22', texto: 'Ambiente super seguro. Evoluí muito em poucas sessões.'},
            ].map((t, idx) => (
              <motion.blockquote key={t.nome} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="bg-rose-50 p-6 rounded-2xl">
                <p className="text-slate-700">“{t.texto}”</p>
                <footer className="mt-4 text-sm text-slate-500">— {t.nome}</footer>
              </motion.blockquote>
            ))}
          </div>
        </section>

        <section id="contato" className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold">Agende ou envie uma mensagem</h3>
                <p className="mt-3 text-slate-600">Preencha o formulário e entraremos em contato para confirmar sua sessão.</p>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3"><Phone size={16} /><span>+55 (11) 9XXXX-XXXX</span></div>
                  <div className="flex items-center gap-3"><Mail size={16} /><span>contato@nicolecabral.com</span></div>
                </div>
              </div>

              <form onSubmit={handleSubmit(aoEnviar)} className="space-y-3">
                <div><label className="text-xs font-medium">Nome</label><input {...register("nome", { required: "Nome obrigatório" })} id="nome" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="Seu nome" />{errors.nome && <p className="text-xs text-rose-600">{errors.nome.message}</p>}</div>

                <div><label className="text-xs font-medium">E-mail</label><input {...register("email", { required: "Email obrigatório", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Email inválido" } })} id="email" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="seu@email.com" />{errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}</div>

                <div><label className="text-xs font-medium">Mensagem</label><textarea {...register("mensagem", { required: false })} id="mensagem" rows={4} className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" placeholder="Breve descrição do que gostaria de trabalhar..." /></div>

                <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-medium">Data preferida</label><input type="date" id="data" name="data" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" /></div><div><label className="text-xs font-medium">Hora preferida</label><input type="time" id="hora" name="hora" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" /></div></div>

                <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-medium">Duração</label><select id="duracao" name="duracao" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60" defaultValue>60 minutos</option></select></div><div><label className="text-xs font-medium">Fuso horário</label><select id="fuso" name="fuso" className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"><option value="America/Sao_Paulo" defaultValue>America/Sao_Paulo (UTC-3)</option><option value="UTC">UTC</option><option value="Europe/Lisbon">Europe/Lisbon (UTC+0/+1)</option><option value="America/New_York">America/New_York (UTC-4/-5)</option></select></div></div>

                <div className="flex items-center gap-3">
                  <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 text-white font-medium shadow" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar mensagem'}</button>

                  <button type="button" onClick={(e)=>{ e.preventDefault(); const nome = document.getElementById('nome')?.value || ''; const email = document.getElementById('email')?.value || ''; const mensagem = document.getElementById('mensagem')?.value || ''; const data = document.getElementById('data')?.value; const hora = document.getElementById('hora')?.value; const duracao = parseInt(document.getElementById('duracao')?.value || '60', 10); const fuso = document.getElementById('fuso')?.value || 'America/Sao_Paulo'; if(!data || !hora){ alert('Por favor, escolha data e hora para criar o evento no Google Calendar.'); return;} const startInZone = DateTime.fromISO(`${data}T${hora}`, { zone: fuso }); const endInZone = startInZone.plus({ minutes: duracao }); const startUTCforGoogle = startInZone.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'"); const endUTCforGoogle = endInZone.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'"); const titulo = `Consulta: Nicole Cabral - ${nome || 'Paciente'}`; const detalhes = `Paciente: ${nome}\nEmail: ${email}\n\n${mensagem}`; abrirGoogleCalendar({ startUTCforGoogle, endUTCforGoogle, titulo, detalhes, local: 'Consulta online / Consultório de Nicole Cabral' }); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">Criar evento no Google Calendar</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-100 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-semibold">NC</div>
              <div className="text-sm text-slate-600">Nicole Cabral — Psicóloga Clínica</div>
            </div>
            <div className="text-sm text-slate-500">© {new Date().getFullYear()} Nicole Cabral. Todos os direitos reservados. Dev. Adriel Castor</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
