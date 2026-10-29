import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ORIGIN = 'https://laundary.online';
const ROOT = resolve(process.cwd());

export const LAUNDRY_LANGUAGES = [
  {
    code: 'hi',
    hreflang: 'hi-IN',
    name: 'हिन्दी',
    englishName: 'Hindi',
    path: '/hi/',
    metaTitle: 'कपड़े ड्राई क्लीन करने वाला मेरे पास | Doorstep Dry Cleaning & Laundry Free Pickup',
    metaDesc: 'घर बैठे कपड़े ड्राई क्लीनिंग, वॉश एंड फोल्ड और स्टीम आयरन। ghar se kapde dry clean karwane wala pass me. फ्री पिकअप और ड्रॉप। सिल्क साड़ी, सूट और कंबल।',
    h1: 'कपड़े ड्राई क्लीन करने वाला मेरे पास (Doorstep Dry Cleaning)',
    tagline: 'घर बैठे ड्राई क्लीनिंग और कपड़े धोने की सर्विस - फ्री पिकअप और 24-48 घंटे में डिलीवरी',
    voiceAnswerLead: 'laundry.online आपके घर से कपड़े पिकअप करके प्रोफेशनल ड्राई क्लीनिंग, वॉश एंड फोल्ड (Wash & Fold), और स्टीम आयरन की सुविधा प्रदान करता है। Banarasi सिल्क साड़ी, कोट-पैंट, भारी कंबल और रोजमर्रा के कपड़े किलो के भाव (₹79/किलो) पर धोए जाते हैं। फ्री होम पिकअप और 24 से 48 घंटे में डिलीवरी उपलब्ध है।',
    pricingLead: 'साड़ी ड्राई क्लीन ₹199 से, सूट/ब्लेजर ₹249 से, किलो लांड्री ₹79/किलो से। फ्री होम पिकअप।',
    whatsappText: 'नमस्ते laundry.online, मुझे कपड़े ड्राई क्लीनिंग और लांड्री पिकअप बुक करना है।',
    textSearchKeywords: 'ghar se kapde dry clean karwane wala pass me, saree dry clean ka kitna charge hota hai, kilo ke hisab se kapde dhone wali laundry, silk saree dry clean me kharab toh nahi hogi, 24 ghante me dry clean kapde, online dry cleaning services bangalore',
    typedSearches: [
      {
        romanQuery: 'ghar se kapde dry clean karwane wala pass me',
        nativeQuery: 'घर से कपड़े ले जाकर ड्राई क्लीन करने वाली सर्विस कौन सी है?',
        answer: 'laundry.online फ्री डोरस्टेप पिकअप और ड्रॉप के साथ पूरे शहर में 60 मिनट के अंदर कपड़े पिकअप करने की सुविधा देती है।'
      },
      {
        romanQuery: 'saree dry clean ka kitna charge hota hai',
        nativeQuery: 'साड़ी और सूट ड्राई क्लीनिंग का रेट कितना है?',
        answer: 'सिल्क साड़ी ड्राई क्लीन ₹199 से, मेंस सूट/ब्लेजर ₹249 से, और नॉर्मल कपड़े किलो के हिसाब से ₹79/किलो से शुरू होते हैं।'
      },
      {
        romanQuery: 'silk saree dry clean me kharab toh nahi hogi',
        nativeQuery: 'क्या सिल्क साड़ी या महंगे कपड़े ड्राई क्लीन में सुरक्षित रहते हैं?',
        answer: 'बिल्कुल! laundry.online प्रीमियम इको-फ्रेंडली सॉल्वैंट्स और फैब्रिक-सेफ जेंटल प्रोसेस का उपयोग करती है, जिससे कपड़ों की चमक और रंग सुरक्षित रहते हैं।'
      },
      {
        romanQuery: '24 ghante me dry clean kapde milenge kya urgent',
        nativeQuery: '24 घंटे में अर्जेंट डिलीवरी मिल सकती है क्या?',
        answer: 'हाँ, हमारी Express 24-Hour सर्विस के तहत आपके कपड़े 24 घंटे में धोकर, स्टीम प्रेस करके डिलीवर कर दिए जाते हैं।'
      },
      {
        romanQuery: 'laundry dry clean pickup kaise book kare',
        nativeQuery: 'पिकअप कैसे बुक करें?',
        answer: 'वेबसाइट या व्हाट्सएप पर सिर्फ अपना पता और समय चुनकर 20 सेकंड में पिकअप बुक करें।'
      }
    ]
  },
  {
    code: 'kn',
    hreflang: 'kn-IN',
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    path: '/kn/',
    metaTitle: 'ಮನೆ ಬಾಗಿಲಿಗೆ ಬರುವ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಸೇವೆ | Doorstep Dry Cleaning Bangalore Free Pick & Drop',
    metaDesc: 'ಮನೆ ಬಾಗಿಲಿಗೆ ಬಂದು ಬಟ್ಟೆ ಒಯ್ಯುವ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಮತ್ತು ಲಾಂಡ್ರಿ ಸೇವೆ. dry cleaning mane baagilige baro service. ಉಚಿತ ಪಿಕಪ್ ಮತ್ತು ಡೆಲಿವರಿ. ಸೀರೆ, ಸೂಟ್.',
    h1: 'ಮನೆ ಬಾಗಿಲಿಗೆ ಬರುವ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಸೇವೆ (Doorstep Dry Cleaning)',
    tagline: 'ಮನೆ ಬಾಗಿಲಿಗೆ ಬಂದು ಬಟ್ಟೆ ಒಯ್ದು ಡ್ರೈ ಕ್ಲೀನ್ ಮಾಡಿ ತಲುಪಿಸುವ ಸೇವೆ - ಉಚಿತ ಪಿಕಪ್ &amp; ಡ್ರಾಪ್',
    voiceAnswerLead: 'laundry.online ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ಬಂದು ಬಟ್ಟೆಗಳನ್ನು ಪಡೆದು ಪ್ರೊಫೆಷನಲ್ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್, ವಾಶ್ & ಫೋಲ್ಡ್ ಮತ್ತು ಸ್ಟೀಮ್ ಐರನ್ ಸೇವೆ ನೀಡುತ್ತದೆ. ರೇಷ್ಮೆ ಸೀರೆಗಳು, ಸೂಟ್, ಬ್ಲೇಜರ್ ಮತ್ತು ದಿನಬಳಕೆಯ ಬಟ್ಟೆಗಳು ಕಿಲೋ ಲೆಕ್ಕದಲ್ಲಿ (₹79/ಕೆಜಿ) ಲಭ್ಯ. ಉಚಿತ ಹೋಮ್ ಪಿಕಪ್ ಮತ್ತು 24-48 ಗಂಟೆಗಳಲ್ಲಿ ಡೆಲಿವರಿ.',
    pricingLead: 'ಸೀರೆ ಡ್ರೈ ಕ್ಲೀನ್ ₹199 ರಿಂದ, ಸೂಟ್ ₹249 ರಿಂದ, ಕಿಲೋ ಲಾಂಡ್ರಿ ₹79/ಕೆಜಿ. ಉಚಿತ ಪಿಕಪ್.',
    whatsappText: 'ನಮಸ್ಕಾರ laundry.online, ನನಗೆ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಬಟ್ಟೆ ಪಿಕಪ್ ಬುಕ್ ಮಾಡಬೇಕು.',
    textSearchKeywords: 'dry cleaning mane baagilige baro service, saree dry clean ge estu charge madtara, kilo lekkadalli batti ogyo laundry bangalore, doorstep dry cleaning bangalore hsr layout, suit dry cleaning rate list',
    typedSearches: [
      {
        romanQuery: 'dry cleaning mane baagilige baro service bangalore',
        nativeQuery: 'ಮನೆ ಬಾಗಿಲಿಗೆ ಬಂದು ಬಟ್ಟೆ ಒಯ್ಯುವ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಸೇವೆ ಯಾವುದು?',
        answer: 'laundry.online ಬೆಂಗಳೂರಿನಾದ್ಯಂತ ಮನೆ ಬಾಗಿಲಿಗೆ ಬಂದು ಉಚಿತವಾಗಿ ಬಟ್ಟೆ ಸಂಗ್ರಹಿಸಿ ಡ್ರೈ ಕ್ಲೀನ್ ಮಾಡಿ ನೀಡುತ್ತದೆ.'
      },
      {
        romanQuery: 'saree dry clean ge estu charge madtara',
        nativeQuery: 'ಸೀರೆ ಮತ್ತು ಸೂಟ್ ಡ್ರೈ ಕ್ಲೀನಿಂಗ್ ಚಾರ್ಜ್ ಎಷ್ಟು?',
        answer: 'ರೇಷ್ಮೆ ಸೀರೆ ₹199 ರಿಂದ, ಸೂಟ್/ಬ್ಲೇಜರ್ ₹249 ರಿಂದ ಮತ್ತು ಕಿಲೋ ಲೆಕ್ಕದ ಲಾಂಡ್ರಿ ₹79/ಕೆಜಿಯಿಂದ ಪ್ರಾರಂಭ.'
      },
      {
        romanQuery: 'battige damage aagade safe aagi dry clean madtara',
        nativeQuery: 'ಬಟ್ಟೆಗಳಿಗೆ ಹಾನಿಯಾಗದಂತೆ ಸುರಕ್ಷಿತವಾಗಿ ತೊಳೆಯಲಾಗುತ್ತದೆಯೇ?',
        answer: 'ಹೌದು, ಪ್ರೀಮಿಯಂ ಪರಿಸರ ಸ್ನೇಹಿ ರಾಸಾಯನಿಕಗಳನ್ನು ಬಳಸಿ ವಸ್ತ್ರಗಳಿಗೆ ಯಾವುದೇ ಹಾನಿಯಾಗದಂತೆ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ.'
      },
      {
        romanQuery: '24 ganteyalli express dry clean delivery ideya',
        nativeQuery: '24 ಗಂಟೆಗಳಲ್ಲಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ ಲಭ್ಯವಿದೆಯೇ?',
        answer: 'ಹೌದು, ತುರ್ತು ಅಗತ್ಯವಿದ್ದಲ್ಲಿ 24 ಗಂಟೆಗಳ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ ಸೇವೆ ಲಭ್ಯವಿದೆ.'
      },
      {
        romanQuery: 'laundry pickup booking maduvudu hege',
        nativeQuery: 'ಬುಕಿಂಗ್ ಹೇಗೆ ಮಾಡುವುದು?',
        answer: 'ವಾಟ್ಸಾಪ್ ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಕೇವಲ 20 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ ಪಿಕಪ್ ಬುಕ್ ಮಾಡಬಹುದು.'
      }
    ]
  },
  {
    code: 'ta',
    hreflang: 'ta-IN',
    name: 'தமிழ்',
    englishName: 'Tamil',
    path: '/ta/',
    metaTitle: 'வீட்டிற்கே வரும் டிரை கிளீனிங் சர்வீஸ் | Doorstep Dry Cleaning & Laundry Free Pickup',
    metaDesc: 'வீட்டிற்கே வந்து துணி எடுத்துச் செல்லும் டிரை கிளீனிங் மற்றும் லாண்ட்ரி. veetukke vandhu dry clean panna kapada eduppangala. இலவச பிக்கப் & டெலிவரி.',
    h1: 'வீட்டிற்கே வரும் டிரை கிளீனிங் சர்வீஸ் (Doorstep Dry Cleaning)',
    tagline: 'வீட்டிற்கே வந்து துணிகளை எடுத்து டிரை கிளீன் செய்து தரும் சேவை - இலவச பிக்கப் &amp; டெலிவரி',
    voiceAnswerLead: 'laundry.online உங்கள் வீட்டிற்கே வந்து துணிகளை பெற்று தொழில்முறை டிரை கிளீனிங், வாஷ் & போல்ட் மற்றும் ஸ்டீம் அயர்ன் செய்து தருகிறது. பட்டுப்புடவைகள், சூட், பிளேசர் மற்றும் அன்றாட துணிகள் கிலோ கணக்கில் (₹79/கிலோ) துவைக்கப்படும். இலவச பிக்கப் மற்றும் 24-48 மணி நேரத்தில் டெலிவரி.',
    pricingLead: 'பட்டுப்புடவை டிரை கிளீன் ₹199 முதல், சூட் ₹249 முதல், கிலோ லாண்ட்ரி ₹79/கிலோ.',
    whatsappText: 'வணக்கம் laundry.online, எனக்கு டிரை கிளீனிங் பிக்கப் புக் செய்ய வேண்டும்.',
    textSearchKeywords: 'veetukke vandhu dry clean panna kapada eduppangala, silk saree dry clean charge evvalo aagum, kilo kanakula thuni thovaikkira laundry chennai, doorstep dry cleaning chennai omr',
    typedSearches: [
      {
        romanQuery: 'veetukke vandhu thuni edukkura dry cleaning shop chennai',
        nativeQuery: 'வீட்டிற்கே வந்து துணி எடுத்துச் செல்லும் டிரை கிளீனிங் கடை எது?',
        answer: 'laundry.online உங்கள் வீட்டின் வாசலுக்கே வந்து இலவசமாக துணிகளை எடுத்து டிரை கிளீன் செய்து மீண்டும் தரும்.'
      },
      {
        romanQuery: 'silk saree dry clean kooli evvalo aagum',
        nativeQuery: 'டிரை கிளீனிங் கட்டணம் எவ்வளவு?',
        answer: 'பட்டுப்புடவை ₹199 முதல், சூட் ₹249 முதல், எடை கணக்கில் துணி துவைக்க ₹79/கிலோ மட்டுமே.'
      },
      {
        romanQuery: 'pattu pudavai paazhagama safe aa irukkuma',
        nativeQuery: 'பட்டுப்புடவை பாழாகாமல் பாதுகாப்பாக இருக்குமா?',
        answer: 'ஆம், துணிகளுக்கு பாதுகாப்பான உயர் ரக முறைகளை மட்டுமே பயன்படுத்துகிறோம்.'
      },
      {
        romanQuery: '24 mani nerathula express delivery irukka',
        nativeQuery: '24 மணி நேரத்தில் டெலிவரி கிடைக்குமா?',
        answer: 'ஆம், எக்ஸ்பிரஸ் 24 மணி நேர டெலிவரி சேவை உள்ளது.'
      },
      {
        romanQuery: 'laundry pickup eppadi book panradhu',
        nativeQuery: 'முன்பதிவு செய்வது எப்படி?',
        answer: 'வாட்ஸ்அப் அல்லது இணையதளத்தில் 20 வினாடிகளில் முகவரியை பதிவு செய்து புக் செய்யலாம்.'
      }
    ]
  },
  {
    code: 'te',
    hreflang: 'te-IN',
    name: 'తెలుగు',
    englishName: 'Telugu',
    path: '/te/',
    metaTitle: 'ఇంటికి వచ్చి బట్టలు తీసుకెళ్లే డ్రై క్లీనింగ్ | Doorstep Dry Cleaning Free Pick & Drop',
    metaDesc: 'ఇంటి వద్దకే వచ్చి బట్టలు తీసుకెళ్లే ప్రొఫెషనల్ డ్రై క్లీనింగ్ మరియు లాండ్రీ. dry cleaning intiki vachi teesukelle service. ఉచిత పికప్ & డెలివరీ.',
    h1: 'ఇంటికి వచ్చి బట్టలు తీసుకెళ్లే డ్రై క్లీనింగ్ (Doorstep Dry Cleaning)',
    tagline: 'ఇంటి వద్దకే వచ్చి బట్టలు డ్రై క్లీన్ చేసి తెచ్చిచ్చే సర్వీస్ - ఉచిత పికప్ &amp; డ్రాప్',
    voiceAnswerLead: 'laundry.online మీ ఇంటి వద్దకే వచ్చి బట్టలు సేకరించి ప్రొఫెషనల్ డ్రై క్లీనింగ్, వాష్ & ఫోల్డ్ మరియు స్టీమ్ ఐరన్ సర్వీస్ అందిస్తుంది. పట్టుచీరలు, కోట్లు, సూట్లు మరియు రోజువారీ దుస్తులు కిలోల లెక్కన (₹79/కిలో) శుభ్రం చేయబడతాయి. ఉచిత పికప్ మరియు 24-48 గంటల్లో డెలివరీ.',
    pricingLead: 'పట్టుచీర డ్రై క్లీన్ ₹199 నుండి, సూట్ ₹249 నుండి, కిలో లాండ్రీ ₹79/కిలో.',
    whatsappText: 'నమస్కారం laundry.online, డ్రై క్లీనింగ్ బట్టల పికప్ బుక్ చేయాలి.',
    textSearchKeywords: 'dry cleaning intiki vachi teesukelle service, pattu cheera dry cleaning charge entha, kilo chappuna battalu uthike laundry hyderabad, doorstep dry cleaning gachibowli, same day dry clean hyderabad',
    typedSearches: [
      {
        romanQuery: 'dry cleaning intiki vachi teesukelle service hyderabad',
        nativeQuery: 'ఇంటి వద్దకే వచ్చి బట్టలు తీసుకెళ్లే డ్రై క్లీనింగ్ సర్వీస్ ఏది?',
        answer: 'laundry.online మీ ఇంటి వద్దకే వచ్చి ఉచితంగా బట్టలు పికప్ చేసుకుని డ్రై క్లీన్ చేసి తిరిగి అందజేస్తుంది.'
      },
      {
        romanQuery: 'pattu cheera dry clean charges entha untundhi',
        nativeQuery: 'డ్రై క్లీనింగ్ ధరలు ఎంత ఉంటాయి?',
        answer: 'పట్టుచీర ₹199 నుండి, బ్లేజర్/సూట్ ₹249 నుండి, కిలో బట్టలు ₹79/కిలో నుండి ప్రారంభం.'
      },
      {
        romanQuery: 'kharidaina battalu safe ga untaya dry clean lo',
        nativeQuery: 'ఖరీదైన బట్టలు సురక్షితంగా ఉంటాయా?',
        answer: 'ఖచ్చితంగా, నాణ్యమైన పద్ధతుల ద్వారా ఫ్యాబ్రిక్ రంగు, మెరుపు తగ్గకుండా జాగ్రత్త వహిస్తాము.'
      },
      {
        romanQuery: '24 gantallo urgent dry clean delivery chesthara',
        nativeQuery: '24 గంటల్లో అర్జెంట్ డెలివరీ సాధ్యమా?',
        answer: 'అవును, ఎక్స్‌ప్రెస్ 24 గంటల సర్వీస్ ద్వారా వేగంగా పొందవచ్చు.'
      },
      {
        romanQuery: 'laundry pickup ela book chesukovali online',
        nativeQuery: 'పికప్ ఎలా బుక్ చేసుకోవాలి?',
        answer: 'వెబ్‌సైట్ లేదా వాట్సాప్ ద్వారా సులభంగా బుక్ చేసుకోవచ్చు.'
      }
    ]
  },
  {
    code: 'mr',
    hreflang: 'mr-IN',
    name: 'मराठी',
    englishName: 'Marathi',
    path: '/mr/',
    metaTitle: 'घरातून कपडे नेऊन ड्राय क्लीन करणारी सेवा | Doorstep Dry Cleaning Free Pickup',
    metaDesc: 'घरपोच ड्राय क्लीनिंग, वॉश आणि फोल्ड व स्टीम इस्त्री. gharun kapde dry clean karun denari service mumbai. मोफत पिकअप आणि डिलिव्हरी.',
    h1: 'घरातून कपडे नेऊन ड्राय क्लीन करणारी सेवा (Doorstep Dry Cleaning)',
    tagline: 'घरी येऊन कपडे नेऊन ड्राय क्लीन करून आणून देणारी सेवा - मोफत पिकअप आणि ड्रॉप',
    voiceAnswerLead: 'laundry.online तुमच्या घरून कपडे पिकअप करून व्यावसायिक ड्राय क्लीनिंग, वॉश अँड फोल्ड आणि स्टीम इस्त्रीची सेवा देते. पैठणी व सिल्क साड्या, सूट, ब्लँकेट्स आणि दैनंदिन कपडे किलोच्या भावात (₹७९/किलो) धुतले जातात. मोफत होम पिकअप आणि २४ ते ४८ तासांत डिलिव्हरी.',
    pricingLead: 'साडी ड्राय क्लीन ₹१९९, सूट ₹२४९, किलो लाँड्री ₹७९/किलो. मोफत पिकअप.',
    whatsappText: 'नमस्कार laundry.online, मला कपडे ड्राय क्लीनिंगसाठी पिकअप बुक करायचे आहे.',
    textSearchKeywords: 'gharun kapde dry clean karun denari service mumbai, paithani saree dry clean charge kiti asto, kilo pramane kapde dhunari laundry pune, doorstep dry cleaning andheri west',
    typedSearches: [
      {
        romanQuery: 'gharun kapde dry clean karun denari service konti',
        nativeQuery: 'घरातून कपडे नेऊन ड्राय क्लीन करणारी सेवा कोणती आहे?',
        answer: 'laundry.online मोफत डोअरस्टेप पिकअप आणि डिलिव्हरीसह संपूर्ण शहरात सेवा देते.'
      },
      {
        romanQuery: 'paithani saree dry clean charge kiti asto mumbai',
        nativeQuery: 'ड्राय क्लीनिंगचे दर किती आहेत?',
        answer: 'साडी ₹१९९ पासून, सूट ₹२४९ पासून आणि दैनंदिन कपडे ₹७९/किलो पासून सुरू.'
      },
      {
        romanQuery: 'mahagde kapde dry clean madhe safe astat ka',
        nativeQuery: 'महागडे कपडे खराब होणार नाहीत ना?',
        answer: 'अजिबात नाही! आम्ही प्रीमियम व फॅब्रिक-सुरक्षित पद्धतींचा वापर करतो.'
      },
      {
        romanQuery: '24 taasat express dry clean delivery milte ka',
        nativeQuery: '२४ तासांत एक्सप्रेस डिलिव्हरी मिळते का?',
        answer: 'होय, २४ तासांची एक्सप्रेस डिलिव्हरी सेवा उपलब्ध आहे.'
      },
      {
        romanQuery: 'laundry pickup booking kashi karaychi online',
        nativeQuery: 'बुकिंग कसे करावे?',
        answer: 'वेबसाईट किंवा व्हॉट्सॲपवरून फक्त २० सेकंदात पिकअप बुक करू शकता.'
      }
    ]
  },
  {
    code: 'bn',
    hreflang: 'bn-IN',
    name: 'বাংলা',
    englishName: 'Bengali',
    path: '/bn/',
    metaTitle: 'বাড়ি থেকে জামাকাপড় ড্রাই ক্লিন করার সার্ভিস | Doorstep Dry Cleaning Free Pickup',
    metaDesc: 'বাড়ি থেকে জামাকাপড় ড্রাই ক্লিনিং, ওয়াশ অ্যান্ড ফোল্ড এবং স্টিম ইস্ত্রি। bari ese dry clean er kapor niye jabe. ফ্রি পিকআপ ও ডেলিভারি।',
    h1: 'বাড়ি থেকে জামাকাপড় ড্রাই ক্লিন করার সার্ভিস (Doorstep Dry Cleaning)',
    tagline: 'বাড়ি থেকে জামাকাপড় নিয়ে ড্রাই ক্লিন করে ফেরত দেওয়ার সার্ভিস - ফ্রি পিকআপ ও ড্রপ',
    voiceAnswerLead: 'laundry.online আপনার বাড়ি থেকে কাপড় সংগ্রহ করে প্রফেশনাল ড্রাই ক্লিনিং, ওয়াশ অ্যান্ড ফোল্ড এবং স্টিম ইস্ত্রির সুবিধা প্রদান করে। বেনারসি সিল্ক শাড়ি, স্যুট, কম্বল এবং প্রতিদিনের জামাকাপড় ওজন হিসেবে (₹৭৯/কেজি) পরিষ্কার করা হয়। ফ্রি হোম পিকআপ এবং ২৪ থেকে ৪৮ ঘণ্টায় ডেলিভারি।',
    pricingLead: 'শাড়ি ড্রাই ক্লিন ₹১৯৯ থেকে, স্যুট ₹২৪৯ থেকে, কেজি লন্ড্রি ₹৭৯/কেজি। ফ্রি পিকআপ।',
    whatsappText: 'নমস্কার laundry.online, আমি ড্রাই ক্লিনিং পিকআপ বুক করতে চাই।',
    textSearchKeywords: 'bari ese dry clean er kapor niye jabe, silk saree dry clean er charge koto kolkata, kilo hishebe kapor kachar laundry salt lake, doorstep dry cleaning kolkata',
    typedSearches: [
      {
        romanQuery: 'bari ese dry clean er kapor niye jabe emon service',
        nativeQuery: 'বাড়ি থেকে কাপড় নিয়ে ড্রাই ক্লিন করার সেরা সার্ভিস কোনটি?',
        answer: 'laundry.online আপনার বাড়ির দোরগোড়া থেকে বিনামূল্যে কাপড় পিকআপ এবং ডেলিভারি প্রদান করে।'
      },
      {
        romanQuery: 'silk saree dry clean korte koto taka lage kolkata',
        nativeQuery: 'ড্রাই ক্লিনিং রেট কত?',
        answer: 'সিল্ক শাড়ি ₹১৯৯ থেকে, স্যুট ₹২৪৯ থেকে, এবং সাধারণ লন্ড্রি ₹৭৯/কেজি থেকে শুরু।'
      },
      {
        romanQuery: 'dami kapor dry clean e safe thakbe ki na',
        nativeQuery: 'দামি শাড়ি বা কাপড়ের রঙ নষ্ট হবে না তো?',
        answer: 'একদমই না! আমরা কাপড়ের স্থায়িত্ব বজায় রেখে অত্যন্ত যত্নসহকারে ড্রাই ক্লিন করি।'
      },
      {
        romanQuery: '24 ghontay urgent dry clean delivery pawa jabe',
        nativeQuery: '২৪ ঘণ্টায় আর্জেন্ট ডেলিভারি পাওয়া যায় কি?',
        answer: 'হ্যাঁ, আমাদের ২৪ ঘণ্টার এক্সপ্রেস ডেলিভারি অপশন রয়েছে।'
      },
      {
        romanQuery: 'laundry pickup booking ki bhabe korbo online',
        nativeQuery: 'কিভাবে বুকিং করব?',
        answer: 'হোয়াটসঅ্যাপ বা ওয়েবসাইটে গিয়ে খুব সহজেই ২০ সেকেন্ডে বুক করা যায়।'
      }
    ]
  },
  {
    code: 'gu',
    hreflang: 'gu-IN',
    name: 'ગુજરાતી',
    englishName: 'Gujarati',
    path: '/gu/',
    metaTitle: 'ઘરેથી કપડાં ડ્રાય ક્લીન લઈ જવાની સર્વિસ | Doorstep Dry Cleaning Free Pickup',
    metaDesc: 'ઘરે આવીને કપડાં ડ્રાય ક્લીન કરી આપતી લોન્ડ્રી. gharethi kapda dry clean lai javani service. ફ્રી પિકઅપ અને ડિલિવરી. સાડી, સૂટ, બ્લેન્કેટ.',
    h1: 'ઘરેથી કપડાં ડ્રાય ક્લીન લઈ જવાની સર્વિસ (Doorstep Dry Cleaning)',
    tagline: 'ઘરેથી કપડાં લઈ જઈને ડ્રાય ક્લીન કરી પહોંચાડતી સર્વિસ - ફ્રી પિકઅપ અને ડ્રોપ',
    voiceAnswerLead: 'laundry.online તમારા ઘરેથી કપડાં પિકઅપ કરીને પ્રોફેશનલ ડ્રાય ક્લીનિંગ, વોશ એન્ડ ફોલ્ડ અને સ્ટીમ ઇસ્ત્રીની સુવિધા આપે છે. સિલ્ક સાડી, સૂટ, બ્લેઝર மற்றும் રોજના કપડાં કિલોના ભાવે (₹૭૯/કિલો) ધોવામાં આવે છે. ફ્રી હોમ પિકઅપ અને ૨૪ થી ૪૮ કલાકમાં ડિલિવરી.',
    pricingLead: 'સાડી ડ્રાય ક્લીન ₹૧૯૯ થી, સૂટ ₹૨૪૯ થી, કિલો લોન્ડ્રી ₹૭૯/કિલો. ફ્રી પિકઅપ.',
    whatsappText: 'નમસ્તે laundry.online, મારે કપડાં ડ્રાય ક્લીન માટે પિકઅપ બુક કરવું છે.',
    textSearchKeywords: 'gharethi kapda dry clean lai javani service, sari dry clean no charge ketlo thay, kilo na hisabe kapda dhovani laundry ahmedabad, doorstep dry cleaning sg highway',
    typedSearches: [
      {
        romanQuery: 'gharethi kapda dry clean lai javani service ahmedabad',
        nativeQuery: 'ઘરેથી કપડાં લઈ જઈ ડ્રાય ક્લીન કરી આપતી સર્વિસ કઈ?',
        answer: 'laundry.online ફ્રી ડોરસ્ટેપ પિકઅપ અને ડિલિવરી સાથે આખા શહેરમાં સેવા આપે છે.'
      },
      {
        romanQuery: 'saree dry clean karvano ketlo charge thay',
        nativeQuery: 'ડ્રાય ક્લીનિંગના ભાવ શું છે?',
        answer: 'સાડી ₹૧૯૯ થી, સૂટ ₹૨૪૯ થી અને રોજના કપડાં કિલોના ₹૭૯ થી શરૂ થાય છે.'
      },
      {
        romanQuery: 'silk sari dry clean ma bagadi to nahi jaay ne',
        nativeQuery: 'મોંઘા કપડાંને નુકસાન તો નહીં થાય ને?',
        answer: 'બિલકુલ નહીં! અમે પ્રીમિયમ અને ફેબ્રિક-સેફ પદ્ધતિથી કપડાં ધોઈએ છીએ.'
      },
      {
        romanQuery: '24 kalak ma urgent delivery male ke nahi',
        nativeQuery: '૨૪ કલાકમાં અર્જન્ટ ડિલિવરી મળે ખરી?',
        answer: 'હા, અમારી એક્સપ્રેસ ૨૪ કલાક ડિલિવરી સર્વિસ ઉપલબ્ધ છે.'
      },
      {
        romanQuery: 'laundry pickup kevi rite book karvu online',
        nativeQuery: 'પિકઅપ કેવી રીતે બુક કરવું?',
        answer: 'વોટ્સએપ અથવા વેબસાઇટ પર ફક્ત સરનામું આપીને બુક કરી શકો છો.'
      }
    ]
  }
];

