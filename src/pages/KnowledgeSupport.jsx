import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Eye,
  ExternalLink,
  FileText,
  Flame,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Wind,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createKnowledgeDocument,
  getKnowledgeDocument,
  listKnowledgeDocuments,
  queryKnowledge,
  reindexKnowledgeDocument,
} from '../api/knowledgeApi';
import PageHeader from '../components/PageHeader';
import SOPViewerModal from '../components/SOPViewerModal';
import { getCurrentUser } from '../utils/auth';

const defaultAnswerSteps = [
  'Keep a safe distance (minimum 3 meters) from the electrical switchboard and avoid any contact with water.',
  'Immediately switch off the main MCB/RCCB supply if it is safe and accessible without stepping into standing water.',
  'Inform the facility management team or resident electrician Suresh (T002 - 9000000004) without delay.',
  'Do not attempt any repairs yourself. Power must remain isolated until an authorized technician performs an insulation test.',
];

const richDefaultDocs = [
  {
    documentId: 'KDOC001',
    title: 'Electrical Safety SOP',
    type: 'SOP',
    category: 'Electrical Safety',
    chunkCount: 3,
    color: 'red',
    content: `STANDARD OPERATING PROCEDURE: ELECTRICAL SAFETY & HIGH-RISK HAZARD RESPONSE
Document ID: SOP-ELEC-001 | Version: 2.4 | Approved by: Green Valley Residency RWA

1. PURPOSE & APPLICABILITY
This Standard Operating Procedure (SOP) defines mandatory safety protocols for all residents, security personnel, and facility staff in the event of electrical hazards, exposed wiring, burning smells, short circuits, or water ingress near electrical panels.

2. IMMEDIATE EMERGENCY ACTIONS FOR RESIDENTS
- STEP 1 (SAFETY DISTANCE): Maintain a minimum 3-meter safety perimeter from any sparking switchboard, water-logged outlet, or smoking electrical equipment.
- STEP 2 (NO CONTACT): Never attempt to operate switches, circuit breakers, or disconnect plugs with wet hands or while standing on wet flooring.
- STEP 3 (MAIN BREAKER ISOLATION): If the apartment main Miniature Circuit Breaker (MCB) or Residual Current Circuit Breaker (RCCB) is accessible safely outside the water contact zone, flip the main toggle switch OFF immediately.
- STEP 4 (REPORT IMMEDIATELY): Log a high-severity ticket on the SafeHome resident portal or call Estate Security at extension #999.
- STEP 5 (EVACUATION): If smoke, sparking, or acrid odor persists, evacuate the apartment immediately, alert adjacent units, and assemble at the designated Block A assembly area.

3. PROHIBITED ACTIONS (DO NOT ATTEMPT)
- Never use water to extinguish an electrical fire. Only Class C or Class ABC dry chemical powder or CO2 fire extinguishers are permitted.
- Do not bypass tripping circuit breakers or replace fuses with makeshift copper wire.
- Do not touch fallen overhead cables or wet service risers in common stairwells.

4. ESCALATION & AUTHORIZED CONTACTS
- On-Duty Resident Electrician: Suresh (Technician T002) - Mobile: 9000000004
- Emergency Electrical Vendor: Spark Electrical & Controls (VEN002) - 24/7 Hotline: 9848033445
- Local Electricity Board (APCPDCL / DISCOM) Helpline: 1912
- Facility Management Control Desk: Extension #100 / 0866-2490001

5. SLA & RESOLUTION PROTOCOL
- Response Time: Under 15 minutes for critical electrical risks involving water ingress.
- Full Inspection: Megger insulation resistance test and thermal scan before power restoration.
- Sign-off: Power will remain isolated until Suresh (T002) or Spark Electrical (VEN002) issues a safety clearance certificate.`,
  },
  {
    documentId: 'KDOC002',
    title: 'Plumbing Leakage Handling Guide',
    type: 'Guide',
    category: 'Plumbing',
    chunkCount: 3,
    color: 'blue',
    content: `RESIDENTIAL GUIDELINE: PLUMBING LEAKAGE, PIPE BURST & WATER SHUT-OFF
Document ID: GUI-PLUMB-002 | Version: 2.1 | Approved by: Green Valley Residency RWA

1. PURPOSE & OVERVIEW
This comprehensive guideline provides step-by-step instructions for residents and building superintendents to contain and mitigate water leakages, drain backups, pipe bursts, and overhead supply disruptions within individual flats and common utility ducts.

2. IMMEDIATE EMERGENCY CONTAINMENT (FIRST 5 MINUTES)
- STEP 1 (ISOLATE INFLOW): Locate the apartment's main water angle valve or stopcock (usually situated under the kitchen sink, above the bathroom geyser, or in the hallway utility riser) and turn clockwise until firmly closed.
- STEP 2 (ELECTRICAL PROTECTION): If water is dripping near ceiling lights, wall conduits, or lower baseboard sockets, immediately turn OFF the apartment lighting MCB to prevent electrocution or circuit burns.
- STEP 3 (SURFACE CONTAINMENT): Place buckets, towels, or containment trays directly beneath the dripping pipe or ceiling seep to protect parquet or tile flooring and prevent seepage into lower-floor apartments.
- STEP 4 (NOTIFY NEIGHBORS): In multi-story blocks, notify the apartment directly below (e.g., A-101) so they can monitor their ceiling for signs of dampness.
- STEP 5 (LOG TICKET): Submit a complaint with clear photos through SafeHome-RAG. The AI engine will automatically analyze leakage severity and cross-reference common vertical shafts.

3. SHARED SHAFT LEAKS & BLOCK INCIDENTS
- When leakages are reported across two or more consecutive vertical floors (e.g. A-102 and A-202), the system automatically classifies the event as a Collective Block Incident.
- The Block Sub-Admin will authorize isolating the common vertical riser valve on the terrace tank until pressure testing is complete.

4. PRIMARY SERVICE CONTACTS
- Lead Estate Plumber: Ramesh (Technician T001) - Mobile: 9000000003
- Emergency Plumbing Vendor: QuickFix Plumbing Solutions (VEN001) - 24/7 Hotline: 9848011223
- Terrace Tank & Pump Room Operator: Extension #104

5. RESOLUTION SLA & BILLING TERMS
- Internal apartment pipe repairs under resident fixture warranty are billed as parts + standard service fee.
- Concealed common riser pipes, exterior drainage stacks, and shaft leaks are 100% covered by society maintenance reserve funds.`,
  },
  {
    documentId: 'KDOC003',
    title: 'Lift Emergency Procedure',
    type: 'SOP',
    category: 'Lift Safety',
    chunkCount: 3,
    color: 'green',
    content: `STANDARD OPERATING PROCEDURE: ELEVATOR PASSENGER ENTRAPMENT & RESCUE
Document ID: SOP-LIFT-003 | Version: 3.0 | Approved by: Otis & SafeHome Facility Board

1. PURPOSE & SCOPE
This emergency SOP governs the safe response to elevator stoppages, power-trip entrapments, and safety brake locks across all passenger and service elevators in Blocks A and B.

2. INSTRUCTIONS FOR PASSENGERS TRAPPED INSIDE THE CAB
- STEP 1 (REMAIN CALM): Elevators are engineered with mechanical counterweights and gravity fall brakes. The elevator cabin will NOT plummet. There is continuous airflow via shaft vents.
- STEP 2 (PRESS YELLOW ALARM): Press and hold the Yellow Bell button on the cabin operating panel for 5 seconds to sound the car-top and lobby siren.
- STEP 3 (USE EMERGENCY INTERCOM): Press the Phone or Intercom button to speak directly with the 24/7 Security Gate Officer and explain how many occupants are in the lift.
- STEP 4 (DO NOT PRY DOORS): Strictly never attempt to pry, kick, or force elevator doors open, and never try to climb out through ceiling panels. Premature egress is the single greatest hazard during elevator entrapments.
- STEP 5 (WAIT FOR RESCUE): Keep seated if feeling fatigued, conserve phone battery, and await authorized mechanical manual leveling.

3. PROTOCOL FOR SECURITY & FACILITY RESCUE TEAM
- Keep continuous voice communication with trapped passengers through the intercom every 2 minutes.
- Switch the elevator controller to 'Inspection Mode' in the rooftop motor room before using the manual brake release lever.
- Only licensed elevator technicians or trained security supervisors are authorized to hand-wind the flywheel to align the cabin sill with the landing floor door unlocking zone.

4. EMERGENCY ESCALATION CONTACTS
- 24/7 Security Gate Dispatch: Extension #101 / Mobile: 9000000005
- Dedicated Lift Maintenance Vendor: Otis & City Lift Services (VEN003) - 24/7 Emergency Line: 9848055667
- Facility Manager: Extension #102 / Mobile: 9000000006
- City Fire & Emergency Services: 101 / 112

5. RE-COMMISSIONING PROTOCOL
- The elevator must be barricaded with "OUT OF SERVICE" stanchions on all floors until a comprehensive load test, door interlock check, and safety brake certificate is signed by Otis (VEN003).`,
  },
  {
    documentId: 'KDOC004',
    title: 'Visitor and Security Rules',
    type: 'Policy',
    category: 'Security',
    chunkCount: 3,
    color: 'purple',
    content: `ESTATE SECURITY POLICY: VISITOR VERIFICATION, GATE PASSES & VEHICLE ACCESS
Document ID: POL-SEC-004 | Version: 2.2 | Approved by: Green Valley Residency Managing Committee

1. OBJECTIVE & ACCESS CONTROL MANDATE
To ensure the physical safety and privacy of all residents, Green Valley Residency operates a 24/7 gated security barrier with digital visitor pre-authorization and license-plate logging via SafeHome CRM.

2. VISITOR ENTRY CLASSIFICATION & WORKFLOW
- GUESTS & PERSONAL VISITORS: Residents can pre-approve visitors through the SafeHome resident app or chatbot by providing visitor name, phone number, and expected arrival date/time. A 4-digit digital pass is generated. Unannounced visitors will be held at Main Gate #1 while security places an automated app authorization call to the resident.
- DELIVERY DRIVERS & COURIERS (SWIGGY, ZOMATO, AMAZON): Delivery personnel must record their vehicle number and show app order proof at Gate #1. Deliveries after 10:30 PM must be collected by residents at the main gate reception lobby unless medical or emergency exemption is recorded.
- DAILY DOMESTIC HELP & CONTRACTORS: Maids, drivers, cooks, and cleaning personnel must possess biometric RFID cards and wear visible ID tags.

3. MOVE-IN & MOVE-OUT PROTOCOL
- Heavy goods vehicles (packers and movers) are strictly allowed between 9:00 AM and 5:00 PM on weekdays and Saturdays only. Moving on Sundays is prohibited to maintain weekend quietude.
- Prior written clearance from the Block Sub-Admin and a refundable moving deposit of ₹5,000 must be deposited with society accounts 48 hours prior.
- Freight elevator protective wall pads must be installed prior to loading furniture.

4. VEHICLE PARKING REGULATIONS
- All resident motor vehicles must display official Green Valley RFID windshield stickers and park strictly within designated parking bays (e.g., A-P01 for Apartment A-102).
- Visitor vehicles are allowed in marked visitor bays for a maximum duration of 6 hours. Overnight visitor parking requires a ₹100 overnight pass issued by security.
- Blocking emergency fire hydrant lanes, generator bays, or driveway turning radiuses will result in immediate wheel-clamping and a ₹500 penalty.

5. SECURITY CONTACTS
- Main Security Gate #1 (Vehicles): Extension #101
- Pedestrian Gate #2 (Sports Block): Extension #102
- Chief Security Officer (CSO): Mobile: 9000000005`,
  },
  {
    documentId: 'KDOC005',
    title: 'Resident Community Guidelines & Noise Policy',
    type: 'Policy',
    category: 'Community Bylaws',
    chunkCount: 3,
    color: 'amber',
    content: `COMMUNITY BYLAWS: RESIDENTIAL CONDUCT, NOISE POLICY & WASTE MANAGEMENT
Document ID: BYLAW-COM-005 | Version: 3.1 | Approved by: Green Valley Residency General Body

1. CODE OF CONDUCT & COMMUNITY LIVING
Living in a shared multi-story residential complex requires mutual courtesy, respect for privacy, and adherence to shared environmental hygiene standards.

2. QUIET HOURS & NOISE RESTRICTIONS
- Strict Quiet Hours are in effect daily from 10:00 PM to 6:00 AM (extended to 7:00 AM on Sundays and public holidays).
- Audio systems, televisions, musical instruments, and social gatherings must be kept at moderate indoor volume (under 50 dB) during quiet hours.
- Heavy domestic renovation, hammer drilling, structural tile cutting, and furniture assembly are permitted only Monday through Saturday from 10:00 AM to 5:00 PM. No drilling is allowed on Sundays.

3. MUNICIPAL SOLID WASTE SEGREGATION (MANDATORY)
- All apartments must practice 2-bin, 1-bag segregation:
  * GREEN BIN (Wet Waste): Raw fruit and vegetable peels, leftover cooked food, tea bags, garden trimmings.
  * BLUE BIN (Dry Recyclables): Cardboard, paper, plastic containers, glass bottles, clean aluminum cans.
  * RED BAG (Hazardous Domestic Waste): Sanitary pads, expired medications, disposable batteries, chemical bottles.
- Segregated bins must be placed outside apartment doors or deposited into the corridor garbage room before 9:00 AM daily.
- Dumping construction debris, mattresses, or chemical waste into domestic floor chutes is strictly prohibited.

4. PET POLICY & COMMON AREA GUIDELINES
- All dogs must be kept on a short leash (under 1.5 meters) in all corridors, lobbies, landscaped gardens, and passenger elevators.
- Pet owners are strictly required to carry clean-up bags and scoop their pet's droppings immediately.
- Balcony ledges must be kept free of loose flower pots or laundry drying racks that pose falling hazards to ground-floor pedestrians.

5. GRIEVANCE & ARBITRATION COMMITTEE
- Persistent noise complaints or bylaw violations are logged under SafeHome ticket review.
- First offense: Formal courtesy warning by Block Sub-Admin.
- Second offense: Society fine of ₹1,000 added to monthly maintenance billing.`,
  },
  {
    documentId: 'KDOC006',
    title: 'Amenity Booking & Clubhouse Rules',
    type: 'Guide',
    category: 'Amenities',
    chunkCount: 3,
    color: 'blue',
    content: `AMENITY REGULATIONS: CLUBHOUSE, SPORTS COURTS & PARTY HALL RESERVATIONS
Document ID: GUI-AMEN-006 | Version: 2.3 | Approved by: Green Valley Residency Sports Committee

1. OVERVIEW OF COMMUNITY AMENITIES
Green Valley Residency offers premium shared amenities designed to foster wellness, recreation, and community fellowship:
- Community Hall & Banquet Lawn (AM001) - Ground Floor Clubhouse (Capacity: 150 guests)
- Badminton Court (AM002) - Sports Block Indoor Complex (Wooden Flooring)
- Tennis Court (AM003) - Outdoor Sports Complex (Synthetic Hard Court with Floodlights)
- Swimming Pool & Kids Splash (AM004) - Clubhouse Annex (Filtered Fresh Water)
- Gymnasium & Yoga Studio (AM005) - Clubhouse 1st Floor

2. BOOKING PROCEDURE & TIME SLOTS
- Reservations must be submitted via the SafeHome web portal or through the AI Assistant using natural language (e.g., "Book the tennis court tomorrow at 6 PM").
- Bookings can be made up to 30 days in advance. Each apartment is eligible for up to 2 active sports slot reservations per week to prevent hoarding.
- Available sports court slots run daily in 1-hour intervals:
  * Morning Session: 06:00 to 10:00
  * Evening Session: 16:00 to 21:00 (Floodlights operational after 18:00)

3. TARIFFS, CHARGES & REFUND POLICY
- Tennis Court (AM003): ₹250 per hour per apartment.
- Badminton Court (AM002): ₹200 per hour per apartment.
- Community Hall (AM001): ₹1,000 per booking block + ₹3,000 refundable sanitization & damage deposit.
- Swimming Pool (AM004): ₹150 per family session.
- Gymnasium (AM005): ₹100 monthly access pass.
- Cancellations made at least 24 hours prior to the booked time slot receive a 100% refund credited back to the resident's SafeHome billing wallet. Cancellations within 12 hours forfeit 50% of the booking fee.

4. SAFETY & DRESS CODE REGULATIONS
- Tennis & Badminton: Non-marking rubber sports shoes are strictly mandatory. Barefoot or street shoes are not permitted on court surfaces.
- Swimming Pool: Proper nylon or lycra swimwear is required. Showering is mandatory before pool entry. Children under 12 must be accompanied by an adult.
- Glass bottles, alcoholic beverages, and smoking are strictly forbidden across all amenity premises.

5. FACILITY INQUIRIES & EMERGENCY SUPPORT
- Clubhouse Manager Desk: Extension #105
- Sports Committee Liaison: Mobile: 9000000008`,
  },
  {
    documentId: 'KDOC007',
    title: 'Maintenance Billing & Payment FAQ',
    type: 'FAQ',
    category: 'Billing FAQ',
    chunkCount: 3,
    color: 'green',
    content: `FREQUENTLY ASKED QUESTIONS: MAINTENANCE BILLING, TARIFFS & PAYMENTS
Document ID: FAQ-BILL-007 | Version: 2.5 | Approved by: Green Valley Residency Finance Desk

Q1: When are monthly society maintenance bills generated and what is the due date?
A: Monthly society maintenance bills are generated on the 1st calendar day of every month at 00:00 AM. The standard due date is the 10th of every month. Residents receive an automated notification via email and SMS when bills are posted.

Q2: What is included in the standard monthly maintenance tariff?
A: The standard tariff covers common area electricity (elevators, corridor lighting, water booster pumps), 24/7 security guard deployments, daily housekeeping and garbage collection, landscaped garden upkeep, pest control, lift AMC contracts with Otis, and contributions to the society sinking reserve fund.

Q3: What payment methods are supported in the SafeHome billing portal?
A: Payments can be completed online 24/7 through the SafeHome resident billing tab using:
- UPI (Google Pay, PhonePe, Paytm, BHIM) with zero processing surcharge.
- Net Banking across all major scheduled public and private banks.
- Credit / Debit Cards (Visa, MasterCard, RuPay).
- Instant digital payment receipts and GST-compliant invoices are generated immediately upon gateway confirmation.

Q4: What penalties apply if maintenance is paid after the due date?
A: A grace period is extended until the 20th of the month. If payment is not recorded by the 20th:
- A late payment surcharge of ₹50 per week of delay is automatically appended to the ledger.
- For dues exceeding 60 consecutive days, amenity booking privileges (badminton, tennis, pool) are temporarily paused until outstanding arrears are cleared.

Q5: How are individual apartment repair and work order charges billed?
A: Minor internal apartment repairs performed by society technicians (e.g. Ramesh - Plumber, Suresh - Electrician) have transparent flat rates:
- Standard technician visit fee: ₹300 per service call.
- Spare parts and consumables (e.g. PVC pipes, MCBs, brass valves): Billed at actual replacement cost as itemized on the digital work order.
- Invoices are generated under 'My Bills' upon resident digital sign-off.`,
  },
  {
    documentId: 'KDOC008',
    title: 'Fire Safety & Building Evacuation SOP',
    type: 'SOP',
    category: 'Fire Safety',
    chunkCount: 3,
    color: 'red',
    content: `STANDARD OPERATING PROCEDURE: FIRE EMERGENCY & BUILDING EVACUATION
Document ID: SOP-FIRE-008 | Version: 2.0 | Approved by: State Disaster Response & Fire Services

1. PURPOSE & FIRE PREVENTION DIRECTIVES
To protect life and property against residential fires through standardized early-warning response, immediate extinguishing procedures, and orderly vertical evacuation.

2. IMMEDIATE ACTIONS UPON DETECTING SMOKE OR FIRE (R.A.C.E PROTOCOL)
- R - RESCUE: Remove all occupants from the immediate room or zone of danger. Close the door behind you to starve the fire of oxygen and slow smoke propagation.
- A - ALARM: Break the nearest Manual Call Point (red fire alarm glass) in the corridor and shout "FIRE! EVACUATE!" to alert floor neighbors.
- C - CONFINE: Close all corridor fire doors. Never wedge fire doors open with doorstops.
- E - EVACUATE: Evacuate using external fire escape staircases immediately. NEVER USE ELEVATORS during a fire alert.

3. USE OF FIRE EXTINGUISHERS (P.A.S.S METHOD)
For small, contained fires (e.g. trash can or stovetop grease fire), use the corridor ABC dry chemical extinguisher:
- P: PULL the safety pin located at the top of the handle.
- A: AIM the nozzle low, pointing directly at the base of the flames (not the smoke).
- S: SQUEEZE the operating lever slowly and evenly.
- S: SWEEP from side to side across the base of the fire until extinguished.

4. EVACUATION ASSEMBLY POINTS & ASSEMBLY LEADERS
- Primary Assembly Point: Open Central Cricket Ground or Lawn opposite Block A.
- Secondary Assembly Point: Main Visitor Parking Lot outside Gate #1.
- Never re-enter a building until the Chief Fire Officer gives the "ALL CLEAR" signal.

5. EMERGENCY HOTLINES
- City Fire Control Room: 101 / 112
- Estate Security Emergency Station: Extension #999 / Mobile: 9000000005
- Government General Hospital Emergency Ambulance: 108`,
  },
  {
    documentId: 'KDOC009',
    title: 'Gas Leakage Response & Pipeline Safety SOP',
    type: 'SOP',
    category: 'Gas Safety',
    chunkCount: 3,
    color: 'amber',
    content: `STANDARD OPERATING PROCEDURE: COOKING GAS (LPG & PNG) LEAKAGE RESPONSE
Document ID: SOP-GAS-009 | Version: 2.1 | Approved by: Bhagyanagar Gas Limited (BGL) & RWA

1. INTRODUCTION & HAZARD RECOGNITION
Piped Natural Gas (PNG) and Liquefied Petroleum Gas (LPG) are treated with ethyl mercaptan to give an identifiable "rotten egg" pungent odor so leaks can be detected quickly. Gas leaks pose severe combustion and explosion hazards.

2. MANDATORY IMMEDIATE SAFETY PROTOCOLS
- STEP 1 (NO ELECTRICAL SWITCHES): DO NOT turn ANY electrical switches ON or OFF. Do not ring doorbells, operate exhaust fans, or plug/unplug appliances. Even a micro-spark from a wall switch can ignite ambient gas!
- STEP 2 (NO OPEN FLAMES): Extinguish all matches, candles, incense sticks, and gas stove burners immediately. Do not smoke or use lighters.
- STEP 3 (SHUT MAIN ISOLATION VALVE): Immediately turn the gas meter inlet handle or LPG cylinder brass regulator valve clockwise to the horizontal OFF position.
- STEP 4 (VENTILATE THE PREMISES): Open all kitchen windows, balcony glass sliders, and doors wide to disperse trapped gas.
- STEP 5 (EVACUATE & CALL FROM OUTSIDE): Evacuate the apartment immediately. DO NOT use your mobile phone inside the contaminated room. Call emergency services only once you are in open fresh air.

3. EMERGENCY HOTLINE CONTACTS
- 24/7 City Gas Emergency Control: 1800-425-0025 / 0866-2475555
- Green Valley Security Control Desk: Extension #100 / Mobile: 9000000005
- Emergency Plumbing & Gas Pipeline Technician: Ramesh (T001) - Mobile: 9000000003`,
  },
];

