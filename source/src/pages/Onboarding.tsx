import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useTags } from "@/context/TagContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { TAG_TREE, searchTags, getAllTagsFlat, type TagNode } from "@/lib/tagTree";
import { Check, MapPin, Compass, Loader2, Search, X, ChevronDown, Sparkles, SlidersHorizontal, Plus } from "lucide-react";

/* ── Alle danske byer ── */
const DANISH_CITIES = [
  "Aalborg","Aarhus","København","Odense","Esbjerg","Randers","Kolding","Horsens",
  "Vejle","Roskilde","Herning","Silkeborg","Næstved","Fredericia","Viborg","Køge",
  "Holstebro","Taastrup","Slagelse","Hillerød","Holbæk","Sønderborg","Svendborg",
  "Hjørring","Frederikshavn","Nørresundby","Ringsted","Haderslev","Skive","Birkerød",
  "Helsingør","Frederiksberg","Gentofte","Gladsaxe","Lyngby","Ballerup","Hvidovre",
  "Brøndby","Albertslund","Ishøj","Vallensbæk","Greve","Solrød","Stevns","Faxe",
  "Vordingborg","Guldborgsund","Lolland","Bornholm","Kalundborg","Odsherred",
  "Sorø","Lejre","Skanderborg","Favrskov","Hedensted","Billund","Varde","Vejen",
  "Tønder","Aabenraa","Fanø","Frederikssund","Halsnæs","Gribskov","Rudersdal",
  "Furesø","Allerød","Hørsholm","Dragør","Tårnby","Thisted","Morsø","Lemvig",
  "Struer","Ringkøbing-Skjern","Ikast-Brande","Norddjurs","Syddjurs","Odder",
  "Samsø","Mariagerfjord","Rebild","Vesthimmerland","Jammerbugt","Brønderslev",
  "Læsø","Nyborg","Assens","Faaborg-Midtfyn","Kerteminde","Nordfyns","Langeland","Ærø",
  "Middelfart","Frederiksberg","Nykøbing Falster","Nykøbing Mors","Skagen","Blokhus",
  "Løkken","Hvide Sande","Sæby","Grenaa","Ebeltoft","Ry","Brande","Give","Jelling",
  "Bramming","Ribe","Toftlund","Padborg","Kruså","Augustenborg","Nordborg","Gudhjem",
  "Rønne","Nexø","Allinge","Hasle","Maribo","Nakskov","Sakskøbing","Stege",
];

