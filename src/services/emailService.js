const { createTransport } = require('nodemailer');

function sendMail(data) {
    const user = 'anr.scs.495@gmail.com';
    const pass = 'q1@w2e3.r4';
    const from = '"✉ Delivery" <anr.scs.495@gmail.com>';
    
    const to = data.email; //'anr.alexandre@gmail.com, alexandre@anrsistemas.com.br';
    const subject = 'Solicitação de reenvio de senha delivery app';
//  const text = `Sua senha é ${data.pass}`;
    const html = 
`
<h2 style='color: #34495E'>Olá ${data.name}</h2>
<p style='color: #34495E; font-weight: bold'>Sua senha é ${data.pass}</p>
<p style='color: #212F3D; margin-bottom: 30px'>E-mail : ${data.email}</p>
<div style='color: #34495E'>Atendimento ao Cliente</div>
<div style='color: #34495E; margin-bottom: 15px'>Por gentileza, não responda esta mensagem. Esta caixa de correio é exclusiva para o envio de respostas.</div>
<hr style='border:none; color:#909090; background-color:#B0B0B0; height: 1px;' />
`

    const transporter = createTransport({
        service: "gmail",
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
    });

    const mailInfo = { from, to, subject, html };  // html

    return new Promise(( resolve, reject ) => {
        transporter.sendMail(mailInfo, (error, info) => {
            if (error) reject(error);
            resolve(info);
        });
    });
};

module.exports = {
    sendMail
};
