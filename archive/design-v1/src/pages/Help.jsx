import { ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n.jsx';
import { PageIntro } from '../components/ui.jsx';

const FAQ_IDS = [1, 2, 3, 4];

export default function Help() {
  const { t } = useI18n();
  return (
    <div className="page">
      <PageIntro title={t('nav.help')} subtitle={t('help.subtitle')} />
      <section className="card panel">
        <h3>{t('help.faq')}</h3>
        {FAQ_IDS.map((id) => (
          <details className="faq" key={id}>
            <summary>
              {t(`faq.${id}.q`)}
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <p>{t(`faq.${id}.a`)}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