/* ── Postnummer → By mapping (de vigtigste) ── */
const ZIP_TO_CITY: Record<string, string> = {
  "1000":"København","1050":"København","1100":"København","1150":"København","1200":"København","1300":"København","1400":"København","1500":"København","1600":"København","1700":"København","1800":"København","1900":"København",
  "2000":"Frederiksberg","2100":"København","2200":"København","2300":"København","2400":"København","2450":"København","2500":"Valby","2600":"Glostrup","2605":"Brøndby","2610":"Rødovre","2620":"Albertslund","2625":"Vallensbæk","2630":"Taastrup","2635":"Ishøj","2640":"Hedehusene","2650":"Hvidovre","2660":"Brøndby","2670":"Greve","2680":"Solrød","2690":"Karlslunde",
  "2700":"Brønshøj","2720":"Vanløse","2730":"Herlev","2740":"Skovlunde","2750":"Ballerup","2760":"Måløv","2770":"Kastrup","2791":"Dragør","2800":"Lyngby","2820":"Gentofte","2830":"Virum","2840":"Holte","2850":"Nærum","2860":"Søborg","2870":"Dyssegård","2880":"Bagsværd","2900":"Hellerup","2920":"Charlottenlund","2930":"Klampenborg","2942":"Skodsborg","2950":"Vedbæk","2960":"Rungsted","2970":"Hørsholm","2980":"Kokkedal","2990":"Nivå",
  "3000":"Helsingør","3050":"Humlebæk","3060":"Espergærde","3070":"Snekkersten","3100":"Hornbæk","3120":"Dronningmølle","3140":"Ålsgårde","3200":"Helsinge","3210":"Vejby","3220":"Tisvildeleje","3230":"Græsted","3250":"Gilleleje","3300":"Frederiksværk","3310":"Ølsted","3320":"Skævinge","3330":"Gørløse","3360":"Liseleje","3370":"Melby","3390":"Hundested","3400":"Hillerød","3450":"Allerød","3460":"Birkerød","3480":"Fredensborg","3490":"Kvistgård","3500":"Værløse","3520":"Farum","3540":"Lynge","3550":"Slangerup","3600":"Frederikssund","3630":"Jægerspris","3650":"Ølstykke","3660":"Stenløse","3670":"Veksø",
  "4000":"Roskilde","4030":"Tune","4040":"Jyllinge","4050":"Skibby","4060":"Kirke Såby","4070":"Kirke Hyllinge","4100":"Ringsted","4130":"Viby Sjælland","4140":"Borup","4160":"Herlufmagle","4171":"Glumsø","4180":"Sorø","4190":"Munke Bjergby","4200":"Slagelse","4220":"Korsør","4230":"Skælskør","4241":"Vemmelev","4242":"Boeslunde","4243":"Rude","4250":"Fuglebjerg","4261":"Dalmose","4262":"Sandved","4270":"Høng","4281":"Gørlev","4291":"Ruds Vedby","4293":"Dianalund","4295":"Stenlille","4296":"Nyrup","4300":"Holbæk","4320":"Lejre","4330":"Hvalsø","4340":"Tølløse","4350":"Ugerløse","4360":"Kirke Eskilstrup","4370":"Store Merløse","4390":"Vipperød","4400":"Kalundborg","4500":"Nykøbing Sjælland","4520":"Svinninge","4532":"Gislinge","4534":"Hørve","4540":"Fårevejle","4550":"Asnæs","4560":"Vig","4571":"Grevinge","4572":"Nørre Asmindrup","4573":"Højby","4581":"Rørvig","4583":"Sjællands Odde","4591":"Føllenslev","4592":"Sejerø","4593":"Eskebjerg","4600":"Køge","4621":"Gadstrup","4622":"Havdrup","4623":"Lille Skensved","4632":"Bjæverskov","4640":"Faxe","4652":"Hårlev","4653":"Karise","4654":"Faxe Ladeplads","4660":"Store Heddinge","4671":"Strøby","4672":"Klippinge","4673":"Rødvig","4681":"Herfølge","4682":"Tureby","4683":"Rønnede","4684":"Holmegaard","4690":"Haslev","4700":"Næstved","4720":"Præstø","4733":"Tappernøje","4735":"Mern","4736":"Karrebæksminde","4750":"Lundby","4760":"Vordingborg","4771":"Kalvehave","4772":"Langebæk","4773":"Stensved","4780":"Stege","4791":"Borre","4792":"Askeby","4793":"Bogø","4800":"Nykøbing Falster","4840":"Nørre Alslev","4850":"Stubbekøbing","4862":"Guldborg","4871":"Horbelev","4872":"Idestrup","4873":"Væggerløse","4874":"Gedser","4880":"Nysted","4891":"Toreby","4892":"Kettinge","4894":"Øster Ulslev","4895":"Errindlev","4900":"Nakskov","4912":"Harpelunde","4913":"Horslunde","4920":"Søllested","4930":"Maribo","4941":"Bandholm","4943":"Torrig","4944":"Fejø","4951":"Nørreballe","4952":"Stokkemarke","4953":"Vesterborg","4960":"Holeby","4970":"Rødby","4983":"Dannemare","4990":"Sakskøbing",
  "5000":"Odense","5200":"Odense","5210":"Odense","5220":"Odense","5230":"Odense","5240":"Odense","5250":"Odense","5260":"Odense","5270":"Odense","5290":"Marslev","5300":"Kerteminde","5320":"Agedrup","5330":"Munkebo","5350":"Rynkeby","5370":"Mesinge","5380":"Dalby","5390":"Martofte","5400":"Bogense","5462":"Morud","5464":"Brenderup","5466":"Asperup","5471":"Søndersø","5474":"Veflinge","5485":"Skamby","5491":"Blommenslyst","5492":"Vissenbjerg","5500":"Middelfart","5540":"Ullerslev","5550":"Langeskov","5560":"Aarup","5580":"Nørre Aaby","5591":"Gelsted","5592":"Ejby","5600":"Faaborg","5610":"Assens","5620":"Glamsbjerg","5631":"Ebberup","5642":"Millinge","5672":"Broby","5683":"Haarby","5690":"Tommerup","5700":"Svendborg","5750":"Ringe","5762":"Vester Skerninge","5771":"Stenstrup","5772":"Kværndrup","5792":"Årslev","5800":"Nyborg","5853":"Ørbæk","5856":"Ryslinge","5863":"Ferritslev","5871":"Frørup","5874":"Hesselager","5881":"Skårup","5882":"Vejstrup","5883":"Oure","5884":"Gudme","5892":"Gudbjerg","5900":"Rudkøbing","5935":"Bagenkop","5953":"Tranekær","5960":"Marstal","5970":"Ærøskøbing",
  "6000":"Kolding","6040":"Egtved","6051":"Almind","6052":"Viuf","6064":"Jordrup","6070":"Christiansfeld","6091":"Bjert","6092":"Sønder Stenderup","6093":"Sjølund","6094":"Hejls","6100":"Haderslev","6200":"Aabenraa","6230":"Rødekro","6240":"Løgumkloster","6261":"Bredebro","6270":"Tønder","6280":"Højer","6300":"Gråsten","6310":"Broager","6320":"Egernsund","6330":"Padborg","6340":"Kruså","6360":"Tinglev","6372":"Bylderup-Bov","6392":"Bolderslev","6400":"Sønderborg","6430":"Nordborg","6440":"Augustenborg","6470":"Sydals","6500":"Vojens","6510":"Gram","6520":"Toftlund","6534":"Agerskov","6535":"Branderup","6541":"Bevtoft","6560":"Sommersted","6580":"Vamdrup","6600":"Vejen","6621":"Gesten","6622":"Bække","6623":"Vorbasse","6630":"Rødding","6640":"Lunderskov","6650":"Brørup","6660":"Lintrup","6670":"Holsted","6682":"Hovborg","6683":"Føvling","6690":"Gørding","6700":"Esbjerg","6705":"Esbjerg","6710":"Esbjerg","6715":"Esbjerg","6720":"Fanø","6731":"Tjæreborg","6740":"Bramming","6752":"Glejbjerg","6753":"Agerbæk","6760":"Ribe","6771":"Gredstedbro","6780":"Skærbæk","6792":"Rømø","6800":"Varde","6818":"Årre","6823":"Ansager","6830":"Nørre Nebel","6840":"Oksbøl","6851":"Janderup","6852":"Billum","6853":"Vejers","6854":"Henne","6855":"Outrup","6857":"Blåvand","6862":"Tistrup","6870":"Ølgod","6880":"Tarm","6893":"Hemmet","6900":"Skjern","6920":"Videbæk","6933":"Kibæk","6940":"Lem","6950":"Ringkøbing","6960":"Hvide Sande","6971":"Spjald","6973":"Ørnhøj","6980":"Tim","6990":"Ulfborg",
  "7000":"Fredericia","7007":"Fredericia","7080":"Børkop","7100":"Vejle","7120":"Vejle","7130":"Juelsminde","7140":"Stouby","7150":"Barrit","7160":"Tørring","7171":"Uldum","7173":"Vonge","7182":"Bredsten","7183":"Randbøl","7184":"Vandel","7190":"Billund","7200":"Grindsted","7250":"Hejnsvig","7260":"Sønder Omme","7270":"Stakroge","7280":"Sønder Felding","7300":"Jelling","7321":"Gadbjerg","7323":"Give","7330":"Brande","7361":"Ejstrupholm","7362":"Hampen","7400":"Herning","7430":"Ikast","7441":"Bording","7442":"Engesvang","7451":"Sunds","7470":"Karup","7480":"Vildbjerg","7490":"Aulum","7500":"Holstebro","7540":"Haderup","7550":"Sørvad","7560":"Hjerm","7570":"Vemb","7600":"Struer","7620":"Lemvig","7650":"Bøvlingbjerg","7660":"Bækmarksbro","7673":"Harboøre","7680":"Thyborøn","7700":"Thisted","7730":"Hanstholm","7741":"Frøstrup","7742":"Vesløs","7752":"Snedsted","7755":"Bedsted","7760":"Hurup","7770":"Vestervig","7790":"Thyholm","7800":"Skive","7830":"Vinderup","7840":"Højslev","7850":"Stoholm","7860":"Spøttrup","7870":"Roslev","7884":"Fur","7900":"Nykøbing Mors","7950":"Erslev","7960":"Karby","7970":"Redsted","7980":"Vils","7990":"Øster Assels",
  "8000":"Aarhus","8200":"Aarhus","8210":"Aarhus","8220":"Brabrand","8230":"Åbyhøj","8240":"Risskov","8250":"Egå","8260":"Viby","8270":"Højbjerg","8300":"Odder","8305":"Samsø","8310":"Tranbjerg","8320":"Mårslet","8330":"Beder","8340":"Malling","8350":"Hundslund","8355":"Solbjerg","8361":"Hasselager","8362":"Hørning","8370":"Hadsten","8380":"Trige","8381":"Tilst","8382":"Hinnerup","8400":"Ebeltoft","8410":"Rønde","8420":"Knebel","8444":"Balle","8450":"Hammel","8462":"Harlev","8464":"Galten","8471":"Sabro","8472":"Sporup","8500":"Grenaa","8520":"Lystrup","8530":"Hjortshøj","8541":"Skødstrup","8543":"Hornslet","8544":"Mørke","8550":"Ryomgård","8560":"Kolind","8570":"Trustrup","8581":"Nimtofte","8585":"Glesborg","8586":"Ørum","8592":"Anholt","8600":"Silkeborg","8620":"Kjellerup","8632":"Lemming","8641":"Sorring","8643":"Ans","8653":"Them","8654":"Bryrup","8660":"Skanderborg","8670":"Låsby","8680":"Ry","8700":"Horsens","8721":"Daugård","8722":"Hedensted","8723":"Løsning","8732":"Hovedgård","8740":"Brædstrup","8751":"Gedved","8752":"Østbirk","8762":"Flemming","8763":"Rask Mølle","8765":"Klovborg","8766":"Nørre Snede","8800":"Viborg","8830":"Tjele","8831":"Løgstrup","8832":"Skals","8840":"Rødkærsbro","8850":"Bjerringbro","8860":"Ulstrup","8870":"Langå","8881":"Thorsø","8882":"Fårvang","8883":"Gjern","8900":"Randers","8920":"Randers","8930":"Randers","8940":"Randers","8950":"Ørsted","8960":"Randers","8961":"Allingåbro","8963":"Auning","8970":"Havndal","8981":"Spentrup","8983":"Gjerlev","8990":"Fårup",
  "9000":"Aalborg","9200":"Aalborg","9210":"Aalborg","9220":"Aalborg","9230":"Svenstrup","9240":"Nibe","9260":"Gistrup","9270":"Klarup","9280":"Storvorde","9293":"Kongerslev","9300":"Sæby","9310":"Vodskov","9320":"Hjallerup","9330":"Dronninglund","9340":"Asaa","9352":"Dybvad","9362":"Gandrup","9370":"Hals","9380":"Vestbjerg","9381":"Sulsted","9382":"Tylstrup","9400":"Nørresundby","9430":"Vadum","9440":"Aabybro","9460":"Brovst","9480":"Løkken","9490":"Pandrup","9492":"Blokhus","9493":"Saltum","9500":"Hobro","9510":"Arden","9520":"Skørping","9530":"Støvring","9541":"Suldrup","9550":"Mariager","9560":"Hadsund","9574":"Bælum","9575":"Terndrup","9600":"Aars","9610":"Nørager","9620":"Aalestrup","9631":"Gedsted","9632":"Møldrup","9640":"Farsø","9670":"Løgstør","9681":"Ranum","9690":"Fjerritslev","9700":"Brønderslev","9740":"Jerslev","9750":"Øster Vrå","9760":"Vrå","9800":"Hjørring","9830":"Tårs","9850":"Hirtshals","9870":"Sindal","9881":"Bindslev","9900":"Frederikshavn","9940":"Læsø","9970":"Strandby","9981":"Jerup","9982":"Ålbæk","9990":"Skagen",
  "3700":"Rønne","3720":"Aakirkeby","3730":"Nexø","3740":"Svaneke","3751":"Østermarie","3760":"Gudhjem","3770":"Allinge","3782":"Klemensker","3790":"Hasle",
};

