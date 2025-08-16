# Template System Guide

## Tổng quan
Template system được thiết kế để tạo ra các giao diện nhất quán với màu sắc và animation đồng nhất với login/register pages. Hệ thống này có thể tái sử dụng cho các trang khác trong ứng dụng.

## Màu sắc chính
- **Background**: `from-slate-900 via-purple-900 to-slate-900`
- **Primary Gradient**: `from-purple-600 to-blue-600`
- **Glass Effect**: `bg-white/10 backdrop-blur-xl border border-white/20`
- **Text Colors**: 
  - White: `text-white`
  - Gray: `text-gray-300`, `text-gray-400`
  - Accent: `text-purple-400`, `text-blue-400`, `text-green-400`, `text-orange-400`

## Components Template

### 1. DashboardTemplate
Wrapper chính cho tất cả dashboard pages với background gradient và animated elements.

```tsx
import { DashboardTemplate } from '@/components/ui/templates';

export default function MyPage() {
  return (
    <DashboardTemplate>
      {/* Your content here */}
    </DashboardTemplate>
  );
}
```

### 2. AdminLayout (Recommended)
Layout hoàn chỉnh cho admin pages với sidebar và navbar tích hợp.

```tsx
import { AdminLayout } from '@/components/ui/templates';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Your content here */}
    </AdminLayout>
  );
}
```

### 3. AdminSidebar
Sidebar component với navigation và animation mượt mà.

```tsx
import { AdminSidebar } from '@/components/ui/templates';

<AdminSidebar
  isOpen={isSidebarOpen}
  isHovered={isSidebarHovered}
  onToggle={handleSidebarToggle}
  onHoverChange={handleSidebarHoverChange}
/>
```

### 4. AdminNavbar
Navbar component với search, notifications và user menu.

```tsx
import { AdminNavbar } from '@/components/ui/templates';

<AdminNavbar
  onSidebarToggle={handleSidebarToggle}
  isSidebarOpen={isSidebarOpen}
/>
```

### 5. GlassCard
Card component với glass morphism effect.

```tsx
import { GlassCard } from '@/components/ui/templates';

<GlassCard hover={true}>
  <div className="p-6">
    <h3 className="text-white font-semibold">Card Title</h3>
    <p className="text-gray-300">Card content</p>
  </div>
</GlassCard>
```

### 6. GradientButton
Button với gradient background và hover effects.

```tsx
import { GradientButton } from '@/components/ui/templates';

// Primary button
<GradientButton variant="primary" size="md">
  <Icon className="h-4 w-4 mr-2" />
  Click me
</GradientButton>

// Secondary button
<GradientButton variant="secondary" size="lg">
  Secondary Action
</GradientButton>

// Outline button
<GradientButton variant="outline" size="sm">
  Outline Action
</GradientButton>
```

### 7. StatsCard
Card hiển thị thống kê với icon và gradient.

```tsx
import { StatsCard } from '@/components/ui/templates';
import { Users } from 'lucide-react';

<StatsCard
  title="Total Users"
  value="2,847"
  change="+12%"
  period="from last week"
  icon={Users}
  gradient="from-green-600 to-emerald-600"
  delay={0.1}
/>
```

### 8. ActionCard
Card cho các action với icon và description.

```tsx
import { ActionCard } from '@/components/ui/templates';
import { Settings } from 'lucide-react';

<ActionCard
  title="Site Management"
  description="Manage your sites, configure settings, and monitor performance."
  icon={Settings}
  color="text-purple-400"
  bgColor="bg-purple-600/10"
  borderColor="border-purple-500/20"
  action="Manage Sites"
  delay={0.1}
  onClick={() => console.log('Clicked!')}
/>
```

## Cách sử dụng cho trang mới

### Bước 1: Import templates
```tsx
import { 
  AdminLayout,
  GlassCard, 
  GradientButton, 
  StatsCard, 
  ActionCard 
} from '@/components/ui/templates';
```

### Bước 2: Sử dụng AdminLayout (Recommended)
```tsx
export default function NewPage() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Your content */}
      </div>
    </AdminLayout>
  );
}
```

### Bước 3: Sử dụng các components
```tsx
// Header section
<motion.div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-white">Page Title</h1>
  <GradientButton variant="primary">
    <Plus className="h-4 w-4 mr-2" />
    New Item
  </GradientButton>
</motion.div>

// Stats section
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard
    title="Metric 1"
    value="1,234"
    change="+5%"
    icon={Users}
    gradient="from-purple-600 to-blue-600"
  />
  {/* More stats cards */}
</div>

// Content section
<div className="grid gap-6 lg:grid-cols-2">
  <GlassCard>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Section Title</h3>
      {/* Content */}
    </div>
  </GlassCard>
</div>
```