export default function KnowledgeSupport() {
  const user = getCurrentUser();
  const location = useLocation();
  const [docs, setDocs] = useState([]);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [question, setQuestion] = useState(
    location.state?.question || 'What should residents do when water is near an electrical switchboard?'
  );
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [reindexingId, setReindexingId] = useState(null);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'SOP', category: 'Safety', content: '' });
  const [viewingDoc, setViewingDoc] = useState(null);

  const canCreate = ['MAIN_ADMIN', 'BLOCK_SUB_ADMIN', 'FACILITY_MANAGER'].includes(user?.role);

  const assignDocColor = (category, index) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('electric') || cat.includes('fire')) return 'red';
    if (cat.includes('plumb')) return 'blue';
    if (cat.includes('lift')) return 'green';
    if (cat.includes('secur')) return 'purple';
    if (cat.includes('gas') || cat.includes('bylaw') || cat.includes('guideline')) return 'amber';
    const colors = ['red', 'blue', 'green', 'purple', 'amber'];
    return colors[index % colors.length];
  };

  const load = () =>
    listKnowledgeDocuments()
      .then((data) => {
        if (data && data.length > 0) {
          setDocs(
            data.map((d, i) => ({
              ...d,
              color: assignDocColor(d.category, i),
            }))
          );
        } else {
          setDocs(richDefaultDocs);
        }
      })
      .catch(() => setDocs(richDefaultDocs));

  useEffect(() => {
    load();
    if (location.state?.question) {
      ask(null, location.state.question);
    }
  }, []);

  const ask = async (e, customQuery) => {
    e?.preventDefault();
    const q = (customQuery !== undefined ? customQuery : question).trim();
    if (!q) return;
    setBusy(true);
    setError('');
    try {
      const res = await queryKnowledge(q);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleChipClick = (queryText) => {
    setQuestion(queryText);
    ask(null, queryText);
  };

  const handleAskAboutSOP = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
    ask(null, suggestedQuestion);
  };

  const handleOpenSourceDoc = (sourceTitle) => {
    const found = docs.find(
      (d) =>
        d.title.toLowerCase().includes(sourceTitle.toLowerCase()) ||
        sourceTitle.toLowerCase().includes(d.title.toLowerCase())
    );
    if (found) {
      setViewingDoc(found);
    } else {
      // Find fallback from richDefaultDocs
      const fallback = richDefaultDocs.find(
        (d) =>
          d.title.toLowerCase().includes(sourceTitle.toLowerCase()) ||
          sourceTitle.toLowerCase().includes(d.title.toLowerCase())
      );
      if (fallback) setViewingDoc(fallback);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createKnowledgeDocument(form);
      setForm({ title: '', type: 'SOP', category: 'Safety', content: '' });
      setShowAddForm(false);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReindex = async (docId, e) => {
    e?.stopPropagation();
    setReindexingId(docId);
    try {
      await reindexKnowledgeDocument(docId);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setReindexingId(null);
    }
  };

  const displayedDocs = docs.length > 0 ? docs : richDefaultDocs;
  const filteredDocs = displayedDocs.filter((doc) =>
    (doc.title + doc.category + (doc.content || '')).toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  // Extract answer steps from result or use default sample steps
  const displaySteps =
    result?.answer
      ? result.answer
          .split(/(?:\r?\n)+/)
          .map((s) => s.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter(Boolean)
      : defaultAnswerSteps;

  return (
    <>
      <PageHeader
        eyebrow={user?.role === 'RESIDENT' ? 'Resident Help Center & SOPs' : 'Hybrid GraphRAG-Style Support'}
        title="Knowledge Support"
        subtitle={
          user?.role === 'RESIDENT'
            ? 'Search and read approved society bylaws, emergency safety procedures, amenity guidelines, and billing FAQs.'
            : 'Ask questions grounded in approved documents and authorized CRM context, with semantic retrieval and keyword fallback.'
        }
      />

      <div className="knowledge-support-grid">
        {/* Left Column: Ask Form & Preview Response */}
        <div className="knowledge-main-column">
          {user?.role === 'RESIDENT' && (
            <div className="resident-support-intro-banner">
              <Sparkles size={18} className="text-primary" />
              <div>
                <strong>Resident Self-Service Knowledge Base</strong>
                <p>
                  Instant answers on emergency precautions, society bylaws, amenity bookings, and
                  maintenance bills with source citations. Click any document on the right to view its full SOP!
                </p>
              </div>
            </div>
          )}

          {/* Card 1: Ask the knowledge base */}
          <section className="content-card knowledge-ask-card">
            <div className="card-custom-header">
              <div className="header-icon-square blue">
                <BookOpen size={20} />
              </div>
              <div className="header-title-box">
                <h2>Ask the knowledge base</h2>
                <p>Get accurate answers from approved documents and CRM context.</p>
              </div>
            </div>

            <form onSubmit={ask} className="ask-box-form">
              <div className="question-textarea-wrapper">
                <textarea
                  rows="3"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, 1000))}
                  placeholder="What should residents do when water is near an electrical switchboard?"
                  maxLength={1000}
                />
                <span className="char-counter">{question.length}/1000</span>
              </div>

              {/* Try asking about chips */}
              <div className="try-asking-bar">
                <span className="try-asking-label">Try asking about</span>
                <div className="try-asking-chips">
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('What are the electrical safety guidelines for residents?')}
                  >
                    <Zap size={13} className="text-amber" />
                    <span>Electrical safety</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('How should water leakage issues be handled?')}
                  >
                    <Droplets size={13} className="text-primary" />
                    <span>Water leakage</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('What is the procedure during a lift emergency?')}
                  >
                    <Zap size={13} className="text-primary" />
                    <span>Lift emergency</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('What are the community visitor and security rules?')}
                  >
                    <Shield size={13} className="text-primary" />
                    <span>Visitor rules</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('What are the quiet hours, pet rules, and community guidelines for residents?')}
                  >
                    <FileText size={13} className="text-primary" />
                    <span>Quiet hours & pets</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('What are the rules and timings for booking amenities like badminton and clubhouse?')}
                  >
                    <BookOpen size={13} className="text-primary" />
                    <span>Amenity booking</span>
                  </button>
                  <button
                    type="button"
                    className="topic-chip"
                    onClick={() => handleChipClick('When are monthly maintenance bills due and what are the payment terms?')}
                  >
                    <FileText size={13} className="text-primary" />
                    <span>Billing FAQ</span>
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                type="submit"
                className="ask-sources-submit-btn"
                disabled={busy || !question.trim()}
              >
                <BookOpen size={16} />
                <span>{busy ? 'Searching & Grounding...' : 'Ask with sources'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </section>

          {/* Card 2: Preview response */}
          <section className="content-card knowledge-preview-card">
            <div className="card-custom-header">
              <div className="header-icon-square blue">
                <Sparkles size={20} />
              </div>
              <div className="header-title-box">
                <h2>Preview response</h2>
                <p>Sample answer based on your question</p>
              </div>
            </div>

            <div className="response-steps-list">
              {displaySteps.map((step, index) => (
                <div className="response-step-row" key={index}>
                  <div className="step-number-bubble">{index + 1}</div>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>

            {/* Sources section */}
            <div className="response-sources-section">
              <div className="sources-title-row">
                <Link2 size={14} />
                <span>Verified Source Documents (Click to view full SOP)</span>
              </div>

              <div className="sources-cards-grid">
                {result?.sources && result.sources.length > 0 ? (
                  result.sources.map((src, i) => (
                    <div
                      key={i}
                      className="source-reference-card"
                      onClick={() => handleOpenSourceDoc(src.title || src.sourceTitle || 'Electrical Safety SOP')}
                      title="Click to view full document SOP"
                    >
                      <div className={`source-icon-badge ${src.category?.toLowerCase().includes('plumb') ? 'blue' : 'red'}`}>
                        <FileText size={18} />
                      </div>
                      <div className="source-info-box">
                        <strong>{src.title || src.sourceTitle || 'Knowledge Document'}</strong>
                        <small>{src.category || 'Maintenance SOP'} · Verified reference</small>
                      </div>
                      <ExternalLink size={14} className="source-external-link" />
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="source-reference-card"
                      onClick={() => handleOpenSourceDoc('Electrical Safety SOP')}
                      title="Click to view full document SOP"
                    >
                      <div className="source-icon-badge red">
                        <Zap size={18} />
                      </div>
                      <div className="source-info-box">
                        <strong>Electrical Safety SOP</strong>
                        <small>Electrical Safety · 3 chunks</small>
                      </div>
                      <ExternalLink size={14} className="source-external-link" />
                    </div>

                    <div
                      className="source-reference-card"
                      onClick={() => handleOpenSourceDoc('Plumbing Leakage Handling Guide')}
                      title="Click to view full document SOP"
                    >
                      <div className="source-icon-badge blue">
                        <Droplets size={18} />
                      </div>
                      <div className="source-info-box">
                        <strong>Plumbing Leakage Handling Guide</strong>
                        <small>Plumbing · 3 chunks</small>
                      </div>
                      <ExternalLink size={14} className="source-external-link" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Knowledge documents */}
        <aside className="knowledge-side-column">
          <section className="content-card knowledge-docs-card">
            <div className="docs-card-header">
              <div className="docs-header-left">
                <div className="header-icon-square blue">
                  <BookOpen size={19} />
                </div>
                <div>
                  <h2>Knowledge documents ({filteredDocs.length})</h2>
                  <p>Click any document to view the full SOP</p>
                </div>
              </div>

              <div className="docs-search-input">
                <Search size={13} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search SOPs..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="docs-list-vertical">
              {filteredDocs.map((doc) => (
                <div
                  className="doc-item-row"
                  key={doc.documentId || doc.title}
                  onClick={() => setViewingDoc(doc)}
                  title="Click to open and read full SOP"
                >
                  <div className={`doc-lead-icon ${doc.color || 'blue'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="doc-meta-info">
                    <strong>{doc.title}</strong>
                    <span>
                      <FileText size={12} className="inline-doc-icon" /> {doc.category} | {doc.chunkCount || 1} chunks
                    </span>
                  </div>
                  <div className="doc-actions-cluster">
                    <span className="doc-view-action-pill">
                      <Eye size={12} /> View SOP
                    </span>
                    <span className="doc-status-badge indexed">
                      <CheckCircle2 size={11} /> INDEXED
                    </span>
                    {canCreate && (
                      <button
                        className="doc-reindex-icon-btn"
                        title="Re-index vector embeddings"
                        disabled={reindexingId === doc.documentId}
                        onClick={(e) => handleReindex(doc.documentId, e)}
                      >
                        <RefreshCw size={12} className={reindexingId === doc.documentId ? 'spin' : ''} />
                      </button>
                    )}
                    <ChevronRight size={16} className="doc-arrow-icon" />
                  </div>
                </div>
              ))}
            </div>

            {canCreate && (
              <div className="add-doc-trigger-bar">
                <button
                  type="button"
                  className="secondary-button full"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus size={15} /> {showAddForm ? 'Close manual ingestion' : 'Add manual document'}
                </button>
              </div>
            )}
          </section>

          {/* Optional manual add knowledge form */}
          {canCreate && showAddForm && (
            <form className="content-card knowledge-form" onSubmit={add}>
              <div className="card-title">
                <Plus size={19} />
                <h2>Add manual knowledge</h2>
              </div>
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                placeholder="Type (e.g. SOP, Guide, Policy)"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              />
              <input
                placeholder="Category (e.g. Electrical Safety, Lift)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <textarea
                rows="5"
                placeholder="Document content (chunked automatically into vector embeddings)"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
              <button className="primary-button" disabled={busy}>
                Ingest & Index Document
              </button>
            </form>
          )}
        </aside>
      </div>

      {/* Full Screen / Drawer SOP Viewer Modal */}
      <SOPViewerModal
        doc={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onAskQuestion={handleAskAboutSOP}
      />
    </>
  );
}
