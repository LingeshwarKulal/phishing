import { useState } from 'react';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  CodeBracketIcon,
  BeakerIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <div className="flex-shrink-0">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const TechnologyCard = ({ icon: Icon, name, description, link }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
      >
        Learn more
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
      </a>
    )}
  </div>
);

const StatCard = ({ value, label, description }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{label}</div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Advanced URL Analysis",
    description: "Comprehensive security checks including domain analysis, SSL verification, and phishing pattern detection."
  },
  {
    icon: ChartBarIcon,
    title: "Risk Assessment",
    description: "Detailed risk scoring system that evaluates multiple security factors to determine threat levels."
  },
  {
    icon: CpuChipIcon,
    title: "Machine Learning",
    description: "Advanced algorithms to detect sophisticated phishing attempts and evolving threats."
  },
  {
    icon: BeakerIcon,
    title: "Real-time Analysis",
    description: "Instant URL analysis with immediate feedback and detailed security recommendations."
  }
];

const technologies = [
  {
    icon: CodeBracketIcon,
    name: "React.js",
    description: "Modern frontend framework for building responsive and interactive user interfaces.",
    link: "https://react.dev"
  },
  {
    icon: ServerIcon,
    name: "FastAPI",
    description: "High-performance Python backend framework for robust API development.",
    link: "https://fastapi.tiangolo.com"
  }
];

const PhishingStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
      value="300K+"
      label="Phishing Sites"
      description="New phishing sites created monthly"
    />
    <StatCard
      value="$4.2B"
      label="Financial Impact"
      description="Annual losses due to phishing attacks"
    />
    <StatCard
      value="96%"
      label="Attack Vector"
      description="Of attacks start with phishing emails"
    />
  </div>
);

const SecurityChecklist = () => {
  const [checks] = useState([
    { label: "HTTPS Verification", done: true },
    { label: "Domain Age Check", done: true },
    { label: "SSL Certificate Analysis", done: true },
    { label: "Phishing Pattern Detection", done: true },
    { label: "Redirect Chain Analysis", done: true },
    { label: "Suspicious TLD Check", done: true },
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Checks</h3>
      <div className="grid gap-3">
        {checks.map((check, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About PhishGuard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          PhishGuard is an advanced cybersecurity tool designed to protect users from phishing
          threats through real-time URL analysis and comprehensive security checks.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Phishing Threat Landscape
        </h2>
        <PhishingStats />
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technologies.map((tech, index) => (
            <TechnologyCard key={index} {...tech} />
          ))}
        </div>
      </div>

      {/* Security Checklist */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Security Capabilities
        </h2>
        <SecurityChecklist />
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Start Protecting Yourself Today
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Use PhishGuard to check suspicious URLs and protect yourself from phishing attacks.
          Our advanced analysis helps you make informed decisions about website safety.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Try URL Checker
        </a>
      </div>
    </div>
  );
} 