function renderPage(lang) {
  const whatsappUrl = `https://wa.me/919090909090?text=${encodeURIComponent(lang.whatsappText)}`;
  const canonicalUrl = `${ORIGIN}${lang.path}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${ORIGIN}/#business`,
        'name': 'laundry.online',
        'url': ORIGIN,
        'priceRange': '₹79/kg - ₹₹₹',
        'telephone': '+919090909090'
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        'url': canonicalUrl,
        'name': lang.metaTitle,
        'description': lang.metaDesc,
        'inLanguage': lang.code,
        'keywords': `${lang.textSearchKeywords}, online dry cleaning services near me`,
        'speakable': {
          '@type': 'SpeakableSpecification',
          'cssSelector': ['.voice-h1', '.voice-answer', '.faq-answer']
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        'inLanguage': lang.code,
        'mainEntity': lang.typedSearches.map(t => ({
          '@type': 'Question',
          'name': `${t.nativeQuery} (${t.romanQuery})`,
          'alternateName': t.romanQuery,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': t.answer
          }
        }))
      }
    ]
  };

  const hreflangs = [
    `<link rel="alternate" hreflang="en-IN" href="${ORIGIN}/">`,
    ...LAUNDRY_LANGUAGES.map(l => `<link rel="alternate" hreflang="${l.hreflang}" href="${ORIGIN}${l.path}">`),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/">`
  ].join('\n    ');

  return `<!DOCTYPE html>
<html lang="${lang.code}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lang.metaTitle}</title>
    <meta name="description" content="${lang.metaDesc}">
    <meta name="keywords" content="${lang.textSearchKeywords}">
    <link rel="canonical" href="${canonicalUrl}">
    ${hreflangs}
    <meta property="og:title" content="${lang.metaTitle}">
    <meta property="og:description" content="${lang.metaDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <link rel="stylesheet" href="/css/style.css">
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;margin:0;padding:0;color:#1e293b;background:#f8fafc;">
    <header style="background:#fff;border-bottom:1px solid #e2e8f0;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
        <a href="/" style="text-decoration:none;font-size:24px;font-weight:800;color:#0284c7;">laundry<span style="color:#0f172a;">.online</span></a>
        <div>
            <a href="${whatsappUrl}" target="_blank" rel="noopener" style="background:#25D366;color:#fff;padding:8px 16px;border-radius:24px;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:6px;">
                <span>💬 WhatsApp Pickup</span>
            </a>
        </div>
    </header>

    <main style="max-width:900px;margin:32px auto;padding:0 20px;">
        <div style="background:#e0f2fe;color:#0369a1;display:inline-block;padding:6px 14px;border-radius:20px;font-weight:600;font-size:14px;margin-bottom:12px;">
            🎙️ &amp; ⌨️ Voice + Hinglish Text Search (${lang.name} - ${lang.englishName})
        </div>
        
        <h1 class="voice-h1" style="font-size:32px;color:#0f172a;line-height:1.2;margin:10px 0;">${lang.h1}</h1>
        <p style="font-size:18px;color:#64748b;margin-bottom:24px;">${lang.tagline}</p>

        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);margin-bottom:32px;">
            <div style="font-weight:700;color:#0f172a;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
                <span>🎤</span>
                <span>Google Mic Voice &amp; Quick Spoken Answer:</span>
            </div>
            <p class="voice-answer" style="font-size:18px;line-height:1.6;color:#334155;margin:0;">
                ${lang.voiceAnswerLead}
            </p>
            <div style="margin-top:16px;background:#f0fdf4;border:1px solid #bbf7d0;padding:12px 16px;border-radius:8px;font-weight:600;color:#166534;">
                💰 ${lang.pricingLead}
            </div>
            <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
                <a href="${whatsappUrl}" target="_blank" rel="noopener" style="background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">
                    Book Free Doorstep Pickup
                </a>
            </div>
        </div>

        <!-- Dedicated Section for Text Searchers (Hinglish / Romanized Queries) -->
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:32px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:20px;">⌨️</span>
                <h2 style="font-size:22px;color:#0f172a;margin:0;">Common Queries Typed by Text Searchers (Hinglish &amp; Romanized)</h2>
            </div>
            <p style="color:#64748b;margin-bottom:18px;">Direct answers to high-intent queries typed into Google Search:</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;">
                ${lang.typedSearches.map(t => `
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
                        <div style="font-family:monospace;font-size:13px;color:#0284c7;background:#f0f9ff;padding:4px 8px;border-radius:4px;display:inline-block;margin-bottom:8px;font-weight:600;">
                            🔍 "${t.romanQuery}"
                        </div>
                        <div style="font-weight:700;color:#0284c7;font-size:15px;margin-bottom:6px;">
                            ${t.nativeQuery}
                        </div>
                        <p style="font-size:14px;line-height:1.5;color:#475569;margin:0;">
                            ${t.answer}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>

        <h2 style="font-size:24px;color:#0f172a;margin-bottom:16px;">Frequently Asked Questions (${lang.name} &amp; English)</h2>
        <div style="display:flex;flex-direction:column;gap:16px;">
            ${lang.typedSearches.map(t => `
                <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:18px;">
                    <h3 style="font-size:18px;color:#0284c7;margin:0 0 8px 0;display:flex;align-items:center;gap:8px;">
                        <span>❓</span>
                        <span>${t.nativeQuery} <small style="font-weight:400;color:#64748b;">("${t.romanQuery}")</small></span>
                    </h3>
                    <p class="faq-answer" style="font-size:16px;line-height:1.6;color:#475569;margin:0;">
                        ${t.answer}
                    </p>
                </div>
            `).join('')}
        </div>

        <div style="margin-top:40px;padding:24px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-align:center;">
            <h3 style="margin-top:0;">Browse laundry.online in Other Indian Languages</h3>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
                ${LAUNDRY_LANGUAGES.map(l => `
                    <a href="${l.path}" style="padding:8px 16px;border-radius:6px;border:1px solid #cbd5e1;text-decoration:none;color:${l.code === lang.code ? '#fff' : '#0f172a'};background:${l.code === lang.code ? '#0284c7' : '#f8fafc'};font-weight:600;font-size:14px;">
                        ${l.name}
                    </a>
                `).join('')}
                <a href="/" style="padding:8px 16px;border-radius:6px;border:1px solid #cbd5e1;text-decoration:none;color:#0f172a;background:#f8fafc;font-weight:600;font-size:14px;">
                    English
                </a>
            </div>
        </div>
    </main>

    <footer style="background:#0f172a;color:#94a3b8;padding:32px 20px;text-align:center;margin-top:60px;">
        <p>&copy; 2026 laundry.online — Doorstep Laundry &amp; Dry Cleaning Across India</p>
    </footer>
</body>
</html>`;
}

// Generate all pages
for (const l of LAUNDRY_LANGUAGES) {
  const dir = join(ROOT, l.code);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderPage(l));
  console.log(`Generated laundry.online Dual Voice+Text Search: ${l.code}/index.html (${l.englishName})`);
}
