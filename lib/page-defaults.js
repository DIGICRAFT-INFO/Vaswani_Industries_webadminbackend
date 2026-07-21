import dbConnect from './db';

export const DEFAULT_PAGES = {
  home: {
    pageKey: 'home', pageLabel: 'Home Page',
    sections: [
      {
        sectionKey: 'hero', sectionLabel: 'Hero Banner', order: 1,
        miniTitle: 'Industrial Strength · Sustainable Energy',
        title: 'Integrated Steel Manufacturer in India with Captive Power & Solar Energy',
        subtitle: '',
        paragraph: 'Vaswani Industries Limited is a leading integrated steel manufacturing company in India producing sponge iron, steel billets, products, forgings, and casting supported by captive thermal power generation and solar energy infrastructure.',
        images: [],
        buttons: [
          { text: 'Explore Our Businesses', url: '/products/sponge-iron', style: 'primary', openNewTab: false },
          { text: 'Investor Relations', url: '/investors/financials', style: 'outline', openNewTab: false },
        ],
      },
      {
        sectionKey: 'about', sectionLabel: 'About Section', order: 2,
        miniTitle: 'About Us',
        title: 'Leading Integrated Steel Manufacturer in Central India',
        subtitle: '',
        paragraph: 'Vaswani Industries Limited is a publicly listed integrated steel manufacturing company headquartered in Central India. The company operates across the steel value chain including sponge iron manufacturing, steel billet production, products, forgings, casting, and captive power generation.',
        images: [],
        buttons: [{ text: 'Discover More', url: '/about/the-company', style: 'primary', openNewTab: false }],
      },
      {
        sectionKey: 'products', sectionLabel: 'Products Section', order: 3,
        miniTitle: 'What We Offer',
        title: 'Our Products',
        subtitle: '',
        paragraph: 'Our leadership assures that we are providing the best quality products possible for our devoted customers.',
        images: [],
        buttons: [],
      },
      {
        sectionKey: 'quote', sectionLabel: 'Quote Banner', order: 4,
        miniTitle: '',
        title: "This is not about creating a giant. It's about creating the sustainability of steel industry.",
        subtitle: '— Vaswani Industries',
        paragraph: '',
        images: [],
        buttons: [],
      },
      {
        sectionKey: 'news', sectionLabel: 'News Section', order: 5,
        miniTitle: 'Latest Updates',
        title: 'News | Media | Events | CSR',
        subtitle: "It's always about the society we serve!",
        paragraph: '',
        images: [],
        buttons: [{ text: 'Read the News', url: '/news', style: 'primary', openNewTab: false }],
      },
      {
        sectionKey: 'stats', sectionLabel: 'Stats Bar', order: 6,
        miniTitle: '',
        title: 'Company Statistics',
        subtitle: '',
        paragraph: '',
        images: [],
        buttons: [],
        extra: {
          stats: [
            { value: '90000', unit: 'MT', label: 'Production and Capacity of Sponge Iron' },
            { value: '150000', unit: 'MT', label: 'Production and Capacity of Billets' },
            { value: '11.5', unit: 'MW', label: 'Production and Capacity of Power' },
            { value: '66.25', unit: 'MW', label: 'Production and Capacity of Solar' },
          ]
        },
      },
    ],
  },
  about: {
    pageKey: 'about', pageLabel: 'About Us',
    sections: [
      {
        sectionKey: 'hero', sectionLabel: 'Page Banner', order: 1,
        miniTitle: '', title: 'About Us', subtitle: '', paragraph: '', images: [], buttons: [],
      },
      {
        sectionKey: 'company', sectionLabel: 'The Company', order: 2,
        miniTitle: 'About Us',
        title: 'Leading Integrated Steel Manufacturer in Central India',
        subtitle: '',
        paragraph: 'Vaswani Industries Limited is a publicly listed integrated steel manufacturing company headquartered in Central India.',
        paragraph2: 'With modern induction furnace operations, energy-efficient manufacturing systems, and solar energy integration, Vaswani Industries supports infrastructure, engineering, and industrial sectors across India.',
        images: [],
        buttons: [{ text: 'Explore Our Products', url: '/products/sponge-iron', style: 'primary', openNewTab: false }],
      },
      {
        sectionKey: 'chairmans_message', sectionLabel: "Chairman's Message", order: 3,
        miniTitle: "Chairman's Message",
        title: 'We are a very subtle organization and we like to create examples from our work.',
        subtitle: '',
        paragraph: 'Over the last two decades the company has continuously diversified its product portfolio to include many customized value added products.',
        images: [],
        buttons: [{ text: 'Explore Our Businesses', url: '/products/sponge-iron', style: 'primary', openNewTab: false }],
      },
      {
        sectionKey: 'vision', sectionLabel: 'Vision', order: 4,
        miniTitle: 'Our Vision',
        title: 'Vision',
        paragraph: 'To be the most trusted, responsible, and sustainable integrated steel manufacturing company in India.',
        images: [], buttons: [],
      },
      {
        sectionKey: 'mission', sectionLabel: 'Mission', order: 5,
        miniTitle: 'Our Mission',
        title: 'Mission',
        paragraph: 'To deliver high-quality steel products through efficient processes, continuous innovation, and a commitment to the well-being of our employees, customers, and communities.',
        images: [], buttons: [],
      },
    ],
  },
  products: {
    pageKey: 'products', pageLabel: 'Our Products',
    sections: [
      { sectionKey: 'hero', sectionLabel: 'Page Banner', order: 1, title: 'Products', images: [], buttons: [] },
      {
        sectionKey: 'forging', sectionLabel: 'Forging Ingots & Billets', order: 2,
        miniTitle: 'Forging Ingots & Billets',
        title: 'High-Quality MS Alloy Ingots & Billets',
        paragraph: 'We produce Forging Quality Ingots of different grades and sizes, with a specialized capacity of 6000 MT. Our expertise includes grades like En-8, En-9, En-24, C-45 and more.',
        images: [], buttons: [{ text: 'Download Product Catalog', url: '#', style: 'dark', openNewTab: false }],
        extra: { quickFact: 'Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.' },
      },
      {
        sectionKey: 'sponge_iron', sectionLabel: 'Sponge Iron (DRI)', order: 3,
        miniTitle: 'Direct Reduced Iron (DRI)',
        title: 'Sponge Iron',
        paragraph: 'Sponge iron, also known as Direct Reduced Iron (DRI), is the product of reducing iron oxide in the form of iron ore into metallic iron.',
        images: [], buttons: [{ text: 'Download Product Catalog', url: '#', style: 'dark', openNewTab: false }],
        extra: { quickFact: 'Vaswani Industries Limited is the largest producer of Sponge Iron in Central India.' },
      },
      {
        sectionKey: 'power', sectionLabel: 'Power Generation', order: 4,
        miniTitle: 'Captive Power Generation',
        title: 'Power Generation',
        paragraph: 'Vaswani Industries operates a captive thermal power plant and solar energy infrastructure to support all manufacturing operations.',
        images: [], buttons: [],
      },
    ],
  },
  news: {
    pageKey: 'news', pageLabel: 'News & Media',
    sections: [
      { sectionKey: 'hero', sectionLabel: 'Page Banner', order: 1, title: 'News & Media', images: [], buttons: [] },
      {
        sectionKey: 'intro', sectionLabel: 'Section Header', order: 2,
        miniTitle: 'Latest News',
        title: 'News & Media',
        subtitle: 'Stay updated with the latest news, events and CSR activities.',
        images: [], buttons: [],
      },
    ],
  },
  investors: {
    pageKey: 'investors', pageLabel: 'Investors',
    sections: [
      { sectionKey: 'hero', sectionLabel: 'Page Banner', order: 1, title: 'Investors', images: [], buttons: [] },
      {
        sectionKey: 'intro', sectionLabel: 'Section Header', order: 2,
        miniTitle: 'Investor Relations',
        title: 'Investor Relations',
        subtitle: 'BSE Listed Company — CIN: L27106CT1994PLC007401',
        paragraph: 'Access all financial documents, disclosures, and regulatory filings of Vaswani Industries Limited.',
        images: [], buttons: [],
      },
    ],
  },
  careers: {
    pageKey: 'careers', pageLabel: 'Careers',
    sections: [
      { sectionKey: 'hero', sectionLabel: 'Page Banner', order: 1, title: 'Careers', images: [], buttons: [] },
      {
        sectionKey: 'intro', sectionLabel: 'Section Header', order: 2,
        miniTitle: 'Join Our Team',
        title: 'Apply For Work',
        subtitle: 'Manpower Requisition & Job Application',
        paragraph: 'Join one of Central India\'s leading steel manufacturers. We offer growth, stability and a collaborative work environment.',
        images: [],
        buttons: [
          { text: 'View Open Positions', url: '#positions', style: 'primary', openNewTab: false },
        ],
      },
    ],
  },
};

export async function getOrSeedPage(pageKey) {
  await dbConnect();
  const PageContent = require('../models/PageContent');
  let page = await PageContent.findOne({ pageKey });
  if (!page && DEFAULT_PAGES[pageKey]) {
    page = await PageContent.create(DEFAULT_PAGES[pageKey]);
  }
  return page;
}
