import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { BRAND } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { LangSwitch } from '../components/ui.jsx';

export default function Login() {
  const { t } = useI18n();
  return (
    <div className="login">
      <div className="login-card">
        <span className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Ticket size={18} />
          </span>
          <span className="brand-name">{BRAND}</span>
        </span>
        <p>{t('login.text')}</p>
        <Link to="/" className="btn">
          {t('login.back')}
        </Link>
        <LangSwitch />
      </div>
    </div>
  );
}
