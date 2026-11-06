import type { LocalizedText } from '@/i18n';

/**
 * States and union territories of India, with UdyamSetu programme data for each.
 *
 * No state-level figures have been supplied yet, so every entry has status 'pending'.
 * To publish data for a state:
 *   1. Fill in the verified values in `data` (trainers, beneficiaries, programmes, activity).
 *   2. Add asOf (YYYY-MM-DD) and source.
 *   3. Change status to 'published'.
 * Never estimate a figure. Leave a field out when it is not verified.
 *
 * Codes are ISO 3166-2:IN subdivision codes without the "IN-" prefix.
 * Regions follow the Zonal Councils of India. Andaman and Nicobar Islands and Lakshadweep are grouped as islands.
 */
export type Region = 'north' | 'central' | 'east' | 'west' | 'south' | 'northeast' | 'islands';

export type StateData = {
  status: 'pending' | 'published';
  trainers?: number;
  beneficiaries?: number;
  /** Programmes active in the state, for example "Training the Trainers". */
  programmes?: LocalizedText[];
  /** Short description of regional activity. */
  activity?: LocalizedText;
  asOf?: string;
  source?: LocalizedText;
};

export type StateRecord = {
  code: string;
  name: LocalizedText;
  type: 'state' | 'union-territory';
  region: Region;
  data: StateData;
};

const pending: StateData = { status: 'pending' };

export const indiaStates: StateRecord[] = [
  { code: 'AN', name: { en: 'Andaman and Nicobar Islands', hi: 'अंडमान और निकोबार द्वीपसमूह' }, type: 'union-territory', region: 'islands', data: pending },
  { code: 'AP', name: { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' }, type: 'state', region: 'south', data: pending },
  { code: 'AR', name: { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश' }, type: 'state', region: 'northeast', data: pending },
  { code: 'AS', name: { en: 'Assam', hi: 'असम' }, type: 'state', region: 'northeast', data: pending },
  { code: 'BR', name: { en: 'Bihar', hi: 'बिहार' }, type: 'state', region: 'east', data: pending },
  { code: 'CH', name: { en: 'Chandigarh', hi: 'चंडीगढ़' }, type: 'union-territory', region: 'north', data: pending },
  { code: 'CG', name: { en: 'Chhattisgarh', hi: 'छत्तीसगढ़' }, type: 'state', region: 'central', data: pending },
  { code: 'DH', name: { en: 'Dadra and Nagar Haveli and Daman and Diu', hi: 'दादरा और नगर हवेली और दमन और दीव' }, type: 'union-territory', region: 'west', data: pending },
  { code: 'DL', name: { en: 'Delhi', hi: 'दिल्ली' }, type: 'union-territory', region: 'north', data: pending },
  { code: 'GA', name: { en: 'Goa', hi: 'गोवा' }, type: 'state', region: 'west', data: pending },
  { code: 'GJ', name: { en: 'Gujarat', hi: 'गुजरात' }, type: 'state', region: 'west', data: pending },
  { code: 'HR', name: { en: 'Haryana', hi: 'हरियाणा' }, type: 'state', region: 'north', data: pending },
  { code: 'HP', name: { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश' }, type: 'state', region: 'north', data: pending },
  { code: 'JK', name: { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर' }, type: 'union-territory', region: 'north', data: pending },
  { code: 'JH', name: { en: 'Jharkhand', hi: 'झारखंड' }, type: 'state', region: 'east', data: pending },
  { code: 'KA', name: { en: 'Karnataka', hi: 'कर्नाटक' }, type: 'state', region: 'south', data: pending },
  { code: 'KL', name: { en: 'Kerala', hi: 'केरल' }, type: 'state', region: 'south', data: pending },
  { code: 'LA', name: { en: 'Ladakh', hi: 'लद्दाख' }, type: 'union-territory', region: 'north', data: pending },
  { code: 'LD', name: { en: 'Lakshadweep', hi: 'लक्षद्वीप' }, type: 'union-territory', region: 'islands', data: pending },
  { code: 'MP', name: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' }, type: 'state', region: 'central', data: pending },
  { code: 'MH', name: { en: 'Maharashtra', hi: 'महाराष्ट्र' }, type: 'state', region: 'west', data: pending },
  { code: 'MN', name: { en: 'Manipur', hi: 'मणिपुर' }, type: 'state', region: 'northeast', data: pending },
  { code: 'ML', name: { en: 'Meghalaya', hi: 'मेघालय' }, type: 'state', region: 'northeast', data: pending },
  { code: 'MZ', name: { en: 'Mizoram', hi: 'मिज़ोरम' }, type: 'state', region: 'northeast', data: pending },
  { code: 'NL', name: { en: 'Nagaland', hi: 'नागालैंड' }, type: 'state', region: 'northeast', data: pending },
  { code: 'OD', name: { en: 'Odisha', hi: 'ओडिशा' }, type: 'state', region: 'east', data: pending },
  { code: 'PY', name: { en: 'Puducherry', hi: 'पुदुचेरी' }, type: 'union-territory', region: 'south', data: pending },
  { code: 'PB', name: { en: 'Punjab', hi: 'पंजाब' }, type: 'state', region: 'north', data: pending },
  { code: 'RJ', name: { en: 'Rajasthan', hi: 'राजस्थान' }, type: 'state', region: 'north', data: pending },
  { code: 'SK', name: { en: 'Sikkim', hi: 'सिक्किम' }, type: 'state', region: 'northeast', data: pending },
  { code: 'TN', name: { en: 'Tamil Nadu', hi: 'तमिलनाडु' }, type: 'state', region: 'south', data: pending },
  { code: 'TG', name: { en: 'Telangana', hi: 'तेलंगाना' }, type: 'state', region: 'south', data: pending },
  { code: 'TR', name: { en: 'Tripura', hi: 'त्रिपुरा' }, type: 'state', region: 'northeast', data: pending },
  { code: 'UP', name: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' }, type: 'state', region: 'central', data: pending },
  { code: 'UK', name: { en: 'Uttarakhand', hi: 'उत्तराखंड' }, type: 'state', region: 'central', data: pending },
  { code: 'WB', name: { en: 'West Bengal', hi: 'पश्चिम बंगाल' }, type: 'state', region: 'east', data: pending },
];
