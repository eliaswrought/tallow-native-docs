#!/usr/bin/env node
// build.js — generates content.js from all files in ../tallow-native/

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'tallow-native');
const OUTPUT_FILE = path.join(__dirname, 'content.js');

// Files/dirs to skip
const SKIP = ['.DS_Store', '.git', 'node_modules'];

// Folder display names
const FOLDER_LABELS = {
  '01-product': '01 · Product',
  'cad': 'CAD Files',
  'drawings': 'Drawings',
  'models': 'Models',
  '02-sourcing': '02 · Sourcing',
  'alibaba-messages': 'Alibaba Messages',
  '03-brand': '03 · Brand',
  'logo': 'Logo',
  '04-website': '04 · Website',
  'copy': 'Copy',
  'site': 'Live Site',
  '05-marketing': '05 · Marketing',
  'email-sequence': 'Email Sequence',
  'outreach-templates': 'Outreach Templates',
  '06-packaging': '06 · Packaging',
  '07-business': '07 · Business',
  '08-content': '08 · Content',
  'blog-posts': 'Blog Posts',
};

// File display names
const FILE_LABELS = {
  'README.md': 'README — Project Overview',
  'product-spec.md': 'Product Specification',
  'bill-of-materials.csv': 'Bill of Materials',
  'manufacturing-process.md': 'Manufacturing Process',
  'testing-protocol.md': 'Testing Protocol',
  'weight-and-dimensions.md': 'Weight & Dimensions',
  'technical-drawings.md': 'Technical Drawings',
  'model-descriptions.md': 'Model Descriptions',
  'message-01-cast-iron-foundry.md': 'Message 01 — Cast Iron Foundry',
  'message-02-ss-manufacturer.md': 'Message 02 — SS Manufacturer',
  'message-03-combo-factory.md': 'Message 03 — Combo Factory',
  'import-tariff-research.md': 'Import Tariff Research',
  'landed-cost-estimate.csv': 'Landed Cost Estimate',
  'prototyping-timeline.md': 'Prototyping Timeline',
  'supplier-questionnaire.md': 'Supplier Questionnaire',
  'supplier-scorecard.csv': 'Supplier Scorecard',
  'brand-name-research.md': 'Brand Name Research',
  'brand-voice.md': 'Brand Voice',
  'color-palette.md': 'Color Palette',
  'logo-concepts.md': 'Logo Concepts',
  'logo-primary.svg': 'Logo — Primary',
  'logo-badge.svg': 'Logo — Badge',
  'typography.md': 'Typography',
  'website-copy.md': 'Website Copy',
  'faq.md': 'FAQ',
  'seo-plan.csv': 'SEO Plan',
  'index.html': 'Website — Home',
  'about.html': 'Website — About',
  'styles.css': 'Stylesheet',
  'app.js': 'JavaScript',
  'email-01-welcome.md': 'Email 01 — Welcome',
  'email-02-product-deep-dive.md': 'Email 02 — Product Deep Dive',
  'email-03-tallow-catcher.md': 'Email 03 — Tallow Catcher',
  'email-04-first-use.md': 'Email 04 — First Use',
  'email-05-recipes-community.md': 'Email 05 — Recipes & Community',
  'media-outreach-list.csv': 'Media Outreach List',
  'press-release.md': 'Press Release',
  'social-media-posts.md': 'Social Media Posts',
  'video-script-15s.md': 'Video Script — 15 Seconds',
  'video-script-60s.md': 'Video Script — 60 Seconds',
  'template-A-influencer.md': 'Template A — Influencer',
  'template-B-press.md': 'Template B — Press',
  'template-C-product-media.md': 'Template C — Product Media',
  'template-D-organization.md': 'Template D — Organization',
  'template-E-collab.md': 'Template E — Collab',
  'box-artwork.md': 'Box Artwork',
  'box-dieline.md': 'Box Dieline',
  'packaging-copy.md': 'Packaging Copy',
  'product-manual.md': 'Product Manual',
  'quick-start-guide.md': 'Quick-Start Guide',
  'business-plan.md': 'Business Plan',
  'business-registrations.md': 'Business Registrations',
  'financial-forecast.csv': 'Financial Forecast',
  'fulfillment-research.md': 'Fulfillment Research',
  'inventory-tracker.csv': 'Inventory Tracker',
  'pre-order-terms.md': 'Pre-Order Terms',
  'pricing-model.csv': 'Pricing Model',
  'safety-certification-research.md': 'Safety Certification Research',
  'warranty.md': 'Warranty',
  'tallow-donuts-founder-story.md': 'Blog — Tallow Donuts Founder Story',
  'tallow-frying-guide.md': 'Blog — Tallow Frying Guide',
  'tallow-reuse-guide.md': 'Blog — Tallow Reuse Guide',
  'recipe-booklet.md': 'Recipe Booklet',
};

function getLabel(name, isDir) {
  if (isDir) return FOLDER_LABELS[name] || name;
  return FILE_LABELS[name] || name;
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.md') return 'md';
  if (ext === '.csv') return 'csv';
  if (ext === '.svg') return 'svg';
  if (ext === '.html') return 'html';
  if (ext === '.css') return 'css';
  if (ext === '.js') return 'js';
  return 'text';
}

function buildTree(dirPath, relPath = '') {
  const items = fs.readdirSync(dirPath).filter(n => !SKIP.includes(n)).sort();
  const result = [];

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const itemRel = relPath ? `${relPath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const children = buildTree(fullPath, itemRel);
      if (children.length > 0) {
        result.push({
          id: itemRel.replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '-'),
          name: item,
          label: getLabel(item, true),
          type: 'folder',
          path: itemRel,
          children,
        });
      }
    } else {
      const fileType = getFileType(item);
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) {
        content = `[Error reading file: ${e.message}]`;
      }

      result.push({
        id: itemRel.replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '-'),
        name: item,
        label: getLabel(item, false),
        type: fileType,
        path: itemRel,
        content,
      });
    }
  }

  return result;
}

console.log('Building content tree from', SOURCE_DIR);
const rawTree = buildTree(SOURCE_DIR);

// Move README to the very top
const readmeIdx = rawTree.findIndex(n => n.name === 'README.md');
let tree = rawTree;
if (readmeIdx > 0) {
  const [readme] = rawTree.splice(readmeIdx, 1);
  tree = [readme, ...rawTree];
}

const js = `// Auto-generated by build.js — do not edit directly
// Generated: ${new Date().toISOString()}
const SITE_CONTENT = ${JSON.stringify({ tree }, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, js, 'utf8');
console.log(`Written to ${OUTPUT_FILE} (${Math.round(fs.statSync(OUTPUT_FILE).size / 1024)}KB)`);
