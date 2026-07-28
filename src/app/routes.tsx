import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { HomeGuard } from "./components/HomeGuard";
import { AllCategories } from "./pages/AllCategories";
import { CategoryPage } from "./pages/CategoryPage";
import { EstablishmentDetail } from "./pages/EstablishmentDetail";
import { Favorites } from "./pages/Favorites";
import { SearchPage } from "./pages/SearchPage";
import { MembershipPage } from "./pages/MembershipPage";
import { AboutPage } from "./pages/AboutPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReservationPage } from "./pages/ReservationPage";
import { PaymentPage } from "./pages/PaymentPage";
import { InterestsPage } from "./pages/InterestsPage";
import { PartnerLogin } from "./pages/partner/PartnerLogin";
import { PartnerDashboard } from "./pages/partner/PartnerDashboard";
import { PartnerRegister } from "./pages/partner/PartnerRegister";
import { PartnerOffers } from "./pages/partner/PartnerOffers";
import { ClientLogin } from "./pages/client/ClientLogin";
import { ClientRegister } from "./pages/client/ClientRegister";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { SplashScreen } from "./pages/SplashScreen";
import { OnboardingPage } from "./pages/OnboardingPage";
import { MentionsLegales } from "./pages/legal/MentionsLegales";
import { PolitiqueConfidentialite } from "./pages/legal/PolitiqueConfidentialite";
import { CGU } from "./pages/legal/CGU";
import { RewardsPage } from "./pages/RewardsPage";
import { EliteSelectionPage } from "./pages/EliteSelectionPage";
import { MapPage } from "./pages/MapPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminPartners } from "./pages/admin/AdminPartners";
import { AdminSubscriptions } from "./pages/admin/AdminSubscriptions";
import { AdminCommissions } from "./pages/admin/AdminCommissions";

export const router = createBrowserRouter([
  // ── Standalone screens (no shell) ────────────────────────────────────────
  { path: "/splash",          Component: SplashScreen },
  { path: "/onboarding",      Component: OnboardingPage },
  { path: "/client/login",    Component: ClientLogin },
  { path: "/client/register", Component: ClientRegister },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/interests",       Component: InterestsPage },
  { path: "/partner/login",     Component: PartnerLogin },
  { path: "/partner/register",  Component: PartnerRegister },
  { path: "/partner/dashboard", Component: PartnerDashboard },
  { path: "/partner/offers",    Component: PartnerOffers },

  // ── Admin (no shell) ──────────────────────────────────────────────────────
  { path: "/admin",               Component: AdminDashboard },
  { path: "/admin/users",         Component: AdminUsers },
  { path: "/admin/partners",      Component: AdminPartners },
  { path: "/admin/subscriptions", Component: AdminSubscriptions },
  { path: "/admin/commissions",   Component: AdminCommissions },

  // ── Main app with shell ───────────────────────────────────────────────────
  {
    path: "/",
    Component: Root,
    children: [
      // Core
      { index: true,                          Component: HomeGuard },
      { path: "categories",                   Component: AllCategories },
      { path: "category/:categoryId",         Component: CategoryPage },
      { path: "establishment/:id",            Component: EstablishmentDetail },
      { path: "establishment/:id/reserve",    Component: ReservationPage },
      { path: "establishment/:id/payment",    Component: PaymentPage },
      // Search & discovery
      { path: "search",                       Component: SearchPage },
      { path: "map",                          Component: MapPage },
      { path: "elite-selection",              Component: EliteSelectionPage },
      // User account
      { path: "favorites",                    Component: Favorites },
      { path: "reservations",                 Component: ReservationsPage },
      { path: "profile",                      Component: ProfilePage },
      { path: "settings",                     Component: SettingsPage },
      { path: "client/dashboard",             Component: ClientDashboard },
      // Membership & rewards
      { path: "membership",                   Component: MembershipPage },
      { path: "rewards",                      Component: RewardsPage },
      // Content
      { path: "about",                        Component: AboutPage },
      { path: "notifications",                Component: NotificationsPage },
      // Legal
      { path: "mentions-legales",             Component: MentionsLegales },
      { path: "confidentialite",              Component: PolitiqueConfidentialite },
      { path: "cgu",                          Component: CGU },
    ],
  },
]);
