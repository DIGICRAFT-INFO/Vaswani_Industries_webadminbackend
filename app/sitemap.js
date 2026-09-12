const BASE_URL = 'https://vaswaniindustries.com';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: BASE_URL,                                              changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about/the-company`,                      changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about/board-of-directors`,               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about/chairmans-message`,                changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about/committees`,                       changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about/familiarization-programme`,        changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/products`,                               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/investors/financials`,                   changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/investors/documents`,                    changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/investors/disclosures`,                  changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/investors/policies`,                     changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/investors/listing-information`,          changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/investors/sebi-disclosure`,              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/investors/others`,                       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/careers`,                                changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/news`,                                   changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/contact`,                                changeFrequency: 'yearly',  priority: 0.6 },
  ];

  return staticRoutes.map((route) => ({
    ...route,
    lastModified: now,
  }));
}
