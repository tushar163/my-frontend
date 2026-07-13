import {
  Bell,
  Bookmark,
  Building2,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  DoorOpen,
  Hotel,
  Star,
  Users,
  User,
  FileText,
  Image,
  ClipboardList,
  BarChart3,
  Settings,
  ShieldCheck,
  Megaphone,
  LifeBuoy,
  MapPin,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const MODULE_OPTIONS = [
  { id: "overview", name: "Overview" },
  { id: "users", name: "User Management" },
  { id: "properties", name: "Property Management" },
  { id: "hotels", name: "Hotel Management" },
  { id: "bookings", name: "Bookings" },
  { id: "cms", name: "CMS" },
  { id: "reports", name: "Reports & Analytics" },
  { id: "settings", name: "Settings" },
];

const adminSidebarConfig = {
  overview: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
  ],
  users: [
    { label: "All Users", href: "/admin/users", icon: Users },
    { label: "Agents", href: "/admin/users/agents", icon: User },
    { label: "Hotel Owners", href: "/admin/users/hotel-owners", icon: Hotel },
  ],
  properties: [
    { label: "All Properties", href: "/admin/properties", icon: Building2 },
    { label: "Pending Approval", href: "/admin/properties/pending", icon: ClipboardList },
    { label: "Cities & Locations", href: "/admin/properties/locations", icon: MapPin },
  ],
  hotels: [
    { label: "All Hotels", href: "/admin/hotels", icon: Hotel },
    { label: "Rooms", href: "/admin/hotels/rooms", icon: DoorOpen },
  ],
  bookings: [
    { label: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Payments", href: "/admin/bookings/payments", icon: Wallet },
  ],
  cms: [
    { label: "Banners", href: "/admin/cms/banners", icon: Image },
    { label: "Blogs", href: "/admin/cms/blogs", icon: FileText },
    { label: "Advertisements", href: "/admin/cms/advertisements", icon: Megaphone },
    { label: "Support Tickets", href: "/admin/cms/support", icon: LifeBuoy },
  ],
  reports: [
    { label: "Revenue Report", href: "/admin/reports/revenue", icon: TrendingUp },
    { label: "Platform Analytics", href: "/admin/reports/analytics", icon: BarChart3 },
    { label: "Agent Performance", href: "/admin/reports/agent-performance", icon: Users },
    { label: "Hotel Performance", href: "/admin/reports/hotel-performance", icon: Hotel },
  ],
  settings: [
    { label: "General Settings", href: "/admin/settings", icon: Settings },
    { label: "Roles & Permissions", href: "/admin/settings/roles", icon: ShieldCheck },
  ],
};

export const sidebarConfig = {
  USER: [
    { label: "Profile", href: "/dashboard", icon: User },
    { label: "Saved Properties", href: "/dashboard/saved", icon: Heart },
    { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ],
  AGENT: [
    { label: "Dashboard", href: "/agent", icon: LayoutDashboard },
    { label: "My Listings", href: "/agent/listings", icon: Building2 },
    { label: "Leads", href: "/agent/leads", icon: Users },
    { label: "Add Property", href: "/agent/listings/new", icon: PlusCircle },
    { label: "Saved Searches", href: "/agent/saved-searches", icon: Bookmark },
  ],
  HOTEL_OWNER: [
    { label: "Dashboard", href: "/hotel-owner", icon: LayoutDashboard },
    { label: "My Hotels", href: "/hotel-owner/hotels", icon: Hotel },
    { label: "Rooms", href: "/hotel-owner/rooms", icon: DoorOpen },
    { label: "Bookings", href: "/hotel-owner/bookings", icon: CalendarCheck },
    { label: "Reviews", href: "/hotel-owner/reviews", icon: Star },
    { label: "Revenue Report", href: "/hotel-owner/reports", icon: TrendingUp },
  ],
  ADMIN: adminSidebarConfig,
  SUPER_ADMIN: adminSidebarConfig,
};