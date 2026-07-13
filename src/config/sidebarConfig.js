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
} from "lucide-react";

export const MODULE_OPTIONS = [
  { id: "overview", name: "Overview" },
  { id: "users", name: "User Management" },
  { id: "properties", name: "Property Management" },
  { id: "hotels", name: "Hotel Management" },
  { id: "bookings", name: "Bookings" },
  { id: "cms", name: "CMS" },
];

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
  ],
  HOTEL_OWNER: [
    { label: "Dashboard", href: "/hotel-owner", icon: LayoutDashboard },
    { label: "My Hotels", href: "/hotel-owner/hotels", icon: Hotel },
    { label: "Rooms", href: "/hotel-owner/rooms", icon: DoorOpen },
    { label: "Bookings", href: "/hotel-owner/bookings", icon: CalendarCheck },
    { label: "Reviews", href: "/hotel-owner/reviews", icon: Star },
  ],
  ADMIN: {
    overview: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
    users: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "Agents", href: "/admin/users/agents", icon: User },
    ],
    properties: [
      { label: "All Properties", href: "/admin/properties", icon: Building2 },
      { label: "Pending Approval", href: "/admin/properties/pending", icon: ClipboardList },
    ],
    hotels: [
      { label: "All Hotels", href: "/admin/hotels", icon: Hotel },
    ],
    bookings: [
      { label: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
    ],
    cms: [
      { label: "Banners", href: "/admin/cms/banners", icon: Image },
      { label: "Blogs", href: "/admin/cms/blogs", icon: FileText },
    ],
  },
  SUPER_ADMIN: null, // same as ADMIN
};
