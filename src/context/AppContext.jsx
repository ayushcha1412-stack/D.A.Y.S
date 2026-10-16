import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as API from '../utils/api';

// ── Static defaults ────────────────────────────────────────────────────────
import { reviews       as defaultReviews      } from '../data/reviews';
import { plans         as defaultPlans        } from '../data/plans';
import { contactInfo   as defaultContact      } from '../data/contact';
import { achievements  as defaultAchievements,
         achievementStats as defaultStats     } from '../data/achievements';
import { classes       as defaultClasses      } from '../data/classes';
import { scheduleSlots as defaultSchedule     } from '../data/schedule';
import { facilitators  as defaultFacilitators } from '../data/facilitators';
import { galleryItems  as defaultGallery      } from '../data/gallery';
import { expertiseAreas as defaultExpertise   } from '../data/expertise';

const AppContext = createContext(null);

// ── Persist helpers ────────────────────────────────────────────────────────
function usePersisted(lsKey, def) {
  return useState(() => {
    try { const r = localStorage.getItem(lsKey); return r ? JSON.parse(r) : def; }
    catch { return def; }
  });
}
function persist(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── AppProvider ────────────────────────────────────────────────────────────
export function AppProvider({ children }) {

  // UI
  const [meditationMode, setMeditationMode] = useLocalStorage('yoga_meditation_mode', false);
  useEffect(() => { document.body.classList.toggle('meditation-mode', !!meditationMode); }, [meditationMode]);
  const toggleMeditationMode = useCallback(() => setMeditationMode(p => !p), [setMeditationMode]);

  const [membershipDraft, setMembershipDraft] = useLocalStorage('yoga_membership_draft', {});
  const [selectedClass,   setSelectedClass  ] = useLocalStorage('yoga_selected_class', null);
  const [reviewDraft,     setReviewDraft    ] = useLocalStorage('yoga_review_draft', { name:'', rating:5, review:'', category:'' });
  const [preferences,     setPreferences   ] = useLocalStorage('yoga_preferences', { preferredMode:'All', preferredTime:'morning' });
  const updatePreferences = useCallback(u => setPreferences(p => ({ ...p, ...u })), [setPreferences]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Site content — initialised from localStorage, synced from MongoDB
  const [siteReviews,      setSiteReviews     ] = usePersisted('owner_reviews',      defaultReviews);
  const [sitePlans,        setSitePlans       ] = usePersisted('owner_plans',        defaultPlans);
  const [siteContact,      setSiteContact     ] = usePersisted('owner_contact',      defaultContact);
  const [siteAchievements, setSiteAchievements] = usePersisted('owner_achievements', defaultAchievements);
  const [siteStats,        setSiteStats       ] = usePersisted('owner_stats',        defaultStats);
  const [siteClasses,      setSiteClasses     ] = usePersisted('owner_classes',      defaultClasses.filter(Boolean));
  const [siteSchedule,     setSiteSchedule    ] = usePersisted('owner_schedule',     defaultSchedule);
  const [siteFacilitators, setSiteFacilitators] = usePersisted('owner_facilitators', defaultFacilitators);
  const [siteGallery,      setSiteGallery     ] = usePersisted('owner_gallery',      defaultGallery);
  const [siteExpertise,    setSiteExpertise   ] = usePersisted('owner_expertise',    defaultExpertise);

  const updateReviews      = useCallback(v => { setSiteReviews(v);      persist('owner_reviews',      v); }, [setSiteReviews]);
  const updatePlans        = useCallback(v => { setSitePlans(v);        persist('owner_plans',        v); }, [setSitePlans]);
  const updateContact      = useCallback(v => { setSiteContact(v);      persist('owner_contact',      v); }, [setSiteContact]);
  const updateAchievements = useCallback(v => { setSiteAchievements(v); persist('owner_achievements', v); }, [setSiteAchievements]);
  const updateStats        = useCallback(v => { setSiteStats(v);        persist('owner_stats',        v); }, [setSiteStats]);
  const updateClasses      = useCallback(v => { setSiteClasses(v);      persist('owner_classes',      v); }, [setSiteClasses]);
  const updateSchedule     = useCallback(v => { setSiteSchedule(v);     persist('owner_schedule',     v); }, [setSiteSchedule]);
  const updateFacilitators = useCallback(v => { setSiteFacilitators(v); persist('owner_facilitators', v); }, [setSiteFacilitators]);
  const updateGallery      = useCallback(v => { setSiteGallery(v);      persist('owner_gallery',      v); }, [setSiteGallery]);
  const updateExpertise    = useCallback(v => { setSiteExpertise(v);    persist('owner_expertise',    v); }, [setSiteExpertise]);

  // User submissions
  const [pendingEnquiries,   setPendingEnquiries  ] = usePersisted('owner_enquiries',       []);
  const [pendingMemberships, setPendingMemberships] = usePersisted('owner_memberships',     []);
  const [pendingReviews,     setPendingReviews    ] = usePersisted('owner_pending_reviews', []);

  // ── Sync from MongoDB on app load ─────────────────────────────────────
  useEffect(() => {
    async function sync() {
      try {
        await API.checkHealth(); // throws if backend offline

        const results = await Promise.allSettled([
          API.getPlans(),
          API.getClasses(),
          API.getSchedule(),
          API.getReviews(),
          API.getFacilitators(),
          API.getGallery(),
          API.getAchievements(),
          API.getSiteConfig(),
        ]);

        const set = (res, setter, lsKey, pick = d => d.data) => {
          if (res.status === 'fulfilled') {
            const val = pick(res.value);
            if (val && (Array.isArray(val) ? val.length : Object.keys(val).length)) {
              setter(val); persist(lsKey, val);
            }
          }
        };

        set(results[0], setSitePlans,        'owner_plans');
        set(results[1], setSiteClasses,      'owner_classes');
        set(results[2], setSiteSchedule,     'owner_schedule');
        set(results[3], setSiteReviews,      'owner_reviews');
        set(results[4], setSiteFacilitators, 'owner_facilitators');
        set(results[5], setSiteGallery,      'owner_gallery');
        set(results[6], setSiteAchievements, 'owner_achievements');

        // Config
        if (results[7].status === 'fulfilled') {
          const cfg = results[7].value?.data;
          if (cfg) {
            const merged = { ...defaultContact, ...cfg };
            setSiteContact(merged); persist('owner_contact', merged);
          }
        }

        // If admin is logged in, also load enquiries + memberships
        if (API.getToken()) {
          const [enq, mem] = await Promise.allSettled([
            API.getEnquiries(),
            API.getMemberships(),
          ]);
          if (enq.status === 'fulfilled' && enq.value?.data) {
            setPendingEnquiries(enq.value.data); persist('owner_enquiries', enq.value.data);
          }
          if (mem.status === 'fulfilled' && mem.value?.data) {
            setPendingMemberships(mem.value.data); persist('owner_memberships', mem.value.data);
          }
        }

      } catch {
        // Backend offline — localStorage/defaults already loaded, that's fine
      }
    }
    sync();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form submission helpers ───────────────────────────────────────────
  const addEnquiry = useCallback(async (entry) => {
    try { await API.submitEnquiry(entry); } catch {}  // save to MongoDB
    setPendingEnquiries(prev => { const u = [entry, ...prev]; persist('owner_enquiries', u); return u; });
  }, [setPendingEnquiries]);

  const addMembership = useCallback(async (entry) => {
    try { await API.submitMembership(entry); } catch {}
    setPendingMemberships(prev => { const u = [entry, ...prev]; persist('owner_memberships', u); return u; });
  }, [setPendingMemberships]);

  const addPendingReview = useCallback(async (entry) => {
    try { await API.submitReview(entry); } catch {}
    setPendingReviews(prev => { const u = [entry, ...prev]; persist('owner_pending_reviews', u); return u; });
  }, [setPendingReviews]);

  const updateEnquiries      = useCallback(v => { setPendingEnquiries(v);   persist('owner_enquiries',       v); }, [setPendingEnquiries]);
  const updateMemberships    = useCallback(v => { setPendingMemberships(v); persist('owner_memberships',     v); }, [setPendingMemberships]);
  const updatePendingReviews = useCallback(v => { setPendingReviews(v);     persist('owner_pending_reviews', v); }, [setPendingReviews]);

  // ── Dashboard overlay ─────────────────────────────────────────────────
  const [dashOpen,     setDashOpen    ] = useState(false);
  const [dashUnlocked, setDashUnlocked] = useState(() => sessionStorage.getItem('owner_unlocked') === '1');
  const unlockDash = useCallback(() => { sessionStorage.setItem('owner_unlocked', '1'); setDashUnlocked(true); }, []);

  return (
    <AppContext.Provider value={{
      meditationMode, toggleMeditationMode,
      membershipDraft, setMembershipDraft,
      selectedClass,   setSelectedClass,
      reviewDraft,     setReviewDraft,
      preferences,     updatePreferences,
      scrolled,

      siteReviews,      updateReviews,
      sitePlans,        updatePlans,
      siteContact,      updateContact,
      siteAchievements, updateAchievements,
      siteStats,        updateStats,
      siteClasses,      updateClasses,
      siteSchedule,     updateSchedule,
      siteFacilitators, updateFacilitators,
      siteGallery,      updateGallery,
      siteExpertise,    updateExpertise,

      pendingEnquiries,   addEnquiry,   updateEnquiries,
      pendingMemberships, addMembership, updateMemberships,
      pendingReviews,     addPendingReview, updatePendingReviews,

      dashOpen, setDashOpen,
      dashUnlocked, unlockDash,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
