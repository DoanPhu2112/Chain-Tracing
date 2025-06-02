import { Divider } from 'antd'
import { Card, CardContent } from '../../../components/ui/card'
import { TokenIcon } from '@web3icons/react'
import { Button } from '@/components/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { timeAgo } from '@/components/tx/TxDataTable'

export interface ReportCardProps {
  category: string
  description: string
  reporter: string
  reportedAddresses: string[]
  reportedDomain: string[]
  timestamp: number
  reportId: number
}

export const ReportCard = ({
  category,
  description,
  reporter,
  reportedAddresses,
  reportedDomain,
  timestamp,
  reportId,
}: ReportCardProps) => {
  return (
    <Card className="p-4 rounded-2xl bg-white border border-gray-200 pt-6">
      <CardContent>
        <div className="text-gray-600 text-label-xl-sec my-6">
          Submitted by <span className="font-medium">{reporter}</span>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-6">
            <div className="text-2xl-semibold font-mono font-bold text-gray-900 w-[180px]">
              {category}
            </div>
            <div className="flex-1">
              <p className="text-gray-500 whitespace-pre-wrap leading-relaxed line-clamp-6">
                {description}
              </p>
            </div>
          </div>

          <Divider />

          {/* Reported Addresses */}
          {reportedAddresses.length > 0 && (
            <div className="space-y-4">
              {reportedAddresses.slice(0, 3).map((add, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="text-lg font-semibold text-gray-400 w-[180px]">
                    Reported Addresses
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 flex-1">
                    <TokenIcon symbol="eth" variant="branded" />
                    <span className="text-gray-700 font-sans">{add}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reported Domains */}
          {reportedDomain.length > 0 && (
            <>
              <Divider />

              <div className="space-y-4">
                {reportedDomain.length &&
                  reportedDomain.map((dom, index) => (
                    <div key={index} className="flex items-center space-x-6">
                      <div className="text-lg font-semibold text-gray-400 w-[180px]">
                        Reported Domains
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200 flex-1">
                        <a
                          href={dom}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {dom}
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
          <Divider />
          <div className="flex items-center justify-between">
            <Badge size="lg" variant="outline">
              {timeAgo(timestamp)}
            </Badge>
            <Link href={`/report/${reportId}`}>
              <Button variant="secondary">View details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
