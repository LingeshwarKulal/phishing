import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brand: 'PhishGuard',
      nav: {
        urlChecker: 'URL Checker',
        admin: 'Admin',
        about: 'About'
      },
      urlChecker: {
        title: 'URL Checker',
        subtitle: 'Enter a URL to check if it\'s potentially malicious or safe',
        placeholder: 'Enter URL (e.g., https://example.com)',
        checkButton: 'Check',
        checking: 'Checking...',
        recentChecks: 'Recent Checks',
        noRecentChecks: 'No recent checks',
        securityTips: 'Security Tips',
        tips: {
          https: 'Always check for HTTPS in the URL',
          domain: 'Be wary of misspelled domain names',
          shortened: 'Avoid clicking on shortened URLs'
        }
      },
      results: {
        safe: 'Safe',
        suspicious: 'Suspicious',
        phishing: 'Phishing',
        riskScore: 'Risk Score',
        urlAnalysis: 'URL Analysis',
        securityChecks: 'Security Checks',
        details: {
          length: 'Length',
          specialChars: 'Special Characters',
          numbers: 'Numbers',
          https: 'HTTPS',
          domainAge: 'Domain Age',
          redirects: 'Redirects'
        }
      },
      admin: {
        title: 'Admin Dashboard',
        stats: {
          totalScans: 'Total Scans',
          safeUrls: 'Safe URLs',
          suspiciousUrls: 'Suspicious URLs',
          phishingUrls: 'Phishing URLs'
        },
        domainManagement: {
          title: 'Domain Management',
          blockDomain: 'Block Domain',
          unblockDomain: 'Unblock Domain',
          enterDomain: 'Enter domain',
          enterReason: 'Enter reason',
          block: 'Block',
          unblock: 'Unblock'
        },
        reports: {
          title: 'Recent Reports',
          noReports: 'No reports yet',
          type: {
            falsePositive: 'False Positive',
            confirmedPhishing: 'Confirmed Phishing'
          }
        }
      },
      report: {
        title: 'Report URL',
        description: 'Report this URL if you believe our analysis was incorrect or if you have additional information.',
        type: {
          falsePositive: 'False Positive',
          confirmedPhishing: 'Confirmed Phishing'
        },
        comment: 'Additional Comments (Optional)',
        commentPlaceholder: 'Provide any additional information...',
        submit: 'Submit Report',
        cancel: 'Cancel',
        success: 'Report submitted successfully!'
      },
      install: 'Install App',
      footer: {
        copyright: '© {{year}} PhishGuard. All rights reserved.',
        tagline: 'Protecting you from phishing threats, one URL at a time.'
      }
    }
  },
  es: {
    translation: {
      brand: 'PhishGuard',
      nav: {
        urlChecker: 'Verificador de URL',
        admin: 'Administrador',
        about: 'Acerca de'
      },
      urlChecker: {
        title: 'Verificador de URL',
        subtitle: 'Ingrese una URL para verificar si es potencialmente maliciosa o segura',
        placeholder: 'Ingrese URL (ej., https://example.com)',
        checkButton: 'Verificar',
        checking: 'Verificando...',
        recentChecks: 'Verificaciones Recientes',
        noRecentChecks: 'Sin verificaciones recientes',
        securityTips: 'Consejos de Seguridad',
        tips: {
          https: 'Siempre verifique HTTPS en la URL',
          domain: 'Tenga cuidado con los nombres de dominio mal escritos',
          shortened: 'Evite hacer clic en URLs acortadas'
        }
      },
      // Add more Spanish translations...
    }
  },
  fr: {
    translation: {
      brand: 'PhishGuard',
      nav: {
        urlChecker: 'Vérificateur d\'URL',
        admin: 'Administration',
        about: 'À propos'
      },
      urlChecker: {
        title: 'Vérificateur d\'URL',
        subtitle: 'Entrez une URL pour vérifier si elle est potentiellement malveillante ou sûre',
        placeholder: 'Entrez l\'URL (ex., https://example.com)',
        checkButton: 'Vérifier',
        checking: 'Vérification...',
        recentChecks: 'Vérifications Récentes',
        noRecentChecks: 'Aucune vérification récente',
        securityTips: 'Conseils de Sécurité',
        tips: {
          https: 'Vérifiez toujours le HTTPS dans l\'URL',
          domain: 'Méfiez-vous des noms de domaine mal orthographiés',
          shortened: 'Évitez de cliquer sur les URLs raccourcies'
        }
      },
      // Add more French translations...
    }
  }
  // Add more languages...
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 