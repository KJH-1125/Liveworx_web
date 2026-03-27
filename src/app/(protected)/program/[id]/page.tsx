import { redirect, notFound } from 'next/navigation'

const programRoutes: Record<string, string> = {
  'pack_bas_cumst': '/master/customer',
  'pack_bas_itmmst': '/master/item',
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const route = programRoutes[id.toLowerCase()]

  if (route) {
    redirect(route)
  }

  notFound()
}
