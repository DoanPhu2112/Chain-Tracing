import { Report } from './_component/Report'

export default async function page({ params }: { params: { id: string } }) {
  const reportId = params?.id
  return <Report id={reportId} />
}
