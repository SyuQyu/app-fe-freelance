import { notFound } from 'next/navigation';
import { LazyPageRenderer } from '@/components/LazyPageRenderer';
import { PATH_TO_ACTIVE_PAGE, type ActivePage } from '@/lib/navigation';

interface PageParams {
  slug?: string[];
}

interface PageProps {
  params?: Promise<PageParams>;
}

const PATH_CACHE = new Map<string, ActivePage>();

const resolveActivePageFromParams = async (params?: Promise<PageParams>): Promise<ActivePage | undefined> => {
  const resolved = (await params) ?? {};
  const slug = resolved.slug ?? [];
  const path = `/${slug.join('/')}`;

  if (PATH_CACHE.has(path)) {
    return PATH_CACHE.get(path);
  }

  const activePage = PATH_TO_ACTIVE_PAGE[path];
  if (activePage) {
    PATH_CACHE.set(path, activePage);
  }

  return activePage;
};

export default async function RoutedPage({ params }: PageProps) {
  const activePage = await resolveActivePageFromParams(params);

  if (!activePage) {
    notFound();
  }

  return <LazyPageRenderer activePage={activePage} />;
}
