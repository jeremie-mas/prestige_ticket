import { Link } from 'react-router-dom';
import { BRAND } from '../data.js';
import { useI18n } from '../i18n.jsx';
import { LangSwitch } from '../components/ui.jsx';

export default function Login() {
  const { t } = useI18n();
  return (
    <div className="login">
      <div className="login-card">
        <span className="brand">{BRAND}</span>
        <p>{t('login.text')}</p>
        <Link to="/" className="btn">
          {t('login.back')}
        </Link>
        <LangSwitch />
      </div>
    </div>
  );
}
