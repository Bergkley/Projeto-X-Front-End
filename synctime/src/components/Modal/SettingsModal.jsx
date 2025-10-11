import { useState } from 'react';
import { X, User, Shield, Palette, Lock } from 'lucide-react';
import styles from './SettingsModal.module.css';
import ProfileSection from '../settings/SectionConfig/ProfileSection';
import AccountSection from '../settings/SectionConfig/AccountSection';
import AppearanceSection from '../settings/SectionConfig/AppearanceSection';
import PrivacySection from '../settings/SectionConfig/PrivacySection';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('profile');

  if (!isOpen) return null;

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'account', label: 'Conta', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'privacy', label: 'Privacidade', icon: Lock }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'account':
        return <AccountSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'privacy':
        return <PrivacySection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>Configurações</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.sidebar}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`${styles.sidebarItem} ${
                    activeSection === section.id ? styles.active : ''
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={20} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.contentArea}>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