function lookupZip(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d{4}$/.test(trimmed)) return ZIP_TO_CITY[trimmed] || null;
  return null;
}

const ALL_CITIES = [...new Set(DANISH_CITIES)].sort((a, b) => a.localeCompare(b, "da"));

const POPULAR_CITIES = [
  { name: "København", emoji: "🏰" },
  { name: "Aarhus", emoji: "🏙️" },
  { name: "Aalborg", emoji: "🏠" },
  { name: "Odense", emoji: "🌷" },
  { name: "Esbjerg", emoji: "⚓" },
  { name: "Vejle", emoji: "🌊" },
];

const RADIUS_PRESETS = [
  { km: 10, label: "10 km", desc: "Nærområde" },
  { km: 25, label: "25 km", desc: "Regionen" },
  { km: 50, label: "50+", desc: "Større område" },
  { km: 100, label: "100 km", desc: "Landsdelen" },
  { km: 0, label: "Hele DK", desc: "Alt i Danmark" },
];

/* ═══════════════════════════════════════════════
   TAG-TREE GROUP — expandable parent with children
   ═══════════════════════════════════════════════ */
function TagTreeGroup({ parent, selectedTags, onToggle, forceExpand }: {
  parent: TagNode & { children?: TagNode[] };
  selectedTags: Set<string>;
  onToggle: (tag: string) => void;
  forceExpand?: boolean;
}) {
  const children = parent.children || [];
  const parentSelected = selectedTags.has(parent.tag);
  const childCount = children.filter(c => selectedTags.has(c.tag)).length;
  const hasSelections = parentSelected || childCount > 0;
  const [expanded, setExpanded] = useState(forceExpand || false);

  useEffect(() => {
    if (forceExpand) setExpanded(true);
  }, [forceExpand]);

  useEffect(() => {
    if (parentSelected && children.length > 0) setExpanded(true);
  }, [parentSelected]);

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 ${
      hasSelections ? "bg-[#4ECDC4]/8 ring-1 ring-[#4ECDC4]/30" : "bg-white/4 ring-1 ring-white/6"
    }`}>
      <button
        onClick={() => {
          onToggle(parent.tag);
          if (!parentSelected && children.length > 0) setExpanded(true);
        }}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left"
        data-testid={`tag-parent-${parent.tag}`}
      >
        <span className="text-lg">{parent.emoji}</span>
        <span className={`flex-1 text-sm font-semibold ${parentSelected ? "text-[#4ECDC4]" : "text-white/80"}`}>
          {parent.label}
        </span>
        {childCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold">{childCount}</span>
        )}
        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
          parentSelected ? "bg-[#4ECDC4] shadow-sm shadow-[#4ECDC4]/30" : "bg-white/10"
        }`}>
          {parentSelected && <Check size={12} className="text-white" />}
        </div>
        {children.length > 0 && (
          <ChevronDown
            size={14}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className={`text-white/30 transition-transform cursor-pointer hover:text-white/60 ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {expanded && children.length > 0 && (
        <div className="px-3 pb-3 pt-0.5">
          <div className="flex flex-wrap gap-1.5">
            {children.map(child => {
              const active = selectedTags.has(child.tag);
              return (
                <button
                  key={child.tag}
                  onClick={() => onToggle(child.tag)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                    active
                      ? "bg-[#4ECDC4]/20 text-[#4ECDC4] ring-1 ring-[#4ECDC4]/40"
                      : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/70"
                  }`}
                  data-testid={`tag-child-${child.tag}`}
                >
                  <span className="text-xs">{child.emoji}</span>
                  <span>{child.label}</span>
                  {active && <Check size={10} className="ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SEARCH RESULT CHIP — quick-add from search
   ═══════════════════════════════════════════════ */
function SearchResultChip({ node, isSelected, onToggle }: {
  node: TagNode; isSelected: boolean; onToggle: (tag: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(node.tag)}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
        isSelected
          ? "bg-[#4ECDC4]/20 text-[#4ECDC4] ring-1 ring-[#4ECDC4]/40"
          : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/70"
      }`}
    >
      <span className="text-xs">{node.emoji}</span>
      <span>{node.label}</span>
      {isSelected ? <Check size={10} className="ml-0.5" /> : <span className="text-white/20 ml-0.5">+</span>}
    </button>
  );
}


/* ═══════════════════════════════════════════════
   ONBOARDING — 3 Steps: By → Tags → Radius
   ═══════════════════════════════════════════════ */
export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { setCity, setCities, setOnboardingInterests, setSelectedTags: setContextTags, setRadius } = useTags();
  const { user, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Step 1: Cities (multiple)
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [zipMatch, setZipMatch] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Step 2: Tags
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const tagSearchRef = useRef<HTMLInputElement>(null);

  // Step 3: Radius
  const [selectedRadius, setSelectedRadius] = useState(25);

  const [saving, setSaving] = useState(false);

  // Filter cities (name search + zip lookup)
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return [];
    const q = citySearch.trim();
    // Check if it's a zip code
    const zipCity = lookupZip(q);
    if (zipCity) return [zipCity];
    // Normal name search
    const lower = q.toLowerCase();
    return ALL_CITIES.filter(c => c.toLowerCase().includes(lower) && !selectedCities.includes(c)).slice(0, 8);
  }, [citySearch, selectedCities]);

  // Track zip match separately
  useEffect(() => {
    setZipMatch(lookupZip(citySearch.trim()));
  }, [citySearch]);

  // Search results — uses the smart searchTags from tagTree
  const searchResults = useMemo(() => {
    if (!tagSearch.trim()) return [];
    return searchTags(tagSearch).slice(0, 20);
  }, [tagSearch]);

  // When NOT searching, show full tag tree
  const isSearching = tagSearch.trim().length > 0;

  // Close city dropdown on outside click
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target) &&
          searchRef.current && !searchRef.current.contains(target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities(prev => [...prev, city]);
    }
    setCitySearch("");
    setShowCityDropdown(false);
    setZipMatch(null);
  };

  const removeCity = (city: string) => {
    setSelectedCities(prev => prev.filter(c => c !== city));
  };

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  // Finish onboarding
  const handleFinish = async () => {
    setSaving(true);
    const tagArray = [...selectedTags];
    const parentTagSet = new Set(TAG_TREE.map(p => p.tag));
    const vibeKeys = tagArray.filter(t => parentTagSet.has(t));
    const primaryCity = selectedCities[0] || "";

    setCity(primaryCity);
    setCities(selectedCities);
    setOnboardingInterests(tagArray);
    setContextTags(tagArray);
    setRadius(selectedRadius);

    if (user?.id) {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          city: primaryCity,
          interests: tagArray,
          vibe_tags: vibeKeys,
          radius_km: selectedRadius,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) console.error("Onboarding save error:", error);
      await refreshProfile();
    }

    setSaving(false);
    setLocation("/feed");
  };

  const tagCount = selectedTags.size;
  const radiusLabel = selectedRadius === 0 ? "Hele DK" : `${selectedRadius} km`;
  const radiusCircleSize = selectedRadius === 0 ? 200 : Math.min(80 + (selectedRadius / 200) * 120, 200);

  return (
    <div
      className="relative min-h-svh flex flex-col"
      style={{ background: "#0D1220" }}
      data-testid="onboarding-page"
    >
      {/* Progress */}
      <div className="flex gap-2 px-8 pt-14 pb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[#4ECDC4]" : "bg-white/15"}`} />
        ))}
      </div>
      <div className="px-8 pb-1">
        <span className="text-white/25 text-[10px] font-medium">Trin {step} af {totalSteps}</span>
      </div>

      <div className="flex-1 px-6 pt-3 pb-8 flex flex-col overflow-hidden">

        {/* ═══════ Step 1: Byer (multi) ═══════ */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/15 flex items-center justify-center">
                <MapPin size={20} className="text-[#4ECDC4]" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Hvor vil du opleve?</h1>
                <p className="text-white/40 text-sm">Vælg en eller flere byer</p>
              </div>
            </div>

            {/* Search: by-navn eller postnummer */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                ref={searchRef}
                type="text"
                inputMode="search"
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => citySearch && setShowCityDropdown(true)}
                placeholder="Skriv by eller postnummer..."
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
                data-testid="input-city-search"
              />
              {citySearch && (
                <button onClick={() => { setCitySearch(""); setShowCityDropdown(false); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={16} /></button>
              )}
              {showCityDropdown && filteredCities.length > 0 && (
                <div ref={dropdownRef} className="absolute top-full mt-1.5 left-0 right-0 rounded-xl bg-[#1a1f2e] border border-white/10 shadow-xl z-50 max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                  {filteredCities.map(city => {
                    const alreadyAdded = selectedCities.includes(city);
                    return (
                      <button key={city} onClick={() => !alreadyAdded && addCity(city)} className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/8 flex items-center gap-2 ${alreadyAdded ? "text-[#4ECDC4] bg-[#4ECDC4]/10" : "text-white/80"}`}>
                        <MapPin size={14} className="text-white/30 shrink-0" />
                        <span className="flex-1">{city}</span>
                        {zipMatch && <span className="text-white/30 text-xs">({citySearch})</span>}
                        {alreadyAdded ? <Check size={14} className="text-[#4ECDC4]" /> : <Plus size={14} className="text-white/30" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Valgte byer chips */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCities.map((city, i) => (
                  <div key={city} className="px-3 py-1.5 rounded-full bg-[#4ECDC4]/15 border border-[#4ECDC4]/30 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <MapPin size={12} className="text-[#4ECDC4]" />
                    <span className="text-[#4ECDC4] text-sm font-medium">{city}</span>
                    {i === 0 && <span className="text-[#4ECDC4]/40 text-[9px]">primær</span>}
                    <button onClick={() => removeCity(city)} className="ml-0.5 text-[#4ECDC4]/60 hover:text-[#4ECDC4]"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">Populære byer</p>
            <div className="grid grid-cols-3 gap-2.5">
              {POPULAR_CITIES.map(c => {
                const active = selectedCities.includes(c.name);
                return (
                  <button key={c.name} onClick={() => active ? removeCity(c.name) : addCity(c.name)} className={`relative p-3 rounded-2xl text-center transition-all duration-200 ${active ? "bg-[#4ECDC4]/15 border-2 border-[#4ECDC4]" : "bg-white/5 border border-white/8 hover:bg-white/8"}`} data-testid={`city-${c.name.toLowerCase()}`}>
                    {active && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#4ECDC4] flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                    <span className="text-xl block mb-0.5">{c.emoji}</span>
                    <span className={`text-xs font-semibold ${active ? "text-[#4ECDC4]" : "text-white"}`}>{c.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <button onClick={() => setStep(2)} disabled={selectedCities.length === 0} className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-lg ${selectedCities.length > 0 ? "bg-[#4ECDC4] text-white hover:bg-[#3dbdb5] active:scale-[0.98]" : "bg-white/10 text-white/30 cursor-not-allowed"}`} data-testid="button-naeste-1">
                Næste {selectedCities.length > 0 && `(${selectedCities.length} ${selectedCities.length === 1 ? "by" : "byer"})`}
              </button>
            </div>
          </>
        )}

        {/* ═══════ Step 2: TAG-GUIDE ═══════ */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/15 flex items-center justify-center">
                <Sparkles size={20} className="text-[#4ECDC4]" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Hvad er du til?</h1>
                <p className="text-white/40 text-sm">Vælg alt der matcher dig</p>
              </div>
            </div>

            {/* Explainer */}
            <div className="rounded-xl bg-[#4ECDC4]/8 border border-[#4ECDC4]/20 px-3.5 py-2.5 mb-3">
              <div className="flex items-start gap-2">
                <SlidersHorizontal size={14} className="text-[#4ECDC4] mt-0.5 shrink-0" />
                <p className="text-white/50 text-[11px] leading-relaxed">
                  Dine tags styrer dit feed, forslag og matchning. Jo mere du vælger, jo bedre kender vi dig.
                </p>
              </div>
            </div>

            {/* ── SEARCH FIELD — the smart one ── */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                ref={tagSearchRef}
                type="text"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                placeholder="Søg... fx cykling, jazz, yoga, hiking"
                className="w-full pl-9 pr-8 py-3 rounded-xl bg-white/8 border border-white/12 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#4ECDC4]/50 focus:bg-white/10 transition-all"
                data-testid="input-tag-search"
              />
              {tagSearch && (
                <button
                  onClick={() => { setTagSearch(""); tagSearchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Tag count + reset */}
            {tagCount > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-[#4ECDC4]/15 text-[#4ECDC4] text-[11px] font-semibold">
                  {tagCount} valgt
                </span>
                <button onClick={() => setSelectedTags(new Set())} className="text-white/30 text-[10px] hover:text-white/50">
                  Nulstil
                </button>
              </div>
            )}

            {/* ── SEARCH RESULTS (when typing) ── */}
            {isSearching && (
              <div className="flex-1 overflow-y-auto -mx-1 px-1" style={{ maxHeight: "calc(100svh - 360px)", scrollbarWidth: "none" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} className="text-[#4ECDC4]" />
                  <span className="text-white/30 text-[10px] font-medium">Resultater for "{tagSearch}"</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {searchResults.map(node => (
                      <SearchResultChip
                        key={node.tag}
                        node={node}
                        isSelected={selectedTags.has(node.tag)}
                        onToggle={toggleTag}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/30 text-sm">Ingen tags matcher "{tagSearch}"</p>
                    <p className="text-white/20 text-xs mt-1">Prøv noget andet, fx "løb" eller "musik"</p>
                  </div>
                )}
              </div>
            )}

            {/* ── FULL TAG TREE (when NOT searching) ── */}
            {!isSearching && (
              <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-2" style={{ maxHeight: "calc(100svh - 360px)", scrollbarWidth: "none" }}>
                {TAG_TREE.map(parent => (
                  <TagTreeGroup
                    key={parent.tag}
                    parent={parent}
                    selectedTags={selectedTags}
                    onToggle={toggleTag}
                  />
                ))}
              </div>
            )}

            {/* Bottom actions */}
            <div className="pt-4 border-t border-white/5 mt-2">
              <button
                onClick={() => setStep(3)}
                disabled={tagCount < 1}
                className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-lg ${
                  tagCount >= 1 ? "bg-[#4ECDC4] text-white hover:bg-[#3dbdb5] active:scale-[0.98]" : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
                data-testid="button-naeste-2"
              >
                Næste ({tagCount} tags valgt)
              </button>
              <button onClick={() => setStep(1)} className="w-full mt-3 text-white/40 text-sm hover:text-white/60 transition-colors">
                Tilbage
              </button>
            </div>
          </>
        )}

        {/* ═══════ Step 3: Radius ═══════ */}
        {step === 3 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/15 flex items-center justify-center">
                <Compass size={20} className="text-[#4ECDC4]" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Søgeradius</h1>
                <p className="text-white/40 text-sm">Hvor langt vil du rejse for oplevelser?</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="rounded-full border-2 border-[#4ECDC4]/40 flex items-center justify-center transition-all duration-500 mb-6"
                style={{ width: `${radiusCircleSize}px`, height: `${radiusCircleSize}px`, background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
              >
                <div className="text-center">
                  {selectedRadius === 0 ? (
                    <><span className="text-[#4ECDC4] text-2xl font-bold block">Hele</span><span className="text-[#4ECDC4]/60 text-sm">Danmark</span></>
                  ) : (
                    <><span className="text-[#4ECDC4] text-4xl font-bold">{selectedRadius}</span><span className="text-[#4ECDC4]/50 text-lg ml-1">km</span></>
                  )}
                </div>
              </div>

              <p className="text-white/40 text-xs mb-6 text-center max-w-[240px]">
                {selectedRadius === 0 && "Se alt i hele Danmark — perfekt hvis du rejser efter specielle oplevelser"}
                {selectedRadius > 0 && selectedRadius <= 10 && "Oplevelser tæt på dig — gåafstand eller kort køretur"}
                {selectedRadius > 10 && selectedRadius <= 50 && "Dit nærområde — en kort køretur væk"}
                {selectedRadius > 50 && selectedRadius <= 100 && "Hele din landsdel — plads til weekendture"}
                {selectedRadius > 100 && selectedRadius !== 0 && "Halvdelen af Danmark eller mere — til de særlige oplevelser"}
              </p>

              <div className="w-full px-4 mb-6">
                <input type="range" min="0" max="250" step="5" value={selectedRadius} onChange={e => setSelectedRadius(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${(selectedRadius / 250) * 100}%, rgba(255,255,255,0.15) ${(selectedRadius / 250) * 100}%, rgba(255,255,255,0.15) 100%)` }}
                  data-testid="radius-slider"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white/30 text-xs">Hele DK</span>
                  <span className="text-white/30 text-xs">250 km</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {RADIUS_PRESETS.map(p => {
                  const active = selectedRadius === p.km;
                  return (
                    <button key={p.km} onClick={() => setSelectedRadius(p.km)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-center min-w-[60px] ${active ? "bg-[#4ECDC4] text-white shadow-lg shadow-[#4ECDC4]/20" : "bg-white/5 text-white/40 border border-white/8 hover:bg-white/10"}`}>
                      <span>{p.label}</span>
                      <span className={`text-[9px] mt-0.5 ${active ? "text-white/70" : "text-white/25"}`}>{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile summary */}
            <div className="rounded-xl bg-white/4 border border-white/8 px-4 py-3 mb-3 mt-4">
              <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold mb-2">Din profil</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded-lg bg-white/8 text-white/60 text-[10px] flex items-center gap-1"><MapPin size={10} /> {selectedCities.join(", ")}</span>
                <span className="px-2 py-1 rounded-lg bg-[#4ECDC4]/15 text-[#4ECDC4] text-[10px] font-semibold">{tagCount} tags</span>
                <span className="px-2 py-1 rounded-lg bg-white/8 text-white/60 text-[10px]">{radiusLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleFinish} disabled={saving} className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-base hover:bg-[#3dbdb5] active:scale-[0.98] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60" data-testid="button-kom-i-gang-onboarding">
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saving ? "Sætter op..." : "Start mit feed"}
              </button>
              <button onClick={() => setStep(2)} className="text-white/40 text-sm hover:text-white/60 transition-colors">Tilbage</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
