/**
 * Priority Detection Service
 *
 * Automatically assigns a priority level to a complaint based on keywords
 * found in the title and description. This runs on the backend ONLY —
 * the client never sets the priority.
 *
 * Priority Rules:
 *   HIGH   → electricity, power, water leak, fire, short circuit, gas leak
 *   MEDIUM → internet, wifi, network, connectivity
 *   LOW    → everything else
 */

const HIGH_PRIORITY_KEYWORDS = [
  'electricity',
  'power',
  'water leak',
  'fire',
  'short circuit',
  'gas leak',
  'electrical',
  'power cut',
  'power outage',
  'flooding',
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'internet',
  'wifi',
  'wi-fi',
  'network',
  'connectivity',
  'lan',
  'broadband',
];

/**
 * Determines priority by scanning the combined text of title + description.
 * Checks HIGH keywords first (since they're more urgent), then MEDIUM.
 * Falls back to LOW if no keywords match.
 *
 * @param {string} title - Complaint title
 * @param {string} description - Complaint description
 * @returns {string} 'High' | 'Medium' | 'Low'
 */
const detectPriority = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // Check for HIGH priority keywords first (safety-critical issues)
  for (const keyword of HIGH_PRIORITY_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'High';
    }
  }

  // Check for MEDIUM priority keywords (service disruptions)
  for (const keyword of MEDIUM_PRIORITY_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'Medium';
    }
  }

  // Default: LOW priority (general/non-urgent issues)
  return 'Low';
};

module.exports = { detectPriority };
