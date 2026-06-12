# Incubator Algiers 3 - رقمنة حاضنة أعمال جامعة الجزائر 3

تطبيق مخصص لرقمنة وإدارة عمليات الحاضنة الخاصة بجامعة الجزائر 3.

## التقنيات المستخدمة
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 & shadcn/ui
- Prisma ORM (PostgreSQL)
- NextAuth.js للمصادقة
- next-intl للتعدد اللغوي (عربي، فرنسي، إنجليزي)

## متطلبات التشغيل
- Node.js >= 18
- npm

## إعداد المشروع محلياً

1. قم بنسخ المتغيرات البيئية من الملف المثال:
```bash
cp .env.example .env
```

2. قم بإضافة روابط قاعدة البيانات لـ Supabase (Database URL و Direct URL) في ملف `.env`.

3. تثبيت التبعيات:
```bash
npm install
```

4. مزامنة قاعدة البيانات (وإنشاء الجداول في Supabase):
```bash
npx prisma db push
```

5. تشغيل خادم التطوير:
```bash
npm run dev
```

التطبيق سيكون متاحاً على `http://localhost:3000`.

## النشر
المشروع جاهز للنشر على منصة [Vercel](https://vercel.com). تأكد من إعداد متغيرات البيئة في إعدادات المشروع على Vercel قبل عملية النشر.