## AdminLayout Features

### Sidebar Features
- ✅ Collapsible sidebar với hover expand
- ✅ Smooth animations và transitions
- ✅ Submenu support với nested navigation
- ✅ Active state indicators
- ✅ Super admin section
- ✅ Mobile responsive với overlay
- ✅ Color-coded navigation items

### Navbar Features
- ✅ Search functionality (desktop & mobile)
- ✅ Notification dropdown với unread count
- ✅ User profile dropdown
- ✅ Dark mode toggle
- ✅ Mobile responsive design
- ✅ Smooth animations

### Layout Features
- ✅ Responsive design
- ✅ Mobile overlay cho sidebar
- ✅ Animated background elements
- ✅ Glass morphism effects
- ✅ Consistent color scheme

## Animation Guidelines

### Staggered Animations
Sử dụng delay để tạo hiệu ứng xuất hiện tuần tự:

```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
  >
    {/* Item content */}
  </motion.div>
))}
```

### Hover Effects
Tất cả cards đều có hover effects mặc định:
- Scale: `scale(1.02)`
- Y transform: `translateY(-5px)`
- Background: `hover:bg-white/20`

## Responsive Design

### Grid Layouts
```tsx
// Responsive grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>

// Responsive flex
<div className="flex flex-col lg:flex-row items-center justify-between gap-4">
  {/* Content */}
</div>
```

### Mobile Optimization
```tsx
// Hide on mobile
<div className="hidden md:block">
  {/* Desktop only content */}
</div>

// Mobile specific
<div className="md:hidden">
  {/* Mobile only content */}
</div>
```

## Best Practices

### 1. Consistent Spacing
```tsx
// Use consistent spacing classes
<div className="p-6 space-y-8">  {/* Main container */}
<div className="space-y-4">      {/* Section spacing */}
<div className="space-y-2">      {/* Item spacing */}
```

### 2. Color Consistency
```tsx
// Always use the defined color palette
text-white          // Main text
text-gray-300       // Secondary text
text-gray-400       // Muted text
text-purple-400     // Accent text
bg-white/10         // Glass background
border-white/20     // Glass border
```

### 3. Animation Timing
```tsx
// Use consistent animation delays
delay={0.1}         // Quick items
delay={0.2}         // Medium items
delay={0.4}         // Slow items
delay={index * 0.1} // Staggered items
```

### 4. Icon Usage
```tsx
// Use Lucide React icons consistently
import { Users, Settings, Globe } from 'lucide-react';

// Icon sizing
className="h-4 w-4"  // Small icons
className="h-5 w-5"  // Medium icons
className="h-6 w-6"  // Large icons
```

## Customization

### Custom Gradients
```tsx
// You can use custom gradients
gradient="from-red-600 to-pink-600"
gradient="from-yellow-600 to-orange-600"
gradient="from-cyan-600 to-blue-600"
```

### Custom Colors
```tsx
// For specific use cases
color="text-red-400"
bgColor="bg-red-500/10"
borderColor="border-red-500/20"
```

### Sidebar Navigation
```tsx
// Custom navigation items
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: Home,
    color: 'text-blue-400'
  },
  {
    name: 'Users',
    icon: Users,
    color: 'text-green-400',
    subItems: [
      { name: 'User List', href: '/admin/users', icon: Users },
      { name: 'User Roles', href: '/admin/users/roles', icon: Shield },
    ]
  }
];
```

## Performance Tips

1. **Lazy Loading**: Sử dụng `motion.div` với `whileInView` cho content dài
2. **Optimized Animations**: Sử dụng `transform` thay vì `width/height` changes
3. **Reduced Motion**: Respect user preferences với `prefers-reduced-motion`
4. **Component Memoization**: Sử dụng `React.memo` cho components tĩnh

## Browser Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support  
- ✅ Safari: Full support (with webkit prefixes)
- ✅ Mobile browsers: Responsive design

## Migration Guide

### Từ DashboardTemplate sang AdminLayout
```tsx
// Old way
<DashboardTemplate>
  <div className="p-6 space-y-8">
    {/* Content */}
  </div>
</DashboardTemplate>

// New way (Recommended)
<AdminLayout>
  <div className="p-6 space-y-8">
    {/* Content */}
  </div>
</AdminLayout>
```

### Từ custom sidebar/navbar sang template
```tsx
// Old way - Custom components
<Sidebar />
<Navbar />
<main>{children}</main>

// New way - Integrated layout
<AdminLayout>
  {children}
</AdminLayout>
```

---

*Template System v2.0.0 - Cập nhật lần cuối: [Current Date]*
