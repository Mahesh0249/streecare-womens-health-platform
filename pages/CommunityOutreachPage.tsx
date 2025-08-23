import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';

const CommunityOutreachPage: React.FC = () => {
  const { t } = useTranslation();
  const [isJoining, setIsJoining] = useState(false);
  const [formData, setFormData] = useState({
    ruralAwareness: false,
    pubertyEducation: false,
    menopauseSupport: false,
    availability: '',
    skills: '',
    contactPreference: 'email',
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send formData to your backend API
    console.log('Submitting community outreach form:', formData);
    alert('Thank you for your interest! We will get in touch soon.');
    setIsJoining(false);
    setFormData({
      ruralAwareness: false,
      pubertyEducation: false,
      menopauseSupport: false,
      availability: '',
      skills: '',
      contactPreference: 'email',
    });
  };

  // Mock data for partner organizations
  const partnerOrganizations = [
    {
      id: 1,
      name: t('communityOutreach.org1Name'),
      mission: t('communityOutreach.org1Mission'),
      website: 'https://example.com/org1',
    },
    {
      id: 2,
      name: t('communityOutreach.org2Name'),
      mission: t('communityOutreach.org2Mission'),
      website: 'https://example.com/org2',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-rose-800 mb-8 text-center">{t('communityOutreach.title')}</h1>
      
      <section className="bg-white shadow-lg rounded-xl p-8 mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('communityOutreach.introductionTitle')}</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{t('communityOutreach.introductionText1')}</p>
        <p className="text-gray-700 leading-relaxed mb-8">{t('communityOutreach.introductionText2')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10">
          <div className="bg-rose-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-rose-700 mb-3">{t('communityOutreach.areaRural')}</h3>
            <p className="text-gray-600">{t('communityOutreach.areaRuralDesc')}</p>
          </div>
          <div className="bg-teal-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-teal-700 mb-3">{t('communityOutreach.areaPuberty')}</h3>
            <p className="text-gray-600">{t('communityOutreach.areaPubertyDesc')}</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">{t('communityOutreach.areaMenopause')}</h3>
            <p className="text-gray-600">{t('communityOutreach.areaMenopauseDesc')}</p>
          </div>
        </div>

        {!isJoining ? (
          <div className="text-center">
            <button
              onClick={() => setIsJoining(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {t('communityOutreach.joinButton')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 p-8 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('communityOutreach.joinFormTitle')}</h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-3">{t('communityOutreach.areasOfInterest')}</label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="ruralAwareness"
                    checked={formData.ruralAwareness}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-rose-600"
                  />
                  <span className="ml-2 text-gray-700">{t('communityOutreach.areaRural')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="pubertyEducation"
                    checked={formData.pubertyEducation}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-teal-600"
                  />
                  <span className="ml-2 text-gray-700">{t('communityOutreach.areaPuberty')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="menopauseSupport"
                    checked={formData.menopauseSupport}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">{t('communityOutreach.areaMenopause')}</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="availability" className="block text-gray-700 text-sm font-bold mb-3">
                {t('communityOutreach.availability')}
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder={t('communityOutreach.availabilityPlaceholder')}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-rose-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-3">
                {t('communityOutreach.skills')}
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder={t('communityOutreach.skillsPlaceholder')}
                rows={4}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-rose-500"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="contactPreference" className="block text-gray-700 text-sm font-bold mb-3">
                {t('communityOutreach.contactPreference')}
              </label>
              <select
                id="contactPreference"
                name="contactPreference"
                value={formData.contactPreference}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-rose-500"
              >
                <option value="email">{t('communityOutreach.contactEmail')}</option>
                <option value="phone">{t('communityOutreach.contactPhone')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {t('communityOutreach.submitButton')}
              </button>
              <button
                type="button"
                onClick={() => setIsJoining(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out"
              >
                {t('communityOutreach.cancelButton')}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('communityOutreach.organizationsTitle')}</h2>
        <p className="text-gray-700 leading-relaxed mb-8">{t('communityOutreach.organizationsText')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerOrganizations.map(org => (
            <div key={org.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{org.name}</h3>
              <p className="text-gray-600 mb-4">{org.mission}</p>
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-700 font-semibold transition-colors duration-200"
              >
                {t('communityOutreach.visitWebsite')}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/contact-partnerships" // Placeholder for a potential future partnership contact page
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t('communityOutreach.partnerWithUs')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CommunityOutreachPage;
