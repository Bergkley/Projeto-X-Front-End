import styles from './TermsContent.module.css';

const TermsContent = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          1. Aceitação dos Termos
        </h3>
        <p className={styles.paragraph}>
          Ao utilizar o <strong>SyncTime</strong>, você declara estar ciente e de acordo com os presentes Termos de Uso e Política de Privacidade. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos que não prossiga com o cadastro ou utilização da plataforma.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          2. Coleta e Uso de Dados Pessoais
        </h3>
        <p className={styles.paragraph}>
          O SyncTime coleta e processa seus dados pessoais de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>. As informações coletadas incluem, mas não se limitam a:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Nome completo e dados de identificação</li>
          <li className={styles.listItem}>Endereço de e-mail</li>
          <li className={styles.listItem}>Dados de autenticação (senha criptografada)</li>
          <li className={styles.listItem}>Informações de uso e preferências da plataforma</li>
          <li className={styles.listItem}>Dados de navegação e interação com o sistema</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          3. Finalidade do Tratamento de Dados
        </h3>
        <p className={styles.paragraph}>
          Seus dados pessoais são utilizados exclusivamente para as seguintes finalidades:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Autenticação e gerenciamento de acesso à plataforma</li>
          <li className={styles.listItem}>Personalização da experiência do usuário</li>
          <li className={styles.listItem}>Comunicação sobre atualizações e funcionalidades</li>
          <li className={styles.listItem}>Melhoria contínua dos serviços oferecidos</li>
          <li className={styles.listItem}>Cumprimento de obrigações legais e regulatórias</li>
          <li className={styles.listItem}>Prevenção de fraudes e garantia da segurança</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          4. Compartilhamento de Dados
        </h3>
        <p className={styles.paragraph}>
          O SyncTime <strong>não compartilha, vende ou aluga</strong> seus dados pessoais a terceiros para fins comerciais. Seus dados poderão ser compartilhados apenas nas seguintes situações:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>Com seu consentimento expresso</li>
          <li className={styles.listItem}>Para cumprimento de ordem judicial ou requisição legal</li>
          <li className={styles.listItem}>Com prestadores de serviços essenciais (hospedagem, processamento), mediante acordo de confidencialidade</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          5. Segurança e Proteção de Dados
        </h3>
        <p className={styles.paragraph}>
          Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda, destruição ou alteração. Utilizamos criptografia, controles de acesso e monitoramento contínuo para garantir a segurança das informações.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          6. Seus Direitos (LGPD)
        </h3>
        <p className={styles.paragraph}>
          De acordo com a LGPD, você possui os seguintes direitos em relação aos seus dados:
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}><strong>Acesso:</strong> Solicitar informações sobre quais dados possuímos</li>
          <li className={styles.listItem}><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
          <li className={styles.listItem}><strong>Exclusão:</strong> Solicitar a remoção de seus dados pessoais</li>
          <li className={styles.listItem}><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
          <li className={styles.listItem}><strong>Revogação:</strong> Retirar o consentimento a qualquer momento</li>
          <li className={styles.listItem}><strong>Oposição:</strong> Opor-se ao tratamento de dados em situações específicas</li>
        </ul>
        <p className={styles.paragraph}>
          Para exercer seus direitos, entre em contato através do e-mail: <strong>privacidade@synctime.com</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          7. Retenção de Dados
        </h3>
        <p className={styles.paragraph}>
          Seus dados serão mantidos pelo tempo necessário para as finalidades descritas ou conforme exigido por lei. Após esse período, os dados serão anonimizados ou excluídos de forma segura.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          8. Alterações nos Termos
        </h3>
        <p className={styles.paragraph}>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou através de notificação na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          9. Contato
        </h3>
        <p className={styles.paragraph}>
          Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade e proteção de dados, entre em contato:
        </p>
        <p className={styles.paragraph}>
          <strong>E-mail:</strong> privacidade@synctime.com<br />
          <strong>Encarregado de Dados (DPO):</strong> dpo@synctime.com
        </p>
      </section>
     
      <p className={styles.lastUpdate}>
        Última atualização: Outubro de 2025
      </p>
    </div>
  );
};

export default TermsContent;